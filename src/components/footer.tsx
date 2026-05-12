import Link from "next/link";

export default function Footer() {
  return (
    <section className="relative bg-[#141414] py-6 ">
      {/* Inner card */}
      <div className="relative overflow-hidden rounded-2xl px-8 py-14 flex flex-col items-center text-center">


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

        {/* Divider */}
        <div className="relative z-10 mt-14 w-full border-t border-white/9 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social icons */}
          

          {/* Copyright */}
          <p className="font-inter text-xs text-white/25">
            Copyright {new Date().getFullYear()} © ZipDrift
          </p>
          {/* Copyright */}
          <p className="font-inter text-xs text-white/25">
           Built by Tagelabs
          </p>
        </div>
      </div>
    </section>
  );
}