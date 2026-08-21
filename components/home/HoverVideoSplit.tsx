"use client";

import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import { BASE_PATH } from "@/lib/site-config";

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
      <Reveal direction="fade" duration={1} className="flex h-full w-full">
        <div className="w-1/2">
          <VideoBox
            src={`${BASE_PATH}/videos/7507758-uhd_3840_2160_25fps-2-1.mp4`}
            overlayClassName="bg-[rgba(7,22,249,0.4)]"
          />
        </div>
        <div className="w-1/2">
          <VideoBox
            src={`${BASE_PATH}/videos/7507565-uhd_3840_2160_25fps-1.mp4`}
            overlayClassName="bg-[rgba(230,184,0,0.3)]"
          />
        </div>
      </Reveal>
    </section>
  );
}
