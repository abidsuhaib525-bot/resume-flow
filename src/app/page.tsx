"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileText,
  Layers,
  PenTool,
} from "lucide-react";
import templatesData from "@/data/templates.json";
import { TemplateItem } from "@/types/resume";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreviewModal } from "@/components/TemplatePreviewModal";

const ALL_TEMPLATES = templatesData as TemplateItem[];
const FEATURED_TEMPLATES = ALL_TEMPLATES.slice(0, 8);
const INDESIGN_SAMPLES = ALL_TEMPLATES.filter((t) => t.series === "InDesign").slice(0, 3);
const ILLUSTRATOR_SAMPLES = ALL_TEMPLATES.filter((t) => t.series === "Illustrator").slice(0, 3);

const FAQ_ITEMS = [
  {
    q: "Are all 103 CV templates free to download in Word (.docx) and PDF?",
    a: "Yes. Every template in the ResumeFlow archive includes both an editable Microsoft Word (.docx) file and a 300 DPI Print PDF that you can download directly with zero sign-up.",
  },
  {
    q: "Can I edit the Word (.docx) CV templates in Microsoft Word or Google Docs?",
    a: "Yes. Download any .docx template and open it directly in Microsoft Word, Google Docs, or LibreOffice Writer to replace the placeholder text, contact details, and profile photo while keeping the designer layout.",
  },
  {
    q: "What paper size and resolution are these CV templates formatted for?",
    a: "All 103 editions are typeset for standard international DIN A4 paper (210 × 297 mm) with clean margins and print-ready 300 DPI typography.",
  },
  {
    q: "What is the difference between the InDesign Series and Illustrator Series?",
    a: "The 57 InDesign Series templates emphasize multi-column editorial grids and corporate hierarchy, while the 46 Illustrator Series templates feature crisp vector accents suited for creative, product, and tech roles. Both series include ready-to-edit Word (.docx) and PDF versions.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HomePage() {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredFeatured =
    activeCategory === "All"
      ? FEATURED_TEMPLATES
      : ALL_TEMPLATES.filter((t) => t.category === activeCategory).slice(0, 8);

  const openPreview = (template: TemplateItem) => {
    const idx = ALL_TEMPLATES.findIndex((t) => t.id === template.id);
    setPreviewIndex(idx >= 0 ? idx : 0);
  };

  const activePreview =
    previewIndex !== null ? ALL_TEMPLATES[previewIndex] : null;

  return (
    <div className="relative overflow-hidden">
      {/* 1. CLEAN ARCHITECTURAL SPLIT HERO (Zero eyebrow pills, zero fake macOS dots) */}
      <section className="hero-silk-bg relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-6 space-y-6"
            >
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[62px] leading-[1.04] tracking-[-0.035em] text-[var(--text-primary)]">
                103 designer CVs, ready in{" "}
                <span className="text-[var(--accent-primary)]">Word &amp; PDF.</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Every resume in this archive is typeset in Adobe InDesign or
                Illustrator and exported cleanly to editable Microsoft Word
                (`.docx`) and 300 DPI Print PDF. Preview full A4 sheets and
                download immediately.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  href="/templates"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] shadow-lg shadow-[#107C41]/20 dark:shadow-[#C8F550]/15 transition-colors active:scale-[0.98]"
                >
                  Browse 103 Templates
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => openPreview(ALL_TEMPLATES[0])}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[var(--accent-primary)]" />
                  Inspect Featured CV
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
                  57 InDesign Editions
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
                  46 Illustrator Editions
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
                  DIN A4 · Direct Download
                </span>
              </div>
            </motion.div>

            {/* Right Column: Real Layered A4 Stationery Desk (No decorative chrome!) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl studio-card p-5 sm:p-7 bg-[var(--bg-drafting)]/80">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Primary Front A4 Sheet */}
                  <button
                    type="button"
                    onClick={() => openPreview(ALL_TEMPLATES[0])}
                    className="col-span-7 text-left group/sheet cursor-pointer rounded-md overflow-hidden bg-white a4-sheet-shadow transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[1/1.38] w-full overflow-hidden">
                      {ALL_TEMPLATES[0]?.thumbnail && (
                        <img
                          src={ALL_TEMPLATES[0].thumbnail}
                          alt={ALL_TEMPLATES[0].title}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/sheet:scale-[1.02]"
                        />
                      )}
                    </div>
                  </button>

                  {/* Secondary Offset Sheet + Real Archive Specs */}
                  <div className="col-span-5 flex flex-col gap-3.5">
                    <button
                      type="button"
                      onClick={() => openPreview(ALL_TEMPLATES[7])}
                      className="text-left group/sheet2 cursor-pointer rounded-md overflow-hidden bg-white a4-sheet-shadow transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="aspect-[1/1.34] w-full overflow-hidden">
                        {ALL_TEMPLATES[7]?.thumbnail && (
                          <img
                            src={ALL_TEMPLATES[7].thumbnail}
                            alt={ALL_TEMPLATES[7].title}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/sheet2:scale-[1.02]"
                          />
                        )}
                      </div>
                    </button>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                      <div>
                        <div className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                          103 / 103 VERIFIED
                        </div>
                        <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                          Word .DOCX + PDF
                        </div>
                      </div>
                      <FileText className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SELECTED EDITIONS GALLERY */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
                Selected CV{" "}
                <span className="text-[var(--accent-primary)]">editions.</span>
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Click any sheet to inspect full-size or download Word and PDF directly.
              </p>
            </div>

            {/* Sharp Architectural Category Tabs (Not pill soup) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {["All", "Executive", "Creative & Design", "Tech & Engineering", "Minimalist"].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                      activeCategory === cat
                        ? "bg-[var(--accent-primary)] text-[var(--accent-on-primary)] border-[var(--accent-primary)]"
                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredFeatured.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={openPreview}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-bold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              View All {ALL_TEMPLATES.length} CV Templates
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CONTENT-DRIVEN TWO ARCHIVES SHOWCASE (Replaces generic 4-step "How It Works") */}
      <section className="py-16 sm:py-20 border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              Two complete{" "}
              <span className="text-[var(--accent-primary)]">print archives.</span>
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Every edition in both series ships with ready-to-edit Microsoft Word
              and print-ready PDF files.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* InDesign Archive Card */}
            <div className="rounded-2xl p-6 sm:p-7 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex flex-col justify-between gap-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono-code text-xs font-bold text-[var(--accent-primary)]">
                    57 EDITIONS
                  </span>
                  <h3 className="mt-1 font-display font-extrabold text-2xl text-[var(--text-primary)]">
                    Adobe InDesign Series
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                    Structured baseline grids, executive typography, and
                    multi-color Word &amp; PDF variants built for corporate,
                    editorial, and leadership roles.
                  </p>
                </div>
                <Layers className="w-6 h-6 text-[var(--accent-primary)] shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {INDESIGN_SAMPLES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openPreview(t)}
                    className="aspect-[1/1.38] rounded-md overflow-hidden bg-white a4-sheet-shadow hover:-translate-y-1 transition-transform cursor-pointer"
                  >
                    {t.thumbnail && (
                      <img
                        src={t.thumbnail}
                        alt={t.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    )}
                  </button>
                ))}
              </div>

              <Link
                href="/templates?series=InDesign"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-primary)] hover:underline"
              >
                Browse all 57 InDesign CVs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Illustrator Archive Card */}
            <div className="rounded-2xl p-6 sm:p-7 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex flex-col justify-between gap-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono-code text-xs font-bold text-[var(--accent-primary)]">
                    46 EDITIONS
                  </span>
                  <h3 className="mt-1 font-display font-extrabold text-2xl text-[var(--text-primary)]">
                    Adobe Illustrator Series
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                    Crisp vector accents, modern creative layouts, and clean
                    visual hierarchy crafted for designers, engineers, and
                    product builders.
                  </p>
                </div>
                <PenTool className="w-6 h-6 text-[var(--accent-primary)] shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {ILLUSTRATOR_SAMPLES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openPreview(t)}
                    className="aspect-[1/1.38] rounded-md overflow-hidden bg-white a4-sheet-shadow hover:-translate-y-1 transition-transform cursor-pointer"
                  >
                    {t.thumbnail && (
                      <img
                        src={t.thumbnail}
                        alt={t.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    )}
                  </button>
                ))}
              </div>

              <Link
                href="/templates?series=Illustrator"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-primary)] hover:underline"
              >
                Browse all 46 Illustrator CVs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEO FAQ SECTION + FAQPage JSON-LD (People-Also-Ask & AI Search Rich Snippets) */}
      <section className="py-16 sm:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[var(--text-primary)] mb-8">
            Frequently asked questions about our{" "}
            <span className="text-[var(--accent-primary)]">free CV templates.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.q}
                className="studio-card rounded-xl p-5 space-y-2"
              >
                <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                  {item.q}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-2xl p-8 sm:p-14 text-center relative overflow-hidden studio-card hero-silk-bg">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[var(--text-primary)] max-w-2xl mx-auto">
            Pick your template.{" "}
            <span className="text-[var(--accent-primary)]">Download in seconds.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            103 verified editions with editable Microsoft Word (`.docx`) and 300
            DPI Print PDF files ready to go.
          </p>
          <div className="mt-7 flex items-center justify-center">
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] shadow-lg transition-colors"
            >
              Explore All 103 Templates
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2 font-display font-bold text-[var(--text-primary)]">
            <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
            RESUMEFLOW ARCHIVE
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[var(--text-primary)]">
              Home
            </Link>
            <Link href="/templates" className="hover:text-[var(--text-primary)]">
              103 Templates
            </Link>
            <Link href="/templates?favorites=1" className="hover:text-[var(--text-primary)]">
              Saved Favorites
            </Link>
          </div>
          <div className="font-mono-code text-[11px]">
            103 EDITIONS · WORD .DOCX &amp; PRINT PDF
          </div>
        </div>
      </footer>

      <TemplatePreviewModal
        template={activePreview}
        onClose={() => setPreviewIndex(null)}
        onPrev={() =>
          setPreviewIndex((i) =>
            i === null ? null : (i - 1 + ALL_TEMPLATES.length) % ALL_TEMPLATES.length
          )
        }
        onNext={() =>
          setPreviewIndex((i) =>
            i === null ? null : (i + 1) % ALL_TEMPLATES.length
          )
        }
      />
    </div>
  );
}
