"use client";

import { useEffect, useRef, useState, useId } from "react";
import { X, Calendar, Users, Sparkles, MessageCircle, ShieldCheck, Check, Info } from "lucide-react";
import { Room, HotelProfile } from "@/types/database";
import {
  calculateTariff,
  validateBookingDates,
  isHoneypotTriggered,
  generateInquiryToken,
  sanitizePlainText,
} from "@/lib/security";
import { formatRupees, buildWhatsAppUrl } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: Room | null;
  rooms: Room[];
  profile: HotelProfile;
}

export function BookingModal({
  isOpen,
  onClose,
  selectedRoom,
  rooms,
  profile,
}: BookingModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const honeypotId = useId();

  // Date calculation defaults
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [activeRoomId, setActiveRoomId] = useState<string>(selectedRoom?.id || rooms[0]?.id || "");
  const [checkIn, setCheckIn] = useState<string>(todayStr);
  const [checkOut, setCheckOut] = useState<string>(tomorrowStr);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [guestName, setGuestName] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Sync selectedRoom changes
  useEffect(() => {
    if (selectedRoom) {
      setActiveRoomId(selectedRoom.id);
    } else if (rooms.length > 0 && !activeRoomId) {
      setActiveRoomId(rooms[0].id);
    }
  }, [selectedRoom, rooms, activeRoomId]);

  // Sync native <dialog> open state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const currentRoom = rooms.find((r) => r.id === activeRoomId) || selectedRoom || rooms[0];

  // Validate dates and calculate tariff
  const dateValidation = validateBookingDates(checkIn, checkOut);
  const nights = dateValidation.valid ? dateValidation.nights : 1;
  const tariff = calculateTariff(currentRoom ? currentRoom.price_per_night : 1200, nights);

  const minCheckOutDate = (() => {
    if (!checkIn) return tomorrowStr;
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return isNaN(d.getTime()) ? tomorrowStr : d.toISOString().split("T")[0];
  })();

  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);
    if (newCheckIn && newCheckIn >= checkOut) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      if (!isNaN(nextDay.getTime())) {
        setCheckOut(nextDay.toISOString().split("T")[0]);
      }
    }
  };

  const toggleSpecialRequest = (req: string) => {
    setSpecialRequests((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot honeypot check
    if (isHoneypotTriggered(honeypot)) {
      onClose();
      return;
    }

    if (!dateValidation.valid) {
      setErrorMessage(dateValidation.error || "Please select valid check-in and check-out dates.");
      return;
    }

    setErrorMessage("");

    const cleanName = sanitizePlainText(guestName) || "Valued Guest";
    const token = generateInquiryToken();
    const reqText =
      specialRequests.length > 0 ? `\n• Special Notes: ${specialRequests.join(", ")}` : "";

    const message = `Namaste! I would like to reserve a stay at ${profile.name}.
    
*Booking Inquiry Reference: #${token}*
• Guest: ${cleanName}
• Room Type: ${currentRoom?.name || "Standard Room"}
• Check-In: ${checkIn} (from ${profile.check_in_time || "12:00 PM"})
• Check-Out: ${checkOut} (until ${profile.check_out_time || "11:00 AM"})
• Duration: ${nights} ${nights === 1 ? "Night" : "Nights"}
• Guests: ${adults} Adults${children > 0 ? `, ${children} Children` : ""}
• Est. Tariff: ${formatRupees(tariff.grandTotal)} (${formatRupees(tariff.pricePerNight)}/night)${reqText}

Please confirm availability and sharing payment details via UPI or direct bank transfer. Dhanyawad!`;

    const whatsappUrl = buildWhatsAppUrl(profile.whatsapp_number, message);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (!currentRoom) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={onClose}
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 m-auto p-0 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl text-slate-900 dark:text-stone-100 max-w-lg w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto z-50 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-heritage-700 dark:text-heritage-400">
              <Sparkles className="w-3.5 h-3.5 text-heritage-600" />
              <span>Direct Reservation Inquiry</span>
            </div>
            <h2 id="booking-modal-title" className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
              Check Dates & Tariffs
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking inquiry dialog"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleInquirySubmit} className="mt-5 space-y-4">
          {/* Honeypot field (hidden from genuine users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor={honeypotId}>Do not fill this field</label>
            <input
              id={honeypotId}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Room Selection */}
          <div>
            <label htmlFor="modal-room-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1.5">
              Select Room Type
            </label>
            <select
              id="modal-room-select"
              value={activeRoomId}
              onChange={(e) => setActiveRoomId(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-heritage-600"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} &bull; {formatRupees(r.price_per_night)}/night ({r.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="modal-checkin" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1.5">
                Check-In Date
              </label>
              <div className="relative">
                <input
                  id="modal-checkin"
                  type="date"
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-checkout" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1.5">
                Check-Out Date
              </label>
              <div className="relative">
                <input
                  id="modal-checkout"
                  type="date"
                  min={minCheckOutDate}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="modal-adults" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1.5">
                Adults
              </label>
              <select
                id="modal-adults"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
              >
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>4 Adults</option>
                <option value={5}>5+ (Group)</option>
              </select>
            </div>

            <div>
              <label htmlFor="modal-children" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1.5">
                Children
              </label>
              <select
                id="modal-children"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
              >
                <option value={0}>0 Children</option>
                <option value={1}>1 Child</option>
                <option value={2}>2 Children</option>
                <option value={3}>3+ Children</option>
              </select>
            </div>
          </div>

          {/* Guest Name */}
          <div>
            <label htmlFor="modal-guest-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1.5">
              Your Name (Optional)
            </label>
            <input
              id="modal-guest-name"
              type="text"
              placeholder="e.g. Ramesh Kumar"
              maxLength={60}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
            />
          </div>

          {/* Special Requests Pills */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
              Special Preferences
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Ground floor room",
                "Extra mattress",
                "Early check-in",
                "Pure veg meals",
              ].map((req) => {
                const selected = specialRequests.includes(req);
                return (
                  <button
                    key={req}
                    type="button"
                    onClick={() => toggleSpecialRequest(req)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selected
                        ? "bg-heritage-700 text-white shadow-sm"
                        : "bg-stone-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{req}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tariff Breakdown Card */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
            <div className="flex justify-between text-xs text-slate-600 dark:text-stone-300">
              <span>
                {formatRupees(tariff.pricePerNight)} &times; {nights} {nights === 1 ? "night" : "nights"}
              </span>
              <span className="font-semibold">{formatRupees(tariff.roomTotal)}</span>
            </div>

            <div className="flex justify-between text-xs text-slate-500 dark:text-stone-400">
              <span className="inline-flex items-center gap-1">
                Estimated GST / Taxes
                <Info className="w-3 h-3 text-slate-400" />
              </span>
              <span>{tariff.estimatedTaxes > 0 ? formatRupees(tariff.estimatedTaxes) : "Nil (Direct Booking)"}</span>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
                Estimated Total Tariff
              </span>
              <span className="font-serif text-xl font-bold text-slate-900 dark:text-stone-50">
                {formatRupees(tariff.grandTotal)}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors min-h-[48px]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Confirm & Send Inquiry on WhatsApp</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 dark:text-stone-400 mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct owner booking &bull; No upfront advance required to inquire</span>
            </p>
          </div>
        </form>
      </div>
    </dialog>
  );
}
