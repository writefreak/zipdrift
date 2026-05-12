"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "./ui/button";

export default function BackgroundBeamsDemo() {
  return (
    <div className="h-150 md:h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="flex flex-col md:gap-4 gap-2">
        <h1 className="relative z-10 text-white text-5xl md:text-7xl text-center font-nunito font-extrabold">
           Batch Image Download
        </h1>
        <p className="text-white/70 md:w-170 mx-auto my-2 text-xs md:text-base text-center relative z-10">
         Paste a list of URLs from any platform or upload a pdf <br className="md:hidden" />and Zipdrift extracts every image behind them, packages <br className="md:hidden"/>everything cleanly and hands it back as a single zip file.
        </p>
        <div className="flex gap-2 z-30 items-center justify-center md:pt-7 pt-5">
          <Button
              className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all duration-150"
            >
              Start extracting
            </Button>
          <Button
              className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-transparent border  text-white font-medium hover:bg-black/90 active:scale-95 transition-all duration-150"
            >
            Use PDF Extract
            </Button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
