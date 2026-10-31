import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/config/site.config";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login" || pathname === "/login";

  // Enforce noindex headers on admin paths
  if (isAdminRoute || isLoginPage) {
    supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  // Prevent crashes if placeholder credentials are used during static builds,
  // but strictly block access to protected admin routes
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")) {
    if (isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          })
        );
      },
    },
  });

  // IMPORTANT: Avoid using getSession() which is insecure on the server. Always use getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Admin Route Protection
  if (isAdminRoute && !isLoginPage) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Verify tenant site authorization: Admin must belong to this specific site_id
    const { data: adminRecord, error: adminError } = await supabase
      .from("site_admins")
      .select("site_id, role")
      .eq("user_id", user.id)
      .eq("site_id", siteConfig.siteId)
      .single();

    if (adminError || !adminRecord) {
      // User is authenticated in Supabase, but NOT mapped to this site! (Cross-tenant IDOR defense)
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized_site");
      return NextResponse.redirect(url);
    }
  }

  // If already logged in and navigating to login page, redirect to /admin dashboard
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
