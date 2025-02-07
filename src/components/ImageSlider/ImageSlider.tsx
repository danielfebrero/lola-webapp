import clsx from "clsx";
import { useEffect, useState } from "react";

import CloseIcon from "../../icons/close";
import { ImagesMultisize } from "../../types/characters";
import { ImageSearch } from "../../types/stories";

interface ImageSliderProps {
  images: ImagesMultisize[] | ImageSearch[];
  imageViewingIdx: number | null;
  hide: () => void;
}

const SLIDE_DURATION = 500; // duration in ms
const MIN_SWIPE_DISTANCE = 50; // minimal swipe distance in pixels

const ImageSlider: React.FC<ImageSliderProps> = (props) => {
  // Current image index
  const [currentIdx, setCurrentIdx] = useState<number | null>(
    props.imageViewingIdx
  );
  // Target index for the transition
  const [pendingIdx, setPendingIdx] = useState<number | null>(null);
  // Direction for the slide transition
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );
  // Toggle to trigger the CSS slide animations
  const [animate, setAnimate] = useState(false);

  // State for tracking touch events
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Synchronize currentIdx with the imageViewingIdx prop.
  useEffect(() => {
    if (props.imageViewingIdx !== null) {
      setCurrentIdx(props.imageViewingIdx);
    } else {
      setCurrentIdx(null);
    }
  }, [props.imageViewingIdx, props.images]);

  // Preload adjacent images for smoother transitions.
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

  // Handle the slide transition when pendingIdx changes.
  useEffect(() => {
    if (pendingIdx !== null) {
      // Use requestAnimationFrame to ensure that the state update triggers the transition.
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

  // Keyboard navigation.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Do nothing if the modal is hidden.
      if (props.imageViewingIdx === null) return;

      switch (event.key) {
        case "ArrowLeft":
          if (currentIdx !== null && currentIdx > 0 && pendingIdx === null) {
            setPendingIdx(currentIdx - 1);
            setSlideDirection("right");
          }
          break;
        case "ArrowRight":
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
          props.hide();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props, currentIdx, pendingIdx]);

  // Touch event handlers for swipe navigation.
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Reset the previous touch end and record the starting X coordinate.
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // Update the current touch X coordinate.
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;

    // If the swipe distance is too short, ignore it.
    if (Math.abs(distance) < MIN_SWIPE_DISTANCE) return;

    if (distance > 0) {
      // Swiped left: navigate to the next image.
      if (
        currentIdx !== null &&
        currentIdx < props.images.length - 1 &&
        pendingIdx === null
      ) {
        setPendingIdx(currentIdx + 1);
        setSlideDirection("left");
      }
    } else {
      // Swiped right: navigate to the previous image.
      if (currentIdx !== null && currentIdx > 0 && pendingIdx === null) {
        setPendingIdx(currentIdx - 1);
        setSlideDirection("right");
      }
    }
  };

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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <div
        onClick={() => props.hide()}
        className="fixed top-[24px] right-[24px] h-[24px] w-[24px] cursor-pointer text-textSecondary dark:text-darkTextSecondary z-30"
      >
        <CloseIcon />
      </div>

      {/* Clickable Areas for desktop or tap navigation */}
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
      <div className="relative h-full w-full flex items-center justify-center">
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
