"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.28,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};
export default function BackgroundBeamsDemo() {
  const router = useRouter();

  return (
    <div
      className="h-150 md:h-screen w-full relative flex flex-col items-center justify-center antialiased"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, #6b21c8 0%, #3b0764 35%, #0d0014 65%, #000000 100%)`,
      }}
    >
      <motion.div
        className="flex flex-col md:gap-4 gap-2 items-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="relative z-10 text-white text-5xl md:text-7xl text-center font-nunito font-extrabold"
          variants={fadeUp}
        >
          Batch Image Download
        </motion.h1>

        <motion.p
          className="text-white/70 md:w-170 mx-auto my-2 text-xs md:text-base text-center relative z-10"
          variants={fadeUp}
        >
          Paste a list of URLs from any platform or upload a pdf{" "}
          <br className="md:hidden" />
          and Zipdrift extracts every image behind them, packages{" "}
          <br className="md:hidden" />
          everything cleanly and hands it back as a single zip file.
        </motion.p>

        <motion.div
          className="flex gap-2 z-30 items-center justify-center md:pt-7 pt-5"
          variants={fadeUp}
        >
          <Button
            onClick={() => router.push("/extract")}
            className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-[#984cd6] font-medium hover:scale-105 hover:bg-[#984cd6] active:scale-95 transition-all duration-150 shadow-[0_0_16px_6px_#984cd6aa]"
          >
            Start extracting
          </Button>
          <Button
            onClick={() => router.push("/pdf-extract")}
            className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-transparent border border-white text-white font-medium hover:bg-black/90 hover:scale-105 active:scale-95 shadow-[0_0_20px_6px_rgba(255,255,255,0.15)] transition-all duration-150"
          >
            Use PDF Extract
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}