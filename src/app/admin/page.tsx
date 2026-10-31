import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GeneralSettingsForm } from "@/components/admin/GeneralSettingsForm";
import { RoomsManager } from "@/components/admin/RoomsManager";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { IdleTimer } from "@/components/admin/IdleTimer";
import { getHotelProfile, getRooms, getPhotos } from "@/lib/data";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Hotel Management Portal | Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminDashboardPage() {
  // Server-side authentication & tenant authorization enforcement
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRecord } = await supabase
    .from("site_admins")
    .select("site_id")
    .eq("user_id", user.id)
    .eq("site_id", siteConfig.siteId)
    .single();

  if (!adminRecord) {
    redirect("/admin/login?error=unauthorized_site");
  }

  const [profile, rooms, photos] = await Promise.all([
    getHotelProfile(),
    getRooms(),
    getPhotos(),
  ]);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col">
      {/* Session Inactivity Timeout Detector */}
      <IdleTimer />

      {/* Admin Top Navigation */}
      <AdminHeader hotelName={profile.name} />

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminTabs
          profile={profile}
          rooms={rooms}
          photos={photos}
        />
      </main>
    </div>
  );
}
