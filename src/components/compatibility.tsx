

const sources = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 19.5h7.5L12 15l2.5 4.5H22L12 2z" />
        <path d="M2 19.5h20" />
      </svg>
    ),
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    title: "Google Drive Links",
    desc: "Paste any Drive share link and ZipDrift builds a direct download URL from the file ID. Make sure the file is set to `anyone with the link` to avoid access errors.",
    pillBg: "bg-blue-500/15",
    pillText: "text-blue-300",
    dotColor: "bg-blue-400",
    pillLabel: "Auto-detected",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
        <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" />
        <path d="M3 12h2M19 12h2M12 3v2M12 19v2" />
      </svg>
    ),
    iconBg: "bg-emerald-500/12",
    iconColor: "text-emerald-400",
    title: "Image hosting platforms",
    desc: "Gallery and album URLs are fully supported. ZipDrift navigates the gallery structure and pulls every image, packaged cleanly into your zip.",
    pillBg: "bg-emerald-500/12",
    pillText: "text-emerald-300",
    dotColor: "bg-emerald-400",
    pillLabel: "Auto-detected",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    iconBg: "bg-white/[0.08]",
    iconColor: "text-white/50",
    title: "Unknown sources",
    desc: "Direct image URLs and unrecognised sources are flagged with an unknown badge before you run the batch, so you can review or remove them first.",
    pillBg: "bg-white/[0.07]",
    pillText: "text-white/40",
    dotColor: "bg-white/35",
    pillLabel: "Flagged for review",
  },
];

export default function Compatibility() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] p-4 md:px-14 py-10 md:py-14">
      {/* Diagonal line texture */}
     

      <div className="relative z-10">
        

        {/* Heading */}
        <h2 className="mb-3 text-3xl font-nunito font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          Works with your links,<br />whatever the source.
        </h2>

        {/* Subheading */}
        <p className="mb-14 font-inter max-w-md text-sm leading-relaxed text-white/40">
          ZipDrift detects the source type of every URL before extraction starts,
          so you always know what you're working with.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {sources.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-white/9 bg-white/4 p-7 transition duration-200 hover:border-white/[0.17] hover:bg-white/[0.07]"
            >
              {/* Icon */}
              <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}>
                {s.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 font-bold font-nunito text-white text-[17px]">{s.title}</h3>

              {/* Description */}
              <p className="mb-5 md:text-sm text-xs font-inter leading-relaxed text-white/42">{s.desc}</p>

              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}