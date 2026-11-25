"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import templatesData from "@/data/templates.json";
import { TemplateItem } from "@/types/resume";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreviewModal } from "@/components/TemplatePreviewModal";
import { useApp } from "@/lib/store";

const ALL_TEMPLATES = templatesData as TemplateItem[];
const CATEGORIES = [
  "All",
  "Executive",
  "Creative & Design",
  "Tech & Engineering",
  "Minimalist",
  "Academic",
] as const;

function TemplatesGalleryContent() {
  const searchParams = useSearchParams();
  const { favoriteIds } = useApp();

  const initialSeries = searchParams.get("series");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [series, setSeries] = useState<"All" | "InDesign" | "Illustrator">(
    initialSeries === "InDesign" || initialSeries === "Illustrator"
      ? initialSeries
      : "All"
  );
  const [onlyFavorites, setOnlyFavorites] = useState(
    searchParams.get("favorites") === "1"
  );
  const [visibleCount, setVisibleCount] = useState(24);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    setOnlyFavorites(searchParams.get("favorites") === "1");
    const s = searchParams.get("series");
    if (s === "InDesign" || s === "Illustrator") {
      setSeries(s);
    }
  }, [searchParams]);

  const indesignCount = useMemo(
    () => ALL_TEMPLATES.filter((t) => t.series === "InDesign").length,
    []
  );
  const illustratorCount = useMemo(
    () => ALL_TEMPLATES.filter((t) => t.series === "Illustrator").length,
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_TEMPLATES.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (series !== "All" && t.series !== series) return false;
      if (onlyFavorites && !favoriteIds.includes(t.id)) return false;
      if (q) {
        const hay = `${t.title} ${t.category} ${t.series} vol ${t.volume}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, category, series, onlyFavorites, favoriteIds]);

  const displayed = filtered.slice(0, visibleCount);
  const previewIdx = previewId ? filtered.findIndex((t) => t.id === previewId) : -1;
  const activePreview = previewIdx >= 0 ? filtered[previewIdx] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header + 3 Bento Series Cards (No redundant eyebrow pill above H1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-8">
        <div className="lg:col-span-6 space-y-2.5">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] tracking-tight text-[var(--text-primary)]">
            {ALL_TEMPLATES.length} designer{" "}
            <span className="text-[var(--accent-primary)]">CV templates.</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg">
            Click any A4 sheet to preview full-screen (HD image or live PDF),
            flip through editions with arrow keys, and download directly in
            Microsoft Word (`.docx`) or Print PDF.
          </p>
        </div>

        <div className="lg:col-span-6 grid grid-cols-3 gap-2.5 sm:gap-3.5">
          <button
            type="button"
            onClick={() => setSeries(series === "InDesign" ? "All" : "InDesign")}
            className={`text-left p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer ${
              series === "InDesign"
                ? "bg-[var(--accent-tint)] border-[var(--accent-primary)]"
                : "studio-card hover:border-[var(--accent-primary)]/40"
            }`}
          >
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">
              {indesignCount}
            </div>
            <div className="mt-0.5 text-[11px] sm:text-xs font-semibold text-[var(--text-primary)]">
              InDesign Series
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Editorial &amp; Print
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setSeries(series === "Illustrator" ? "All" : "Illustrator")
            }
            className={`text-left p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer ${
              series === "Illustrator"
                ? "bg-[var(--accent-tint)] border-[var(--accent-primary)]"
                : "studio-card hover:border-[var(--accent-primary)]/40"
            }`}
          >
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">
              {illustratorCount}
            </div>
            <div className="mt-0.5 text-[11px] sm:text-xs font-semibold text-[var(--text-primary)]">
              Illustrator Series
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Creative &amp; Vector
            </div>
          </button>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1519] text-white dark:bg-[#0F241C] border border-[#1E3D31] flex flex-col justify-between">
            <div className="inline-flex items-center gap-1 text-[10px] font-mono-code text-[#C8F550]">
              <Sparkles className="w-3 h-3" /> INSTANT
            </div>
            <div>
              <div className="font-display font-extrabold text-sm sm:text-base">
                DOCX + PDF
              </div>
              <div className="text-[11px] text-white/75">Direct Download</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="studio-card rounded-2xl p-3 sm:p-4 mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="Search by volume (e.g. Vol 14), Executive, Minimalist..."
              className="w-full pl-10 pr-9 py-2.5 rounded-lg text-sm bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyFavorites((v) => !v)}
              className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                onlyFavorites
                  ? "bg-[var(--accent-primary)] text-[var(--accent-on-primary)] border-[var(--accent-primary)]"
                  : "bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-current" : ""}`} />
              Saved ({favoriteIds.length})
            </button>

            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-mono-code bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {filtered.length} shown
            </div>
          </div>
        </div>

        {/* Architectural Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setVisibleCount(24);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                category === cat
                  ? "bg-[var(--accent-primary)] text-[var(--accent-on-primary)] border-[var(--accent-primary)]"
                  : "bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat === "All" ? `All ${ALL_TEMPLATES.length}` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {displayed.length === 0 ? (
        <div className="studio-card rounded-2xl p-12 text-center">
          <p className="font-display font-bold text-lg text-[var(--text-primary)]">
            No matching templates found
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Try clearing your search or switching back to All 103 editions.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
              setSeries("All");
              setOnlyFavorites(false);
            }}
            className="mt-4 px-5 py-2.5 rounded-lg text-xs font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {displayed.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={(t) => setPreviewId(t.id)}
              />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 24)}
                className="px-7 py-3 rounded-full text-sm font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] shadow-md transition-colors cursor-pointer"
              >
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      <TemplatePreviewModal
        template={activePreview}
        onClose={() => setPreviewId(null)}
        onPrev={
          filtered.length > 1
            ? () =>
                setPreviewId(
                  filtered[(previewIdx - 1 + filtered.length) % filtered.length].id
                )
            : undefined
        }
        onNext={
          filtered.length > 1
            ? () => setPreviewId(filtered[(previewIdx + 1) % filtered.length].id)
            : undefined
        }
      />
    </div>
  );
}

export default function TemplatesGalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-[var(--text-secondary)]">
          Loading 103 CV Templates...
        </div>
      }
    >
      <TemplatesGalleryContent />
    </Suspense>
  );
}
