import React, { forwardRef } from "react";

const MediaDisplay = forwardRef(({ videoSrc, imgSrc, rotate }, ref) => (
  <div className="relative w-full md:w-1/2 h-full flex items-center justify-center p-4 md:static">
    <video
      ref={ref}
      src={videoSrc}
      loop
      autoPlay
      muted
      className={`w-80 h-80 rotate-${rotate} rounded-2xl absolute`}
    />
    {imgSrc && (
      <img
        src={imgSrc}
        alt="Content related"
        className="absolute top-0 right-0 w-1/4 h-auto"
      />
    )}
  </div>
));

export default MediaDisplay;
