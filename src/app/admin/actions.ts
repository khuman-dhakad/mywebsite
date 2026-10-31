"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site.config";
import { hotelProfileSchema, roomSchema, photoSchema } from "@/lib/validations/hotel";

/**
 * Ensures authenticated user is a verified admin for this tenant's site_id
 */
async function verifyAdminAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized. Please log in.");
  }

  // Check admin mapping in database
  const { data: adminRecord, error: adminError } = await supabase
    .from("site_admins")
    .select("site_id, role")
    .eq("user_id", user.id)
    .eq("site_id", siteConfig.siteId)
    .single();

  if (adminError || !adminRecord) {
    throw new Error("Access denied: You do not have management permissions for this hotel.");
  }

  return { supabase, user };
}

export async function updateHotelProfile(prevState: unknown, formData: FormData) {
  try {
    const { supabase } = await verifyAdminAuth();

    const rawData = {
      name: formData.get("name"),
      tagline: formData.get("tagline") || null,
      about_heading: formData.get("about_heading") || null,
      about_text: formData.get("about_text"),
      hero_image_url: formData.get("hero_image_url") || null,
      hero_subtitle: formData.get("hero_subtitle") || null,
      phone: formData.get("phone"),
      whatsapp_number: formData.get("whatsapp_number"),
      email: formData.get("email") || null,
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      postal_code: formData.get("postal_code") || null,
      google_map_embed_url: formData.get("google_map_embed_url") || null,
      google_map_directions_url: formData.get("google_map_directions_url") || null,
      check_in_time: formData.get("check_in_time") || "12:00 PM",
      check_out_time: formData.get("check_out_time") || "11:00 AM",
      reception_hours: formData.get("reception_hours") || "24 Hours Front Desk",
      seo_title: formData.get("seo_title") || null,
      seo_description: formData.get("seo_description") || null,
      whatsapp_prefill: formData.get("whatsapp_prefill") || null,
      social_facebook: formData.get("social_facebook") || null,
      social_instagram: formData.get("social_instagram") || null,
    };

    const validated = hotelProfileSchema.parse(rawData);

    const { error } = await supabase
      .from("hotel_profiles")
      .upsert({
        site_id: siteConfig.siteId,
        ...validated,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true, message: "Hotel profile updated successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return { success: false, error: message };
  }
}

export async function upsertRoomAction(prevState: unknown, formData: FormData) {
  try {
    const { supabase } = await verifyAdminAuth();

    const roomId = formData.get("id")?.toString();
    const rawAmenities = formData.get("amenities")?.toString() || "";
    const amenitiesList = rawAmenities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price_per_night: formData.get("price_per_night"),
      image_url: formData.get("image_url") || null,
      capacity: formData.get("capacity") || "2 Adults",
      bed_type: formData.get("bed_type") || "1 Queen Bed",
      amenities: amenitiesList,
      is_available: formData.get("is_available") === "true",
      is_published: formData.get("is_published") !== "false",
      sort_order: formData.get("sort_order") || 0,
    };

    const validated = roomSchema.parse(rawData);

    const roomPayload = {
      site_id: siteConfig.siteId,
      ...validated,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (roomId) {
      const res = await supabase
        .from("rooms")
        .update(roomPayload)
        .eq("id", roomId)
        .eq("site_id", siteConfig.siteId);
      error = res.error;
    } else {
      const res = await supabase.from("rooms").insert(roomPayload);
      error = res.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true, message: roomId ? "Room updated!" : "Room created!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save room";
    return { success: false, error: message };
  }
}

export async function deleteRoomAction(roomId: string) {
  try {
    const { supabase } = await verifyAdminAuth();

    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", roomId)
      .eq("site_id", siteConfig.siteId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete room";
    return { success: false, error: message };
  }
}

export async function toggleRoomAvailabilityAction(roomId: string, isAvailable: boolean) {
  try {
    const { supabase } = await verifyAdminAuth();

    const { error } = await supabase
      .from("rooms")
      .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
      .eq("id", roomId)
      .eq("site_id", siteConfig.siteId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update availability";
    return { success: false, error: message };
  }
}

export async function savePhotoAction(photoInput: {
  url: string;
  alt_text: string;
  caption?: string;
  category?: string;
  is_hero?: boolean;
}) {
  try {
    const { supabase } = await verifyAdminAuth();

    const validated = photoSchema.parse({
      url: photoInput.url,
      alt_text: photoInput.alt_text,
      caption: photoInput.caption || "",
      category: photoInput.category || "General",
      is_hero: photoInput.is_hero || false,
      sort_order: 0,
    });

    const { data, error } = await supabase.from("photos").insert({
      site_id: siteConfig.siteId,
      ...validated,
    }).select().single();

    if (error) return { success: false, error: error.message };

    if (validated.is_hero) {
      await supabase
        .from("hotel_profiles")
        .update({ hero_image_url: validated.url })
        .eq("site_id", siteConfig.siteId);
    }

    revalidatePath("/");
    return { success: true, photo: data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save photo";
    return { success: false, error: message };
  }
}

export async function deletePhotoAction(photoId: string) {
  try {
    const { supabase } = await verifyAdminAuth();

    const { error } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId)
      .eq("site_id", siteConfig.siteId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete photo";
    return { success: false, error: message };
  }
}

export async function setHeroPhotoAction(photoUrl: string) {
  try {
    const { supabase } = await verifyAdminAuth();

    // Reset other photos is_hero
    await supabase
      .from("photos")
      .update({ is_hero: false })
      .eq("site_id", siteConfig.siteId);

    // Set selected photo is_hero
    await supabase
      .from("photos")
      .update({ is_hero: true })
      .eq("url", photoUrl)
      .eq("site_id", siteConfig.siteId);

    // Update hotel profile hero image
    const { error } = await supabase
      .from("hotel_profiles")
      .update({ hero_image_url: photoUrl })
      .eq("site_id", siteConfig.siteId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to set hero photo";
    return { success: false, error: message };
  }
}

export async function logoutAdminAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
