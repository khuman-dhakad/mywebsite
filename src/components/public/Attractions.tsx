"use client";

import { useState } from "react";
import { Compass, Navigation, MapPin, Footprints, Car, Sparkles, ExternalLink } from "lucide-react";
import { LocalAttraction } from "@/types/database";

interface AttractionsProps {
  attractions: LocalAttraction[];
  hotelName: string;
  city: string;
}

export function Attractions({ attractions, hotelName, city }: AttractionsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Monument", "Shopping", "Culture", "Dining"];

  const filtered =
    activeCategory === "All"
      ? attractions
      : attractions.filter((item) => item.category === activeCategory);

  return (
    <section
      id="attractions"
      className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-100 dark:bg-heritage-950 text-heritage-800 dark:text-heritage-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-heritage-600" />
            <span>Heritage Guide & Concierge</span>
          </div>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mb-3">
            Explore {city}&apos;s Royal Treasures
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 dark:text-stone-300 text-base">
            Stay in the cultural heart of the old city. Step outside {hotelName} directly into century-old bazaars, majestic palaces, and authentic culinary stops.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10" role="tablist" aria-label="Filter attractions by category">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all min-h-[38px] ${
                  active
                    ? "bg-heritage-700 text-white shadow-sm"
                    : "bg-stone-50 dark:bg-stone-800 text-slate-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700"
                }`}
              >
                {cat === "All" ? "All Highlights" : cat}
              </button>
            );
          })}
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((item) => {
            const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(item.directionsQuery)}`;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  {/* Category & Distance Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-700 dark:text-heritage-400">
                      {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-heritage-100 dark:bg-heritage-950 text-heritage-800 dark:text-heritage-300">
                      <MapPin className="w-3 h-3" />
                      {item.distance}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-2 group-hover:text-heritage-700 dark:group-hover:text-heritage-400 transition-colors">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-stone-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Footer with transit time and navigation */}
                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-stone-400">
                    {item.walkTime ? (
                      <>
                        <Footprints className="w-4 h-4 text-emerald-600" />
                        <span>{item.walkTime}</span>
                      </>
                    ) : item.driveTime ? (
                      <>
                        <Car className="w-4 h-4 text-blue-600" />
                        <span>{item.driveTime}</span>
                      </>
                    ) : null}
                  </div>

                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-heritage-700 dark:text-heritage-400 hover:text-heritage-800 transition-colors"
                  >
                    <span>Route</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Concierge Insider Tip */}
        <div className="p-6 rounded-2xl bg-heritage-50 dark:bg-heritage-950/40 border border-heritage-200 dark:border-heritage-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-heritage-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-serif text-base font-bold text-slate-900 dark:text-stone-100 mb-0.5">
              Host Concierge Assistance
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-stone-300 leading-relaxed">
              Visiting Jaipur for the first time? Our 24/7 reception provides free printed walking maps, fair e-rickshaw rate guides, and ticket counter guidance for Amber Fort sound & light shows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
