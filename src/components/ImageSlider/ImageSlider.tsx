import clsx from "clsx";
import { useEffect, useState } from "react";

import CloseIcon from "../../icons/close";
import { ImagesMultisize } from "../../types/characters";
import { ImageSearch } from "../../types/stories";
import DownloadIcon from "../../icons/download";

interface ImageSliderProps {
  images: ImagesMultisize[] | ImageSearch[];
  imageViewingIdx?: number | null;
  imageViewingUrl?: string | null;
  hide: () => void;
}

const SLIDE_DURATION = 500; // durée de transition en ms
const MIN_SWIPE_DISTANCE = 50; // distance minimale de swipe en pixels

const ImageSlider: React.FC<ImageSliderProps> = (props) => {
  // Index de l’image courante
  const [currentIdx, setCurrentIdx] = useState<number | null>(
    props.imageViewingIdx ?? null
  );
  // Index cible pour la transition
  const [pendingIdx, setPendingIdx] = useState<number | null>(null);
  // Sens de la transition
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );
  // Permet d'activer l'animation CSS de slide
  const [animate, setAnimate] = useState(false);

  // Gestion des événements tactiles
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Synchronisation de currentIdx avec le prop imageViewingIdx
  useEffect(() => {
    if (props.imageViewingIdx && props.imageViewingIdx !== null) {
      setCurrentIdx(props.imageViewingIdx);
    } else {
      setCurrentIdx(null);
    }
  }, [props.imageViewingIdx, props.images]);

  // Préchargement des images adjacentes pour une transition plus fluide
  useEffect(() => {
    if (currentIdx !== null) {
      const preload = (index: number) => {
        if (index >= 0 && index < props.images.length) {
          const img = new Image();
          img.src = props.images[index].original;
        }
      };
      preload(currentIdx - 1);
      preload(currentIdx + 1);
    }
  }, [currentIdx, props.images]);

  // Gestion de la transition slide lorsque pendingIdx change
  useEffect(() => {
    if (pendingIdx !== null) {
      // Utilisation de requestAnimationFrame pour déclencher l'animation
      requestAnimationFrame(() => {
        setAnimate(true);
      });
      const timer = setTimeout(() => {
        setCurrentIdx(pendingIdx);
        setPendingIdx(null);
        setAnimate(false);
      }, SLIDE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [pendingIdx]);

  // Navigation au clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentIdx === null) return;

      switch (event.key) {
        case "ArrowLeft":
          if (currentIdx > 0 && pendingIdx === null) {
            setPendingIdx(currentIdx - 1);
            setSlideDirection("right");
          }
          break;
        case "ArrowRight":
          if (currentIdx < props.images.length - 1 && pendingIdx === null) {
            setPendingIdx(currentIdx + 1);
            setSlideDirection("left");
          }
          break;
        case "ArrowUp":
        case "ArrowDown":
          props.hide();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props, currentIdx, pendingIdx]);

  useEffect(() => {
    if (props.imageViewingUrl || props.imageViewingUrl === null) {
      const idx = props.images.findIndex(
        (i) => i.original === props.imageViewingUrl
      );
      if (idx > -1) setCurrentIdx(idx);
      else setCurrentIdx(null);
    }
  }, [props.imageViewingUrl, props.images]);

  // Gestion des événements tactiles pour le swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (Math.abs(distance) < MIN_SWIPE_DISTANCE) return;

    if (distance > 0) {
      if (
        currentIdx !== null &&
        currentIdx < props.images.length - 1 &&
        pendingIdx === null
      ) {
        setPendingIdx(currentIdx + 1);
        setSlideDirection("left");
      }
    } else {
      if (currentIdx !== null && currentIdx > 0 && pendingIdx === null) {
        setPendingIdx(currentIdx - 1);
        setSlideDirection("right");
      }
    }
  };

  // Fonction de téléchargement adaptée pour desktop et mobile
  const downloadImage = async () => {
    if (currentIdx === null) return;
    const imageUrl = props.images[currentIdx].original;
    const filename = imageUrl.split("/").pop() || "download";

    // Création d'un élément <a> temporaire pour tester la prise en charge de l'attribut download
    const tempLink = document.createElement("a");

    // Si l'attribut download est supporté (la plupart des navigateurs desktop)
    if (typeof tempLink.download !== "undefined") {
      try {
        const response = await fetch(imageUrl, { mode: "cors" });
        if (!response.ok) {
          throw new Error("La réponse réseau n'est pas correcte");
        }
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        tempLink.href = blobUrl;
        tempLink.setAttribute("download", filename);
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image:", error);
      }
    } else {
      // Sur mobile (ex : iOS Safari) qui ne supporte pas l'attribut download,
      // on tente d'ouvrir l'URL avec un paramètre forçant la réponse en téléchargement.
      const downloadUrl = imageUrl.includes("?")
        ? `${imageUrl}&response-content-disposition=attachment`
        : `${imageUrl}?response-content-disposition=attachment`;
      window.open(downloadUrl, "_blank");
    }
  };

  const outgoingSrc =
    currentIdx !== null ? props.images[currentIdx].original : null;
  const incomingSrc =
    pendingIdx !== null ? props.images[pendingIdx].original : null;

  return (
    <div
      className={clsx(
        { hidden: currentIdx === null },
        "fixed h-screen w-screen top-0 left-0 bg-black py-[50px] overflow-hidden"
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bouton de téléchargement */}
      <div
        onClick={downloadImage}
        className="p-[10px] fixed top-[24px] right-[78px] cursor-pointer hover:text-white text-textSecondary dark:text-darkTextSecondary z-30"
      >
        <div className="h-[24px] w-[24px]">
          <DownloadIcon />
        </div>
      </div>
      {/* Bouton de fermeture */}
      <div
        onClick={props.hide}
        className="p-[10px] fixed top-[24px] right-[24px] cursor-pointer hover:text-white text-textSecondary dark:text-darkTextSecondary z-30"
      >
        <div className="h-[24px] w-[24px]">
          <CloseIcon />
        </div>
      </div>

      {/* Zones cliquables pour la navigation sur desktop ou en tap */}
      <div
        className="fixed w-1/2 left-0 top-0 h-screen z-20 cursor-pointer"
        onClick={() => {
          if (currentIdx !== null && currentIdx > 0 && pendingIdx === null) {
            setPendingIdx(currentIdx - 1);
            setSlideDirection("right");
          }
        }}
      ></div>
      <div
        className="fixed w-1/2 left-1/2 right-0 top-0 h-screen z-20 cursor-pointer"
        onClick={() => {
          if (
            currentIdx !== null &&
            currentIdx < props.images.length - 1 &&
            pendingIdx === null
          ) {
            setPendingIdx(currentIdx + 1);
            setSlideDirection("left");
          }
        }}
      ></div>

      {/* Conteneur de l'image */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Image sortante lors de la transition */}
        {pendingIdx !== null && outgoingSrc && (
          <div
            className={clsx(
              "absolute transition-transform duration-500 h-[calc(100vh-100px)] w-screen flex items-center justify-center",
              {
                "translate-x-0": !animate,
                "-translate-x-[100vw]": animate && slideDirection === "left",
                "translate-x-[100vw]": animate && slideDirection === "right",
              }
            )}
          >
            <img
              src={outgoingSrc}
              alt="Outgoing"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
        {/* Image entrante lors de la transition */}
        {pendingIdx !== null && incomingSrc && (
          <div
            className={clsx(
              "absolute transition-transform duration-500 h-[calc(100vh-100px)] w-screen flex items-center justify-center",
              {
                "translate-x-[100vw]": !animate && slideDirection === "left",
                "-translate-x-[100vw]": !animate && slideDirection === "right",
                "translate-x-0": animate,
              }
            )}
          >
            <img
              src={incomingSrc}
              alt="Incoming"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
        {/* État inactif : aucune transition */}
        {pendingIdx === null && outgoingSrc && (
          <img
            src={outgoingSrc}
            alt="Displayed"
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
