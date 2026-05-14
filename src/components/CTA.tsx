"use client"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function CTA() {
    const router = useRouter()
    return (
        <div className="relative bg-[#000000] py-6">
            <style>{`
        @keyframes spin-border {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .cta-glow::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            transparent 0deg,
            transparent 60deg,
            #984cd6 120deg,
            #c084fc 180deg,
            #984cd6 240deg,
            transparent 300deg,
            transparent 360deg
          );
          animation: spin-border 4s linear infinite;
        }
        .cta-glow::after {
  content: '';
  position: absolute;
  inset: 1px;
  background: #0d0a12;
  border-radius: inherit;
  z-index: 1;
}
      `}</style>

            {/* CTA Card */}
            <div data-aos="fade-up" className="cta-glow relative overflow-hidden rounded-2xl mx-6 md:mx-14 px-8 py-14 flex flex-col items-center text-center">
                {/* Headline */}
                <h2 className="relative z-10 mb-3 font-nunito text-xl md:text-4xl font-extrabold tracking-tight text-white">
                    Batch download images in seconds.
                </h2>

                {/* Subline */}
                <p className="relative z-10 mb-8 font-inter text-sm text-white/40 max-w-sm leading-relaxed">
                    Paste your links or upload a pdf and hit extract to get a zip. No storage or signup required.
                </p>

                {/* CTAs */}
                <div className="relative z-10 flex items-center gap-3">
                     <Button onClick={()=>router.push("/extract")} className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-[#984cd6] font-medium hover:scale-105 hover:bg-[#984cd6] active:scale-95 transition-all duration-150 shadow-[0_0_16px_6px_#984cd6aa]">
  Start extracting
</Button>
          <Button onClick={()=>router.push("/pdf-extract")} className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-transparent border border-white text-white font-medium hover:bg-black/90 hover:scale-105 active:scale-95 shadow-[0_0_20px_6px_rgba(255,255,255,0.15)] transition-all duration-150">
  Use PDF Extract
</Button>
                </div>
            </div>
        </div>)
}