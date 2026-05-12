import Link from "next/link";

export default function CTA() {
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
            <div className="cta-glow relative overflow-hidden rounded-2xl mx-6 md:mx-14 px-8 py-14 flex flex-col items-center text-center">
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
                    <Link
                        href="#how-it-works"
                        className="flex items-center gap-2 rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/40 hover:text-white"
                    >
                        Start Extracting
                    </Link>
                    <Link
                        href="#extract"
                        className="rounded-md bg-[#984cd6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/85"
                    >
                        Use PDF Extract
                    </Link>
                </div>
            </div>
        </div>)
}