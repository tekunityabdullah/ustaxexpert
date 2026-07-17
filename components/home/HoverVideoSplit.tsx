"use client";

import { useRef } from "react";

function VideoBox({
  src,
  overlayClassName,
}: {
  src: string;
  overlayClassName: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="group relative h-full w-full cursor-pointer overflow-hidden"
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        const video = videoRef.current;
        if (!video) return;
        video.pause();
        video.currentTime = 0;
      }}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div
        className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 ${overlayClassName}`}
      />
    </div>
  );
}

export default function HoverVideoSplit() {
  return (
    <section className="relative h-[420px] overflow-hidden lg:h-[700px]">
      <div className="flex h-full w-full">
        <div className="w-1/2">
          <VideoBox
            src="/videos/7507758-uhd_3840_2160_25fps-2-1.mp4"
            overlayClassName="bg-[rgba(25,34,122,0.75)]"
          />
        </div>
        <div className="w-1/2">
          <VideoBox
            src="/videos/7507565-uhd_3840_2160_25fps-1.mp4"
            overlayClassName="bg-[rgba(212,162,49,0.55)]"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-[-50px] left-1/2 hidden w-1 -translate-x-1/2 -skew-x-[20deg] bg-white/50 lg:block"
      />
    </section>
  );
}
