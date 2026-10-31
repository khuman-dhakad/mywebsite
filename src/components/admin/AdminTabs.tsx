"use client";

import { useState } from "react";
import { Settings, BedDouble, Camera, Sparkles } from "lucide-react";
import { HotelProfile, Room, Photo } from "@/types/database";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { RoomsManager } from "./RoomsManager";
import { PhotoManager } from "./PhotoManager";

interface AdminTabsProps {
  profile: HotelProfile;
  rooms: Room[];
  photos: Photo[];
}

export function AdminTabs({ profile, rooms, photos }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<"general" | "rooms" | "photos">("general");

  const tabs = [
    {
      id: "general" as const,
      label: "General & Contact",
      subLabel: "सामान्य जानकारी",
      icon: Settings,
    },
    {
      id: "rooms" as const,
      label: "Rooms & Rates",
      subLabel: "कमरे और किराया",
      icon: BedDouble,
      count: rooms.length,
    },
    {
      id: "photos" as const,
      label: "Photo Gallery",
      subLabel: "फोटो गैलरी",
      icon: Camera,
      count: photos.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation Navigation Bar */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-2xl p-1.5 shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-heritage-600 ${
                isActive
                  ? "bg-heritage-700 text-white shadow-md"
                  : "text-slate-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="flex flex-col text-left">
                <span>{tab.label}</span>
                <span className={`text-[10px] font-normal ${isActive ? "text-amber-200" : "text-slate-400"}`}>
                  {tab.subLabel}
                </span>
              </div>
              {tab.count !== undefined && (
                <span
                  className={`ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-heritage-800 text-amber-200"
                      : "bg-stone-100 dark:bg-stone-800 text-slate-600 dark:text-stone-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "general" && <GeneralSettingsForm profile={profile} />}
        {activeTab === "rooms" && <RoomsManager initialRooms={rooms} />}
        {activeTab === "photos" && (
          <PhotoManager initialPhotos={photos} currentHeroUrl={profile.hero_image_url} />
        )}
      </div>
    </div>
  );
}
