import {
  Wifi,
  ShowerHead,
  Snowflake,
  Coffee,
  Utensils,
  ShieldCheck,
  Clock,
  MapPin,
  Tv,
  Car,
  Sparkles,
  Check,
} from "lucide-react";
import { Amenity } from "@/types/database";

interface AmenitiesProps {
  amenities: Amenity[];
}

const iconMap: Record<string, typeof Wifi> = {
  wifi: Wifi,
  "shower-head": ShowerHead,
  shower: ShowerHead,
  snowflake: Snowflake,
  ac: Snowflake,
  coffee: Coffee,
  utensils: Utensils,
  kitchen: Utensils,
  "shield-check": ShieldCheck,
  clock: Clock,
  "map-pin": MapPin,
  tv: Tv,
  car: Car,
  parking: Car,
};

export function Amenities({ amenities }: AmenitiesProps) {
  return (
    <section id="amenities" className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-100 dark:bg-heritage-950 text-heritage-800 dark:text-heritage-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-heritage-600" />
            <span>Comfort & Facilities</span>
          </div>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mb-3">
            Guest Amenities
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 dark:text-stone-300 text-base">
            Everything you need for a comfortable, stress-free stay at budget prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {amenities.map((item) => {
            const IconComponent = iconMap[item.icon.toLowerCase()] || Check;
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-lg bg-heritage-50 dark:bg-heritage-950/60 text-heritage-700 dark:text-heritage-400 flex items-center justify-center shrink-0 border border-heritage-100 dark:border-heritage-900">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-stone-100 text-base mb-1">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-stone-400 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
