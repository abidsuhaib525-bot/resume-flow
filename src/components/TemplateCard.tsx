"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Eye, Heart, FileText } from "lucide-react";
import { TemplateItem } from "@/types/resume";
import { useApp } from "@/lib/store";

interface TemplateCardProps {
  template: TemplateItem;
  onPreview: (template: TemplateItem) => void;
}

export const TemplateCard = React.memo(function TemplateCard({
  template,
  onPreview,
}: TemplateCardProps) {
  const { favoriteIds, toggleFavorite, notifyDownload } = useApp();
  const isFav = favoriteIds.includes(template.id);

  const handleDownload = (e: React.MouseEvent, format: "pdf" | "docx") => {
    e.stopPropagation();
    notifyDownload(template.title, format.toUpperCase() as "PDF" | "DOCX");
    window.location.href = `/api/download/${template.id}?format=${format}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      whileHover={{ y: -4 }}
      className="group studio-card rounded-2xl overflow-hidden flex flex-col hover:border-[var(--accent-primary)]/45"
    >
      {/* A4 Stationery Stage */}
      <div
        onClick={() => onPreview(template)}
        className="relative aspect-[1/1.34] bg-[var(--bg-muted)] dark:bg-[#0B1D16] p-3.5 sm:p-4 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {/* Format pills top-left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1">
          {template.hasDocx && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-code font-semibold bg-white/95 text-[#0B1519] dark:bg-[#081611]/90 dark:text-[#C8F550] border border-black/8 dark:border-[#C8F550]/30 shadow-xs">
              DOCX
            </span>
          )}
          {template.hasPdf && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-code font-semibold bg-white/95 text-[#0B1519] dark:bg-[#081611]/90 dark:text-white border border-black/8 dark:border-white/15 shadow-xs">
              PDF
            </span>
          )}
        </div>

        {/* Favorite Heart Button top-right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(template.id, template.shortTitle);
          }}
          aria-label="Save to favorites"
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm border ${
            isFav
              ? "bg-[#107C41] text-white border-[#107C41] dark:bg-[#C8F550] dark:text-[#081611] dark:border-[#C8F550] scale-105"
              : "bg-white/92 text-[#526066] border-black/8 hover:text-[#107C41] dark:bg-[#081611]/85 dark:text-white/75 dark:border-white/15 dark:hover:text-[#C8F550]"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Real Rendered A4 PDF Thumbnail */}
        <div className="w-full h-full rounded-[6px] overflow-hidden bg-white a4-sheet-shadow transition-transform duration-300 group-hover:scale-[1.03]">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.title}
              loading="lazy"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
              <FileText className="w-8 h-8 mb-2" />
              <span className="text-xs font-medium">{template.title}</span>
            </div>
          )}
        </div>

        {/* Hover Quick-Preview Overlay */}
        <div className="hidden sm:flex absolute inset-x-3 bottom-3 z-10 items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Full CV
          </button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-3.5 flex flex-col gap-2.5 flex-1 justify-between">
        <div>
          <Link
            href={`/templates/${template.id}`}
            className="block font-display font-bold text-sm text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors truncate"
          >
            {template.title}
          </Link>
          <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span>{template.category}</span>
            <span className="font-mono-code text-[10px] opacity-80">
              {template.series}
            </span>
          </div>
        </div>

        {/* Direct Word (.docx) & PDF Download Bar (40px touch-friendly height) */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-1.5">
          {template.hasDocx && (
            <button
              type="button"
              onClick={(e) => handleDownload(e, "docx")}
              className="flex-1 min-h-[38px] inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              Word
            </button>
          )}
          {template.hasPdf && (
            <button
              type="button"
              onClick={(e) => handleDownload(e, "pdf")}
              className="flex-1 min-h-[38px] inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-tint)]/50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              PDF
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});
