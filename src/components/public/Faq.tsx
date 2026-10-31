"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ, HotelProfile } from "@/types/database";

interface FaqProps {
  faqs: FAQ[];
  profile: HotelProfile;
}

export function Faq({ faqs, profile }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-100 dark:bg-heritage-950 text-heritage-800 dark:text-heritage-300 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-heritage-600" />
            <span>Common Queries</span>
          </div>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 dark:text-stone-300 text-base">
            Everything you need to know about staying at {profile.name} in {profile.city}.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 dark:text-stone-100 text-base sm:text-lg pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-heritage-700 dark:text-heritage-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 text-slate-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed border-t border-stone-200/60 dark:border-stone-700/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
