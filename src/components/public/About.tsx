import { Sparkles, Shield, Clock, HeartHandshake, Award } from "lucide-react";
import { HotelProfile } from "@/types/database";

interface AboutProps {
  profile: HotelProfile;
}

export function About({ profile }: AboutProps) {
  const highlights = [
    {
      icon: Shield,
      title: "Safe & Family Friendly",
      desc: "Gated entry, 24/7 reception desk, and courteous hospitality for families, solo travelers, and pilgrims.",
    },
    {
      icon: Sparkles,
      title: "Cleanliness Guaranteed",
      desc: "Daily professional housekeeping, fresh sanitized bed linens, and spotless western bathrooms.",
    },
    {
      icon: Clock,
      title: "Convenient Timings",
      desc: `Check-in: ${profile.check_in_time || "12:00 PM"} | Check-out: ${
        profile.check_out_time || "11:00 AM"
      }. Early check-in upon request.`,
    },
    {
      icon: HeartHandshake,
      title: "Personal Host Support",
      desc: "Direct guidance on auto routes, reasonable travel fares, local hidden gems, and delicious regional dining.",
    },
  ];

  return (
    <section id="about" className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-100 dark:bg-heritage-950 text-heritage-800 dark:text-heritage-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-heritage-600" />
            <span>About The Property</span>
          </div>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mb-4">
            {profile.about_heading || `Welcome to ${profile.name}`}
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-6" />
          <p className="text-slate-600 dark:text-stone-300 text-base sm:text-lg leading-relaxed text-left sm:text-center whitespace-pre-line">
            {profile.about_text}
          </p>
        </div>

        {/* Highlights 4-Col Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-heritage-100 dark:bg-heritage-950/80 flex items-center justify-center text-heritage-700 dark:text-heritage-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-stone-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-stone-300 leading-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
