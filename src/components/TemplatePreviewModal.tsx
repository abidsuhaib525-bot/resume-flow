"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Heart,
  X,
} from "lucide-react";
import { TemplateItem } from "@/types/resume";
import { useApp } from "@/lib/store";

interface TemplatePreviewModalProps {
  template: TemplateItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function TemplatePreviewModal({
  template,
  onClose,
  onPrev,
  onNext,
}: TemplatePreviewModalProps) {
  const { favoriteIds, toggleFavorite, notifyDownload } = useApp();
  const [viewMode, setViewMode] = useState<"image" | "pdf">("image");

  // Lock background scroll & support Esc + Left/Right keyboard navigation
  useEffect(() => {
    if (!template) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && onPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [template, onClose, onPrev, onNext]);

  if (!template) return null;
  const isFav = favoriteIds.includes(template.id);

  const docxVariants = (template.variants || []).filter((v) => v.format === "docx");
  const pdfVariants = (template.variants || []).filter((v) => v.format === "pdf");

  const triggerDownload = (format: "pdf" | "docx", variantIdx = 0) => {
    notifyDownload(template.title, format.toUpperCase() as "PDF" | "DOCX");
    window.location.href = `/api/download/${template.id}?format=${format}&variant=${variantIdx}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl grid grid-cols-1 lg:grid-cols-12 max-h-[92vh]"
        >
          {/* Left: Full A4 Preview Stage */}
          <div className="lg:col-span-7 bg-[var(--bg-drafting)] p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[380px] max-h-[55vh] lg:max-h-[92vh] overflow-auto">
            {/* Top Bar: Sheet / PDF Toggle + Prev/Next Flip Controls */}
            <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-[var(--bg-surface)]/95 p-1 rounded-lg border border-[var(--border-subtle)] shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    viewMode === "image"
                      ? "bg-[var(--accent-primary)] text-[var(--accent-on-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Crisp Sheet
                </button>
                {template.hasPdf && (
                  <button
                    type="button"
                    onClick={() => setViewMode("pdf")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      viewMode === "pdf"
                        ? "bg-[var(--accent-primary)] text-[var(--accent-on-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Live PDF Viewer
                  </button>
                )}
              </div>

              {(onPrev || onNext) && (
                <div className="flex items-center gap-1 bg-[var(--bg-surface)]/95 p-1 rounded-lg border border-[var(--border-subtle)] shadow-xs">
                  <button
                    type="button"
                    aria-label="Previous template"
                    onClick={onPrev}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                    title="Previous (Left Arrow)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next template"
                    onClick={onNext}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                    title="Next (Right Arrow)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {viewMode === "pdf" && template.hasPdf ? (
              <iframe
                src={`/api/download/${template.id}?format=pdf&inline=1`}
                className="w-full h-[500px] lg:h-[680px] rounded-xl bg-white border border-black/10 mt-12"
                title={template.title}
              />
            ) : (
              <div className="w-full max-w-[450px] aspect-[1/1.414] bg-white rounded-md overflow-hidden a4-sheet-shadow mt-10 lg:mt-8">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="w-full h-full object-contain bg-white"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <FileText className="w-10 h-10" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Specs + Instant Word & PDF Downloads */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between gap-6 overflow-y-auto">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono-code font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                    {template.series.toUpperCase()} · VOL.{" "}
                    {String(template.volume).padStart(2, "0")}
                  </span>
                  <h2
                    id="preview-modal-title"
                    className="mt-2 font-display font-extrabold text-2xl text-[var(--text-primary)] tracking-tight"
                  >
                    {template.title}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close preview modal"
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                Print-ready DIN A4 CV template from the {template.series} archive.
                Open the Microsoft Word (`.docx`) file directly in Word or Google
                Docs with 100% original typography, or download the 300 DPI Print PDF.
              </p>

              {/* Spec Grid */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Category
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                    {template.category}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Formats
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-[var(--accent-primary)]">
                    {[template.hasDocx && "Word .DOCX", template.hasPdf && "Print PDF"]
                      .filter(Boolean)
                      .join(" + ")}
                  </div>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  Editable in Microsoft Word &amp; Google Docs (`.docx`)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  300 DPI vector-crisp Print PDF included
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  Use ← / → arrow keys to flip editions, Esc to close
                </li>
              </ul>

              {/* Extra Color Variants if present */}
              {(docxVariants.length > 1 || pdfVariants.length > 1) && (
                <div className="mt-5 p-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Color Variants Included
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {docxVariants.map((v, i) => (
                      <button
                        key={`d-${i}`}
                        type="button"
                        onClick={() => triggerDownload("docx", i)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-blue-500 text-[var(--text-primary)] cursor-pointer"
                      >
                        {v.label} (.docx)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Download Actions */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--border-subtle)]">
              {template.hasDocx && (
                <button
                  type="button"
                  onClick={() => triggerDownload("docx", 0)}
                  className="w-full py-3.5 px-5 rounded-full text-sm font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Editable Word (.docx)
                </button>
              )}

              {template.hasPdf && (
                <button
                  type="button"
                  onClick={() => triggerDownload("pdf", 0)}
                  className="w-full py-3 px-5 rounded-lg text-sm font-bold border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Print PDF
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(template.id, template.shortTitle)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isFav
                      ? "bg-[var(--accent-tint)] border-[var(--accent-primary)]/40 text-[var(--accent-primary)]"
                      : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                  {isFav ? "Saved in Favorites" : "Save to Favorites"}
                </button>
                {template.hasPdf && (
                  <a
                    href={`/api/download/${template.id}?format=pdf&inline=1`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3.5 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
