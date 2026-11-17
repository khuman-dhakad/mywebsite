"use client";

import { useState } from "react";
import { Star, CheckCircle2, Quote, Award } from "lucide-react";
import { GuestReview } from "@/types/database";

interface ReviewsProps {
  reviews: GuestReview[];
  ratingsSummary: {
    overall: number;
    total: number;
    cleanliness: number;
    location: number;
    hospitality: number;
    value: number;
  };
  hotelName: string;
}

export function Reviews({ reviews, ratingsSummary, hotelName }: ReviewsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Family", "Couple", "Solo", "Business"];

  const filteredReviews =
    selectedCategory === "All"
      ? reviews
      : reviews.filter((r) => r.category === selectedCategory);

  return (
    <section
      id="reviews"
      className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-100 dark:bg-heritage-950 text-heritage-800 dark:text-heritage-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-heritage-600" />
            <span>Guest Experiences</span>
          </div>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mb-3">
            Loved by Travelers from Across the Globe
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 dark:text-stone-300 text-base">
            Read authentic, unfiltered feedback from families, couples, and solo travelers who stayed at {hotelName}.
          </p>
        </div>

        {/* Ratings Breakdown Luxury Card */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm luxury-card-glow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Score Highlight */}
            <div className="lg:col-span-4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <span className="font-serif text-5xl font-extrabold text-slate-900 dark:text-stone-50">
                  {ratingsSummary.overall.toFixed(1)}
                </span>
                <div>
                  <div className="flex text-amber-500 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-stone-400 font-medium">
                    Verified Google & Guest Rating
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-stone-200">
                Based on {ratingsSummary.total}+ verified traveler reviews
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Top Rated Heritage Lodge
              </span>
            </div>

            {/* Sub-ratings Pillars */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-stone-400 mb-1">Cleanliness</div>
                <div className="text-xl font-bold text-slate-900 dark:text-stone-100">
                  {ratingsSummary.cleanliness} / 5.0
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-heritage-600 h-full rounded-full" style={{ width: `${(ratingsSummary.cleanliness / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 dark:text-stone-400 mb-1">Location</div>
                <div className="text-xl font-bold text-slate-900 dark:text-stone-100">
                  {ratingsSummary.location} / 5.0
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-heritage-600 h-full rounded-full" style={{ width: `${(ratingsSummary.location / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 dark:text-stone-400 mb-1">Hospitality</div>
                <div className="text-xl font-bold text-slate-900 dark:text-stone-100">
                  {ratingsSummary.hospitality} / 5.0
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-heritage-600 h-full rounded-full" style={{ width: `${(ratingsSummary.hospitality / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 dark:text-stone-400 mb-1">Value for Money</div>
                <div className="text-xl font-bold text-slate-900 dark:text-stone-100">
                  {ratingsSummary.value} / 5.0
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-heritage-600 h-full rounded-full" style={{ width: `${(ratingsSummary.value / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8" role="tablist" aria-label="Filter reviews by traveler type">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all min-h-[38px] ${
                  active
                    ? "bg-heritage-700 text-white shadow-sm"
                    : "bg-white dark:bg-stone-900 text-slate-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                {cat === "All" ? "All Reviews" : `${cat} Travelers`}
              </button>
            );
          })}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header: Stars & Verified Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500 gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Stay
                    </span>
                  )}
                </div>

                {/* Review Title */}
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-2">
                  &ldquo;{review.title}&rdquo;
                </h3>

                {/* Review Body */}
                <p className="text-sm text-slate-600 dark:text-stone-300 leading-relaxed mb-6">
                  {review.comment}
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-stone-100">
                    {review.author}
                  </div>
                  <div className="text-slate-500 dark:text-stone-400">
                    from {review.location} &bull; {review.category} Stay
                  </div>
                </div>
                <div className="text-slate-400 dark:text-stone-500 font-mono">
                  {review.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
