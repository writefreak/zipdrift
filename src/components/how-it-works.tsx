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
    <section className="relative overflow-hidden bg-[#0a0a0a] md:px-14 p-4 md:py-14">

      {/* Content */}
      <div className="relative z-10">
        {/* Badge */}
        <span className="mb-6 inline-block font-nunito rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
          How it works
        </span>

        {/* Heading */}
        <h2 className="mb-3 text-4xl font-nunito font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          Extract images in just<br />3 simple steps.
        </h2>

        {/* Subheading */}
       

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-2xl border border-white/9 bg-white/4 p-8 transition duration-200 hover:border-white/18 hover:bg-white/[0.07]"
            >
              <p className="mb-8 text-6xl font-extrabold leading-none tracking-tighter text-white/8">
                {step.number}
              </p>
              <h3 className="mb-2.5  font-nunito text-lg font-bold text-white">
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