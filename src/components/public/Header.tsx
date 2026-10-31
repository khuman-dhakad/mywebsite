"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Menu, X, ShieldCheck, ChevronRight, MapPin } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { buildWhatsAppUrl, buildTelUrl } from "@/lib/utils";
import { HotelProfile } from "@/types/database";

interface HeaderProps {
  profile: HotelProfile;
}

export function Header({ profile }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);
  const firstNavRef = useRef<HTMLAnchorElement>(null);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle body scroll locking, accessibility attributes, and focus restoration
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-mobile-menu-open", "true");
      // Move focus into the first menu item
      setTimeout(() => {
        firstNavRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-mobile-menu-open");
      // Return focus to hamburger button on close if it was previously open
      if (prevOpenRef.current) {
        hamburgerBtnRef.current?.focus();
      }
    }
    prevOpenRef.current = mobileMenuOpen;

    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-mobile-menu-open");
    };
  }, [mobileMenuOpen]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mobileMenuOpen && e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const whatsappUrl = buildWhatsAppUrl(
    profile.whatsapp_number,
    profile.whatsapp_prefill || `Hello, I want to book a room at ${profile.name}.`
  );
  const telUrl = buildTelUrl(profile.phone);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Rooms & Rates", href: "#rooms" },
    { label: "Gallery", href: "#gallery" },
    { label: "Amenities", href: "#amenities" },
    { label: "Location", href: "#location" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 h-[60px] md:h-auto ${
        isScrolled
          ? "bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-md py-0 md:py-3"
          : "bg-white dark:bg-stone-900 border-b border-slate-200 dark:border-stone-800 py-0 md:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full md:h-auto">
        <div className="flex items-center justify-between h-[60px] md:h-auto">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 max-w-[calc(100vw-120px)] md:max-w-none group focus:outline-none focus:ring-2 focus:ring-heritage-600 rounded-lg p-1"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg bg-heritage-700 text-white flex items-center justify-center font-serif font-bold text-base md:text-xl shadow-sm group-hover:bg-heritage-800 transition-colors">
              {profile.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif font-bold text-base sm:text-lg md:text-xl text-slate-900 dark:text-stone-100 tracking-tight leading-snug truncate md:overflow-visible">
                {profile.name}
              </span>
              <span className="hidden md:flex text-xs text-slate-500 dark:text-stone-400 font-medium items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-heritage-600" />
                {profile.city}, {profile.state}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-stone-200 hover:text-heritage-700 dark:hover:text-heritage-400 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-heritage-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />

            {/* Quick Call Button (Desktop/Tablet sm+) */}
            <a
              href={telUrl}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-stone-700 text-slate-800 dark:text-stone-200 hover:bg-slate-50 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-heritage-600 transition-colors min-h-[44px]"
              aria-label={`Call ${profile.name} at ${profile.phone}`}
            >
              <Phone className="w-4 h-4 text-heritage-700 dark:text-heritage-400" />
              <span>Call</span>
            </a>

            {/* Book on WhatsApp (Primary CTA, md+) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Book on</span> WhatsApp
            </a>

            {/* Mobile Hamburger Button */}
            <button
              ref={hamburgerBtnRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 dark:text-stone-200 hover:bg-slate-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-heritage-600"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dimmed Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 top-[60px] bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200 motion-reduce:transition-none"
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Full-Width Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          className="lg:hidden fixed inset-x-0 top-[60px] h-[calc(100dvh-60px)] bg-white dark:bg-stone-900 border-b border-slate-200 dark:border-stone-800 z-50 flex flex-col justify-between shadow-2xl overflow-y-auto transition-all duration-200 motion-reduce:transition-none"
        >
          <nav className="flex flex-col py-2 divide-y divide-slate-100 dark:divide-stone-800" aria-label="Mobile Navigation">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                ref={index === 0 ? firstNavRef : undefined}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-5 py-4 min-h-[48px] text-base font-semibold text-slate-800 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/80 hover:text-heritage-700 dark:hover:text-heritage-400 transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-stone-500" />
              </a>
            ))}
          </nav>

          {/* Compact Contact Row at Panel Bottom */}
          <div className="p-4 border-t border-slate-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/70 text-xs text-slate-600 dark:text-stone-400 space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-heritage-600 shrink-0" />
              <a href={telUrl} className="font-semibold text-slate-900 dark:text-stone-100 hover:underline">
                {profile.phone}
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-heritage-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{profile.address}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
