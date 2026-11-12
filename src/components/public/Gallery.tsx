"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/types/database";
import { SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

interface GalleryProps {
  photos: Photo[];
  hotelName: string;
}

export function Gallery({ photos, hotelName }: GalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const bodyOverflowRef = useRef("");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const wasOpenRef = useRef(false);

  const categories = ["All", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];

  const filteredPhotos =
    activeCategory === "All" ? photos : photos.filter((p) => p.category === activeCategory);

  const openLightbox = (idx: number) => {
    bodyOverflowRef.current = document.body.style.overflow;
    triggerRef.current = document.activeElement instanceof HTMLButtonElement
      ? document.activeElement
      : null;
    setSelectedIdx(idx);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setSelectedIdx(null);
    document.body.style.overflow = bodyOverflowRef.current;
  }, []);

  useEffect(() => {
    if (selectedIdx !== null) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [selectedIdx]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = bodyOverflowRef.current;
    };
  }, []);

  const nextPhoto = useCallback(() => {
    if (selectedIdx !== null && filteredPhotos.length > 0) {
      setSelectedIdx((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0));
    }
  }, [selectedIdx, filteredPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (selectedIdx !== null && filteredPhotos.length > 0) {
      setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1));
    }
  }, [selectedIdx, filteredPhotos.length]);

  // Keyboard navigation & focus trap for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") {
        closeLightbox();
        return;
      }
      if (e.key === "ArrowRight") {
        nextPhoto();
        return;
      }
      if (e.key === "ArrowLeft") {
        prevPhoto();
        return;
      }
      if (e.key === "Tab" && lightboxRef.current) {
        const focusables = lightboxRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, closeLightbox, nextPhoto, prevPhoto]);

  return (
    <section id="gallery" className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-100 dark:bg-heritage-950 text-heritage-800 dark:text-heritage-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5 text-heritage-600" />
            <span>Visual Tour</span>
          </div>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mb-3">
            Photo Gallery
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 dark:text-stone-300 text-base">
            Take a look inside our rooms, courtyards, rooftop terrace, and surrounding heritage sights.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
            role="tablist"
            aria-label="Filter photos by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedIdx(null);
                }}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-heritage-600 ${
                  activeCategory === cat
                    ? "bg-heritage-700 text-white"
                    : "bg-stone-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-stone-400">
            No photos found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {filteredPhotos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(idx)}
                type="button"
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-heritage-600 text-left block w-full"
                aria-label={`View photo ${idx + 1}: ${photo.alt_text}`}
              >
                <Image
                  src={photo.url}
                  alt={photo.alt_text}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={SHIMMER_BLUR_DATA_URL}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                    {photo.category}
                  </span>
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {photo.caption || photo.alt_text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Accessible Lightbox Modal */}
      {selectedIdx !== null && filteredPhotos[selectedIdx] && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          onClick={closeLightbox}
          onTouchStart={(e) => {
            touchStartXRef.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartXRef.current === null) return;
            const endX = e.changedTouches[0]?.clientX;
            if (typeof endX === "number") {
              const delta = endX - touchStartXRef.current;
              if (delta > 50) prevPhoto();
              else if (delta < -50) nextPhoto();
            }
            touchStartXRef.current = null;
          }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-6 overscroll-contain"
        >
          {/* Close button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
            aria-label="Close Lightbox (Escape)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
            aria-label="Previous Photo (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image & Caption */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
          >
            <div className="relative w-full h-[65vh] sm:h-[75vh]">
              <Image
                src={filteredPhotos[selectedIdx].url}
                alt={filteredPhotos[selectedIdx].alt_text}
                fill
                sizes="(max-width: 768px) 100vw, 90vw"
                placeholder="blur"
                blurDataURL={SHIMMER_BLUR_DATA_URL}
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-center px-4 max-w-2xl">
              <p className="text-white text-sm sm:text-base font-medium">
                {filteredPhotos[selectedIdx].caption || filteredPhotos[selectedIdx].alt_text}
              </p>
              <p className="text-stone-400 text-xs mt-1">
                Photo {selectedIdx + 1} of {filteredPhotos.length} &bull; {hotelName}
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
            aria-label="Next Photo (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
