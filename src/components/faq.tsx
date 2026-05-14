"use client";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-quart",
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <div className="bg-[#000000] px-5 md:px-14 pb-16 md:pb-20 py-10 flex flex-col">
      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes accordionSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes contentFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .faq-row {
          opacity: 0;
          animation: rowSlideIn 0.4s ease forwards;
        }
        .faq-row:hover td {
          background: #130e1a;
        }
        .faq-row td {
          transition: background 0.25s ease;
        }
        .faq-row:hover .row-accent {
          opacity: 1;
          height: 100%;
        }
        .row-accent {
          position: absolute;
          left: 0; top: 0;
          width: 2px;
          height: 0;
          background: #984cd6;
          opacity: 0;
          transition: height 0.3s ease, opacity 0.3s ease;
          border-radius: 2px;
        }

        .accordion-item {
          opacity: 0;
          animation: accordionSlideIn 0.4s ease forwards;
        }
        .accordion-content-inner {
          animation: contentFadeIn 0.3s ease forwards;
        }
        .accordion-plus {
          transition: transform 0.25s ease, color 0.25s ease;
        }
        .accordion-plus.is-open {
          transform: rotate(45deg);
          color: #984cd6;
        }
      `}</style>

      <h2
        data-aos="fade-up"
        className="mb-10 text-4xl font-nunito font-extrabold leading-tight tracking-tight text-white md:text-5xl"
      >
        Frequently Asked Questions
      </h2>

      {/* Desktop table */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="hidden md:block rounded-xl overflow-hidden"
        style={{
          border: "1px solid transparent",
          backgroundImage:
            "linear-gradient(#0d0a12, #0d0a12), linear-gradient(to top, #984cd6 0%, rgba(255,255,255,0.08) 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <table className="w-full border-collapse text-sm">
          <thead className="font-nunito">
            <tr className="border-b border-white/10 align-top bg-[#0d0a12]">
              <th className="text-left p-5 text-[11px] font-bold uppercase tracking-widest text-white/40 w-1/3">
                The Question
              </th>
              <th className="text-left p-5 text-[11px] font-bold uppercase tracking-widest text-white/40 w-1/3 border-l border-white/10">
                The Short Answer
              </th>
              <th className="text-left p-5 text-[11px] font-bold uppercase tracking-widest text-white w-1/3 border-l border-white/10">
                The Full Picture
              </th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq, i) => (
              <tr
                key={i}
                className="faq-row border-b border-white/10 align-top bg-[#0d0a12]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <td className="p-5 text-white/60 italic leading-relaxed font-nunito relative">
                  <span className="row-accent" />
                  "{faq.question}"
                </td>
                <td className="p-5 font-inter text-white leading-relaxed border-l border-white/10">
                  {faq.short}
                </td>
                <td className="p-5 font-inter text-white leading-relaxed border-l border-white/10">
                  {faq.full}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile accordion */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex md:hidden flex-col rounded-xl overflow-hidden divide-y divide-white/10"
        style={{
          border: "1px solid transparent",
          backgroundImage:
            "linear-gradient(#0d0a12, #0d0a12), linear-gradient(to top, #984cd6 0%, rgba(255,255,255,0.08) 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="accordion-item bg-[#0d0a12]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start justify-between gap-4 p-5 text-left"
            >
              <span className="font-nunito text-white/70 italic text-sm leading-relaxed">
                "{faq.question}"
              </span>
              <span className={`accordion-plus text-lg shrink-0 mt-0.5 text-white/40 ${open === i ? "is-open" : ""}`}>
                +
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                open === i ? "max-h-64" : "max-h-0"
              }`}
            >
              {open === i && (
                <div className="accordion-content-inner px-5 pb-5 flex flex-col gap-4">
                  <div>
                    <p className="font-inter text-white text-sm leading-relaxed">
                      {faq.short}
                    </p>
                  </div>
                  <div>
                    <p className="font-inter text-white text-sm leading-relaxed">
                      {faq.full}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "Does my Google Drive link need to be public?",
    short: "Yes, set it to anyone with the link.",
    full: "ZipDrift builds a direct download URL from the file ID. If access is restricted the server gets denied and that link is flagged as failed in your summary.",
  },
  {
    question: "Is there a limit to how many links I can paste?",
    short: "No limit at all.",
    full: "ZipDrift processes your entire list in one pass. Larger batches take longer and produce a bigger zip but the job never gets split across sessions.",
  },
  {
    question: "What happens when a link fails?",
    short: "It gets flagged and left out of the zip.",
    full: "Every failure is reported individually with a plain reason — access denied, no image found, unsupported format. Nothing is silently skipped or included as a broken file.",
  },
  {
    question: "Are my links or images saved anywhere?",
    short: "Nothing is stored. Ever.",
    full: "ZipDrift has no database. Your URLs pass through the server only to handle extraction and avoid CORS restrictions. Nothing is logged or retained after the session ends.",
  },
  {
    question: "What does the source badge next to each link mean?",
    short: "It shows what ZipDrift detected before extracting.",
    full: "Each link is labelled as SmugMug, Google Drive, direct image, or unknown so you can spot anything misidentified before committing to the full extraction.",
  },
];