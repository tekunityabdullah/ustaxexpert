"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import BookConsultationButton from "@/components/ui/BookConsultationButton";
import CtaButton from "@/components/ui/CtaButton";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { BASE_PATH } from "@/lib/site-config";

 
const VIDEO_SRC = `${BASE_PATH}/videos/intro-ustaxexpert.mp4`;

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  
  // Until the video's metadata is known the player shows a 16:9 placeholder;
  // after that the <video> element sizes itself to its own native width and
  // height, so it is never cropped, stretched or letterboxed. (It only
  // shrinks, proportionally, if the page column or 80% of the screen height
  // is smaller than the video.)
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // The metadata event can fire before React attaches onLoadedMetadata
    // (e.g. a cached video), so also check the current state on mount.
    if ((videoRef.current?.readyState ?? 0) >= 1) setLoaded(true);
  }, []);

  function handlePlay() {
    setPlaying(true);
    void videoRef.current?.play();
  }

  return (
    <section className="py-16 lg:py-25">
      <Container>
        <Reveal direction="up">
          <SectionHeading
            align="center"
            eyebrow="Meet Us"
            title="Get to Know U.S. Tax Experts"
            subtitle="Watch a short introduction to who we are, how we work, and how we help clients resolve IRS tax debt and stay on top of their taxes and accounting."
          />
        </Reveal>

        <Reveal direction="up" delay={0.1} className="mx-auto mt-10 w-full">
          <div
            className={`relative mx-auto overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.18)] ${
              loaded ? "w-fit max-w-full" : "aspect-video w-full max-w-4xl bg-section"
            }`}
          >
            <video
              ref={videoRef}
              className={
                loaded ? "block h-auto max-h-[80vh] w-auto max-w-full" : "h-full w-full object-contain"
              }
              onLoadedMetadata={() => setLoaded(true)}
              src={`${VIDEO_SRC}#t=0.5`}
              preload="metadata"
              playsInline
              controls={playing}
              onEnded={() => setPlaying(false)}
            >
              Your browser doesn&rsquo;t support embedded video.
            </video>

            {!playing && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Play introduction video"
                className="group absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/20"
              >
                <span className="bg-gold-gradient flex h-20 w-20 items-center justify-center rounded-full text-navy-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105">
                  <Play size={30} className="ml-1 fill-current" />
                </span>
              </button>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <BookConsultationButton>Book Consultation</BookConsultationButton>
            <CtaButton href="/make-a-payment" variant="outline-navy">
              Make a Payment
            </CtaButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
