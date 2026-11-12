import Image from "next/image";
import { MessageCircle, Users, Bed, Check, Ban } from "lucide-react";
import { Room, HotelProfile } from "@/types/database";
import { formatRupees, buildWhatsAppUrl, SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

interface RoomsProps {
  rooms: Room[];
  profile: HotelProfile;
}

export function Rooms({ rooms, profile }: RoomsProps) {
  return (
    <section id="rooms" className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-700 dark:text-heritage-400">
            Rooms & Best Tariffs
          </span>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mt-2 mb-3">
            Clean, Comfortable Lodging in {profile.city}
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 dark:text-stone-300 text-base">
            No booking agent commission. Transparent prices in Indian Rupees with complimentary high-speed Wi-Fi and 24-hr hot water.
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md mx-auto">
            <p className="text-slate-600 dark:text-stone-300 mb-4">
              Room rates are currently being updated. Please contact us directly via WhatsApp or call for immediate booking assistance.
            </p>
            <a
              href={buildWhatsAppUrl(profile.whatsapp_number, `Inquiry regarding room availability at ${profile.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Inquire on WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {rooms.map((room) => {
              const bookWhatsAppUrl = buildWhatsAppUrl(
                profile.whatsapp_number,
                `Namaste! I would like to inquire about booking the "${room.name}" (${formatRupees(
                  room.price_per_night
                )}/night) at ${profile.name}. Are rooms available for my dates?`
              );

              return (
                <div
                  key={room.id}
                  className="flex flex-col bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Room Photo */}
                  <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    {room.image_url ? (
                      <Image
                        src={room.image_url}
                        alt={`${room.name} at ${profile.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={SHIMMER_BLUR_DATA_URL}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-stone-500 text-sm">
                        Photo coming soon
                      </div>
                    )}

                    {/* Availability Tag */}
                    <div className="absolute top-3 right-3">
                      {room.is_available ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                          <Check className="w-3.5 h-3.5" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white shadow-sm">
                          <Ban className="w-3.5 h-3.5" />
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Room Content */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Price */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-stone-100 group-hover:text-heritage-700 dark:group-hover:text-heritage-400 transition-colors">
                          {room.name}
                        </h3>
                      </div>

                      <div className="mb-4">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-stone-50">
                          {formatRupees(room.price_per_night)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-stone-400 ml-1.5 font-medium">
                          / night + taxes
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-stone-300 line-clamp-3 mb-5 leading-relaxed">
                        {room.description}
                      </p>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-3 py-3 border-y border-stone-100 dark:border-stone-800 text-xs text-slate-600 dark:text-stone-300 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-heritage-600" />
                          <span>{room.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-4 h-4 text-heritage-600" />
                          <span>{room.bed_type}</span>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {room.amenities.slice(0, 4).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300"
                            >
                              {amenity}
                            </span>
                          ))}
                          {room.amenities.length > 4 && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-slate-500">
                              +{room.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Booking Action */}
                    <div className="pt-2">
                      {room.is_available ? (
                        <a
                          href={bookWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Book This Room on WhatsApp</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3 px-4 rounded-xl bg-slate-200 dark:bg-stone-800 text-slate-500 dark:text-stone-500 font-semibold text-sm cursor-not-allowed min-h-[44px]"
                        >
                          Currently Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
