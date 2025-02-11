import React, { useState, useEffect } from "react";
import clsx from "clsx";

interface TransitionImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  /**
   * The duration (in milliseconds) to wait for the fade-out effect
   * before switching to the new image source.
   */
  fadeOutDuration?: number;
}

const TransitionImage: React.FC<TransitionImageProps> = ({
  src,
  alt,
  className,
  fadeOutDuration = 300,
  ...rest
}) => {
  // currentSrc holds the image source that is currently displayed.
  const [currentSrc, setCurrentSrc] = useState(src);
  // isTransitioning indicates whether we are in the middle of a transition.
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (src !== currentSrc) {
      // Start the fade-out effect.
      setIsTransitioning(true);

      // After the fade-out delay, update the displayed source.
      const timeout = setTimeout(() => {
        setCurrentSrc(src);
      }, fadeOutDuration);

      return () => clearTimeout(timeout);
    }
  }, [src, currentSrc, fadeOutDuration]);

  // Once the new image is loaded, end the transition (fade in).
  const handleLoad = () => {
    setIsTransitioning(false);
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onLoad={handleLoad}
      className={clsx(
        className,
        "transition-opacity duration-500 ease-in-out",
        {
          "opacity-0": isTransitioning,
          "opacity-100": !isTransitioning,
        }
      )}
      {...rest}
    />
  );
};

export default TransitionImage;
