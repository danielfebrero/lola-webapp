import clsx from "clsx";
import { useEffect, useState } from "react";

import CloseIcon from "../../icons/close";
import { ImagesMultisize } from "../../types/characters";

interface ImageSliderProps {
  images: ImagesMultisize[] | ImageSearch[];
  imageViewingIdx: number | null;
  hide: () => void;
}

const SLIDE_DURATION = 500; // duration in ms

const ImageSlider: React.FC<ImageSliderProps> = (props) => {
  const [currentIdx, setCurrentIdx] = useState<number | null>(
    props.imageViewingIdx
  );
  // pendingIdx is the target index when a navigation is requested.
  const [pendingIdx, setPendingIdx] = useState<number | null>(null);
  // slideDirection determines which direction the images will slide:
  // "left" means the current image will slide left (and new one enters from the right),
  // "right" means the current image will slide right (and new one enters from the left).
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );
  // animate toggles the CSS transforms to trigger the slide.
  const [animate, setAnimate] = useState(false);

  // Keep currentIdx in sync with the initial imageViewingIdx prop.
  useEffect(() => {
    if (props.imageViewingIdx !== null) {
      setCurrentIdx(props.imageViewingIdx);
    } else {
      setCurrentIdx(null);
    }
  }, [props.imageViewingIdx, props.images]);

  // Preload adjacent images for smooth transitions.
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

  // When pendingIdx is set, start the parallel transition.
  useEffect(() => {
    if (pendingIdx !== null) {
      // On the next animation frame, toggle animate to true so that both
      // images start moving concurrently.
      requestAnimationFrame(() => {
        setAnimate(true);
      });
      const timer = setTimeout(() => {
        // After the slide duration, update the current image.
        setCurrentIdx(pendingIdx);
        setPendingIdx(null);
        setAnimate(false);
      }, SLIDE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [pendingIdx]);

  // Keyboard navigation.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Do nothing if the modal is hidden.
      if (props.imageViewingIdx === null) return;

      switch (event.key) {
        case "ArrowLeft":
          // Navigate to previous image.
          if (currentIdx !== null && currentIdx > 0 && pendingIdx === null) {
            setPendingIdx(currentIdx - 1);
            setSlideDirection("right");
          }
          break;
        case "ArrowRight":
          // Navigate to next image.
          if (
            currentIdx !== null &&
            currentIdx < props.images.length - 1 &&
            pendingIdx === null
          ) {
            setPendingIdx(currentIdx + 1);
            setSlideDirection("left");
          }
          break;
        case "ArrowUp":
        case "ArrowDown":
          // Hide the slider.
          props.hide();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props, currentIdx, pendingIdx]);

  const outgoingSrc =
    currentIdx !== null ? props.images[currentIdx].original : null;
  const incomingSrc =
    pendingIdx !== null ? props.images[pendingIdx].original : null;

  return (
    <div
      className={clsx(
        { hidden: props.imageViewingIdx === null },
        "fixed h-screen w-screen top-0 left-0 bg-black py-[50px] overflow-hidden"
      )}
    >
      {/* Close Button */}
      <div
        onClick={() => props.hide()}
        className="fixed top-[24px] right-[24px] h-[24px] w-[24px] cursor-pointer text-textSecondary dark:text-darkTextSecondary z-30"
      >
        <CloseIcon />
      </div>

      {/* Clickable Areas */}
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

      {/* Image Container */}
      <div className="relative h-full w-full pointer-events-none flex items-center justify-center">
        {/* Outgoing Image */}
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
        {/* Incoming Image */}
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
        {/* Idle State: No transition */}
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
