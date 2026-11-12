"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Bed, Users, ArrowUp, ArrowDown } from "lucide-react";
import { Room } from "@/types/database";
import { formatRupees } from "@/lib/utils";
import {
  upsertRoomAction,
  deleteRoomAction,
  toggleRoomAvailabilityAction,
  reorderRoomsAction,
} from "@/app/admin/actions";

interface RoomsManagerProps {
  initialRooms: Room[];
}

export function RoomsManager({ initialRooms }: RoomsManagerProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isAddingNew && !editingRoom) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAddingNew(false);
        setEditingRoom(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAddingNew, editingRoom]);

  const handleToggleAvailability = async (room: Room) => {
    const nextVal = !room.is_available;
    setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, is_available: nextVal } : r)));

    const res = await toggleRoomAvailabilityAction(room.id, nextVal);
    if (!res.success) {
      setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, is_available: !nextVal } : r)));
      setToast({ type: "error", text: res.error || "Failed to update availability" });
    } else {
      router.refresh();
      setToast({ type: "success", text: `Room marked as ${nextVal ? "Available" : "Unavailable"}` });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleMoveRoom = async (index: number, direction: "up" | "down") => {
    const nextIdx = direction === "up" ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= rooms.length) return;

    const previous = [...rooms];
    const copy = [...rooms];
    const [moved] = copy.splice(index, 1);
    copy.splice(nextIdx, 0, moved);
    setRooms(copy);

    const res = await reorderRoomsAction(copy.map((r) => r.id));
    if (!res.success) {
      setRooms(previous);
      setToast({ type: "error", text: res.error || "Failed to save room order." });
    } else {
      router.refresh();
      setToast({ type: "success", text: "Room order updated!" });
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to permanently delete this room?")) return;

    setLoading(true);
    const res = await deleteRoomAction(roomId);
    setLoading(false);

    if (res.success) {
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      router.refresh();
      setToast({ type: "success", text: "Room deleted successfully." });
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ type: "error", text: res.error || "Failed to delete room." });
    }
  };

  const handleSaveRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await upsertRoomAction(null, formData);
    setLoading(false);

    if (res.success) {
      if (res.room) {
        const savedRoom = res.room as Room;
        setRooms((prev) => {
          const exists = prev.some((r) => r.id === savedRoom.id);
          return exists
            ? prev.map((r) => (r.id === savedRoom.id ? savedRoom : r))
            : [...prev, savedRoom];
        });
      }
      setToast({ type: "success", text: res.message || "Room saved!" });
      setTimeout(() => setToast(null), 3000);
      setIsAddingNew(false);
      setEditingRoom(null);
      router.refresh();
    } else {
      setToast({ type: "error", text: res.error || "Failed to save room." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : "bg-red-600 text-white border-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-semibold text-sm">{toast.text}</span>
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-stone-100">
            Rooms & Tariffs Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-1">
            Update room rates in Indian Rupees (₹), photos, and live availability status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingRoom(null);
            setIsAddingNew(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-heritage-700 hover:bg-heritage-800 text-white font-semibold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room (नया कमरा जोड़ें)</span>
        </button>
      </div>

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, idx) => (
          <div
            key={room.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-800">
                {room.image_url ? (
                  <Image
                    src={room.image_url}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    No image uploaded
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 rounded-lg p-0.5 opacity-90">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveRoom(idx, "up")}
                    className="p-1 text-white hover:bg-white/20 rounded disabled:opacity-30"
                    aria-label="Move room up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === rooms.length - 1}
                    onClick={() => handleMoveRoom(idx, "down")}
                    className="p-1 text-white hover:bg-white/20 rounded disabled:opacity-30"
                    aria-label="Move room down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                      room.is_available ? "bg-emerald-600" : "bg-red-600"
                    }`}
                  >
                    {room.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
                    {room.name}
                  </h3>
                  <span className="font-bold text-lg text-heritage-700 dark:text-heritage-400">
                    {formatRupees(room.price_per_night)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-stone-400 line-clamp-2 mb-4">
                  {room.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-stone-300 py-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {room.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-slate-400" />
                    {room.bed_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-stone-50 dark:bg-stone-850 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleToggleAvailability(room)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors min-h-[36px] ${
                  room.is_available
                    ? "border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                    : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                }`}
              >
                {room.is_available ? "Mark Sold Out" : "Mark Available"}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingRoom(room);
                  }}
                  className="p-2 text-slate-600 dark:text-stone-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  aria-label="Edit room details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRoom(room.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  aria-label="Delete room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Room Modal */}
      {(isAddingNew || editingRoom) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingRoom ? `Edit ${editingRoom.name}` : "Add New Room"}
          onClick={() => {
            setIsAddingNew(false);
            setEditingRoom(null);
          }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-stone-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 my-8"
          >
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-stone-100 mb-1">
              {editingRoom ? `Edit: ${editingRoom.name}` : "Add New Room"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-stone-400 mb-6">
              Enter room details, tariffs, and photo link.
            </p>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              {editingRoom && <input type="hidden" name="id" value={editingRoom.id} />}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-stone-300 mb-1">
                  Room Name *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={editingRoom?.name || ""}
                  placeholder="e.g. Deluxe AC Heritage Room"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-stone-300 mb-1">
                    Price per Night (₹) *
                  </label>
                  <input
                    name="price_per_night"
                    type="number"
                    min={100}
                    max={100000}
                    required
                    defaultValue={editingRoom?.price_per_night || 999}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 font-mono focus:outline-none focus:ring-2 focus:ring-heritage-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-stone-300 mb-1">
                    Capacity
                  </label>
                  <input
                    name="capacity"
                    type="text"
                    defaultValue={editingRoom?.capacity || "2 Adults"}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-stone-300 mb-1">
                    Bed Type
                  </label>
                  <input
                    name="bed_type"
                    type="text"
                    defaultValue={editingRoom?.bed_type || "1 Queen Bed"}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-stone-300 mb-1">
                    Availability Status
                  </label>
                  <select
                    name="is_available"
                    defaultValue={editingRoom ? String(editingRoom.is_available) : "true"}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                  >
                    <option value="true">Available for Booking</option>
                    <option value="false">Sold Out / Full</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-stone-300 mb-1">
                  Photo URL
                </label>
                <input
                  name="image_url"
                  type="url"
                  defaultValue={editingRoom?.image_url || ""}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-stone-300 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={editingRoom?.description || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-stone-300 mb-1">
                  Amenities (Comma separated)
                </label>
                <input
                  name="amenities"
                  type="text"
                  defaultValue={editingRoom?.amenities?.join(", ") || "Air Conditioning, Free Wi-Fi, Geyser Hot Water"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingRoom(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-stone-700 text-slate-700 dark:text-stone-300 text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-heritage-700 hover:bg-heritage-800 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
