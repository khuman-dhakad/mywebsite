import { MapPin, Navigation, Compass, ExternalLink } from "lucide-react";
import { HotelProfile } from "@/types/database";
import { sanitizeMapEmbedUrl } from "@/lib/utils";

interface LocationProps {
  profile: HotelProfile;
}

export function Location({ profile }: LocationProps) {
  const sanitizedEmbedUrl = sanitizeMapEmbedUrl(profile.google_map_embed_url);
  const directionsUrl =
    profile.google_map_directions_url ||
    `https://maps.google.com/?q=${encodeURIComponent(`${profile.name} ${profile.address}`)}`;

  const landmarks = [
    { name: "Hawa Mahal (Palace of Winds)", distance: "400 metres", time: "4 min walk" },
    { name: "City Palace & Jantar Mantar", distance: "850 metres", time: "9 min walk" },
    { name: "Bapu Bazaar (Shopping)", distance: "1.2 km", time: "5 min e-rickshaw" },
    { name: "Jaipur Junction Railway Station", distance: "4.8 km", time: "15 min drive" },
    { name: "Jaipur International Airport", distance: "12 km", time: "25 min cab" },
  ];

  return (
    <section id="location" className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-100 dark:bg-heritage-950 text-heritage-800 dark:text-heritage-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-heritage-600" />
            <span>Prime Central Location</span>
          </div>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mb-3">
            How to Reach Us
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 dark:text-stone-300 text-base">
            Conveniently situated in the historic centre with easy access to autorickshaws, markets, and railway connectivity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Address & Nearby Landmarks */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div className="p-4 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-heritage-100 dark:bg-heritage-950/80 text-heritage-700 dark:text-heritage-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100">
                    Property Address
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-stone-300 mt-1 leading-relaxed">
                    {profile.address}
                  </p>
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-heritage-700 hover:bg-heritage-800 text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>
            </div>

            {/* Landmarks List */}
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-700 dark:text-heritage-400 mb-3">
                Key Distances & Monuments
              </h4>
              <ul className="space-y-3">
                {landmarks.map((spot, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-sm border-b border-stone-200/60 dark:border-stone-700/60 pb-2.5 last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-slate-800 dark:text-stone-200">
                      {spot.name}
                    </span>
                    <span className="text-slate-500 dark:text-stone-400 text-right shrink-0 ml-2">
                      {spot.distance} &bull; {spot.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Map Embed Container */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 shadow-md bg-stone-100 dark:bg-stone-800">
              {sanitizedEmbedUrl ? (
                <iframe
                  src={sanitizedEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Google Maps location of ${profile.name}`}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 dark:text-stone-400">
                  <MapPin className="w-12 h-12 text-slate-400 mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-stone-200">
                    Interactive Map Location
                  </p>
                  <p className="text-sm mt-1 mb-4">{profile.address}</p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-heritage-700 text-white text-sm font-semibold hover:bg-heritage-800"
                  >
                    <Navigation className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
