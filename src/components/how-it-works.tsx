"use client";

const steps = [
  {
    number: "01",
    title: "Paste your URLs",
    description:
      "Drop in a list of links from any platform — product pages, portfolios, social posts, or any site with images.",
  },
  {
    number: "02",
    title: "Zipdrift extracts everything",
    description:
      "Our engine visits every URL and pulls every image it finds, or upload a PDF and we'll extract those too.",
  },
  {
    number: "03",
    title: "Download your zip",
    description:
      "Everything gets packaged cleanly into a single zip file — ready to download in moments, no clutter.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#000000] md:px-14 p-4 md:py-14">
      <div className="relative z-10">
        <h2 className="text-3xl font-nunito font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          Extract images in just<br />3 simple steps.
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl p-8 transition duration-200 hover:bg-white/[0.04]"
              style={{
  background: "#0f0a14",
  border: "1px solid transparent",
  backgroundImage:
    "linear-gradient(#0f0a14, #0f0a14), linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, #984cd6 100%)",
  backgroundOrigin: "border-box",
  backgroundClip: "padding-box, border-box",
}}
            >
              <p className="mb-8 text-6xl font-extrabold leading-none tracking-tighter text-white/8">
                {step.number}
              </p>
              <h3 className="mb-2.5 font-nunito text-lg font-bold text-white">
                {step.title}
              </h3>
              <p className="text-sm font-inter leading-relaxed text-white/45">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}