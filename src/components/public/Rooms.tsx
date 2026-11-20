"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  MessageCircle,
  Users,
  Bed,
  Check,
  Ban,
  Sparkles,
  Coffee,
  ShieldCheck,
  Clock,
  ArrowUpDown,
  Wifi,
  Snowflake,
  Tv,
  Droplets,
  Wind,
  Eye,
} from "lucide-react";
import { Room, HotelProfile } from "@/types/database";
import { formatRupees, buildWhatsAppUrl, SHIMMER_BLUR_DATA_URL } from "@/lib/utils";
import { BookingModal } from "@/components/public/BookingModal";

function getAmenityIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("wi-fi") || lower.includes("wifi")) return Wifi;
  if (lower.includes("air") || lower.includes("ac")) return Snowflake;
  if (lower.includes("tv") || lower.includes("television")) return Tv;
  if (lower.includes("water") || lower.includes("geyser") || lower.includes("shower")) return Droplets;
  if (lower.includes("kettle") || lower.includes("tea") || lower.includes("coffee")) return Coffee;
  if (lower.includes("fan")) return Wind;
  if (lower.includes("view") || lower.includes("balcony")) return Eye;
  return Sparkles;
}

interface RoomsProps {
  rooms: Room[];
  profile: HotelProfile;
  onSelectRoomForInquiry?: (room: Room) => void;
}

export function Rooms({ rooms, profile, onSelectRoomForInquiry }: RoomsProps) {
  const [filterType, setFilterType] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRoom, setModalRoom] = useState<Room | null>(null);

  const handleOpenModal = (room: Room) => {
    setModalRoom(room);
    setIsModalOpen(true);
    if (onSelectRoomForInquiry) {
      onSelectRoomForInquiry(room);
    }
  };

  const filterTabs = [
    { label: "All Rooms", value: "All" },
    { label: "Family Suites", value: "Family" },
    { label: "Double / Couples", value: "Double" },
    { label: "Deluxe AC", value: "Deluxe" },
  ];

  const directPerks = [
    { icon: ShieldCheck, text: "0% Commission (Lowest Price Guaranteed)" },
    { icon: Coffee, text: "Complimentary Welcome Masala Chai" },
    { icon: Clock, text: "Flexible Check-In (Subject to availability)" },
    { icon: Sparkles, text: "Free Luggage Storage on Arrival & Departure" },
  ];

  const processedRooms = useMemo(() => {
    let result = [...rooms];

    // Filter
    if (filterType === "Family") {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes("family") ||
          r.capacity.toLowerCase().includes("3") ||
          r.capacity.toLowerCase().includes("4") ||
          r.capacity.toLowerCase().includes("family")
      );
    } else if (filterType === "Double") {
      result = result.filter(
        (r) =>
          r.bed_type.toLowerCase().includes("double") ||
          r.bed_type.toLowerCase().includes("king") ||
          r.bed_type.toLowerCase().includes("queen") ||
          r.name.toLowerCase().includes("double") ||
          r.capacity.toLowerCase().includes("2")
      );
    } else if (filterType === "Deluxe") {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes("deluxe") ||
          r.amenities.some((a) => a.toLowerCase().includes("ac") || a.toLowerCase().includes("air"))
      );
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price_per_night - b.price_per_night);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price_per_night - a.price_per_night);
    }

    return result;
  }, [rooms, filterType, sortBy]);

  return (
    <section id="rooms" className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
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

        {/* Direct Booking Perks Luxury Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-heritage-50 via-white to-heritage-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 border border-heritage-200 dark:border-heritage-800/80 shadow-sm luxury-card-glow">
          <div className="text-xs font-bold uppercase tracking-wider text-heritage-800 dark:text-heritage-300 text-center mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-heritage-600" />
            <span>Direct Lodge Reservation Privileges</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {directPerks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-stone-300">
                  <div className="w-7 h-7 rounded-lg bg-heritage-100 dark:bg-heritage-950 flex items-center justify-center text-heritage-700 dark:text-heritage-400 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{perk.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        {rooms.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Filter rooms by category">
              {filterTabs.map((tab) => {
                const active = filterType === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilterType(tab.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[36px] ${
                      active
                        ? "bg-heritage-700 text-white shadow-sm"
                        : "bg-white dark:bg-stone-900 text-slate-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-stone-400 flex items-center gap-1 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                aria-label="Sort rooms by price"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-heritage-600"
              >
                <option value="recommended">Featured Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Room Cards Grid */}
        {processedRooms.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md mx-auto">
            <p className="text-slate-600 dark:text-stone-300 mb-4">
              No rooms match the selected category. Contact us directly for custom group requirements or additional mattresses.
            </p>
            <button
              type="button"
              onClick={() => setFilterType("All")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-heritage-700 text-white text-xs font-semibold hover:bg-heritage-800 transition-colors"
            >
              View All Rooms
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {processedRooms.map((room) => {
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
                        <div className="flex items-baseline">
                          <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-stone-50">
                            {formatRupees(room.price_per_night)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-stone-400 ml-1.5 font-medium">
                            / night + taxes
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Direct booking price &bull; Zero commission</span>
                        </div>
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

                      {/* Amenities Pills with Icons */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {room.amenities.slice(0, 4).map((amenity, idx) => {
                            const IconComponent = getAmenityIcon(amenity);
                            return (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300"
                              >
                                <IconComponent className="w-3 h-3 text-heritage-600 shrink-0" />
                                <span>{amenity}</span>
                              </span>
                            );
                          })}
                          {room.amenities.length > 4 && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-slate-500">
                              +{room.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Booking Actions */}
                    <div className="pt-2 space-y-2">
                      {room.is_available ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenModal(room)}
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-heritage-700 hover:bg-heritage-800 text-white font-semibold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
                          >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Reserve / Check Dates</span>
                          </button>

                          <a
                            href={bookWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Quick Book on WhatsApp</span>
                          </a>
                        </>
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

      {/* Luxury Interactive Reservation Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRoom={modalRoom}
        rooms={rooms}
        profile={profile}
      />
    </section>
  );
}
