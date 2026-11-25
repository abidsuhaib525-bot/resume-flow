import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Download, ExternalLink } from "lucide-react";
import templatesData from "@/data/templates.json";
import { TemplateItem } from "@/types/resume";

const ALL_TEMPLATES = templatesData as TemplateItem[];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://resumeflow.studio";

export function generateStaticParams() {
  return ALL_TEMPLATES.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const template = ALL_TEMPLATES.find((t) => t.id === id);
  if (!template) return { title: "Template Not Found" };

  const title = `${template.title} — Free ${template.category} CV Template (Word & PDF)`;
  const description = `Download ${template.title} free in editable Microsoft Word (.docx) and 300 DPI Print PDF. Clean DIN A4 ${template.category} resume from our ${template.series} archive.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/templates/${template.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/templates/${template.id}`,
      images: template.thumbnail
        ? [{ url: template.thumbnail, width: 620, height: 877, alt: template.title }]
        : undefined,
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = ALL_TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  const related = ALL_TEMPLATES.filter(
    (t) => t.id !== template.id && t.category === template.category
  ).slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${template.title} CV Template`,
    description: `Free ${template.category} CV template downloadable in Microsoft Word (.docx) and Print PDF.`,
    url: `${SITE_URL}/templates/${template.id}`,
    image: template.thumbnail ? `${SITE_URL}${template.thumbnail}` : undefined,
    encodingFormat: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf"],
    isAccessibleForFree: true,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Link
        href="/templates"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all 103 Free CV Templates
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Crisp Full A4 Preview */}
        <div className="lg:col-span-7 studio-card rounded-2xl p-5 sm:p-8 bg-[var(--bg-drafting)] flex justify-center">
          <div className="w-full max-w-[520px] aspect-[1/1.414] bg-white rounded-md overflow-hidden a4-sheet-shadow">
            {template.thumbnail && (
              <img
                src={template.thumbnail}
                alt={`${template.title} free CV template preview`}
                className="w-full h-full object-contain bg-white"
              />
            )}
          </div>
        </div>

        {/* Right: SEO Copy + Direct Word & PDF Downloads */}
        <div className="lg:col-span-5 studio-card rounded-2xl p-6 sm:p-7 space-y-6">
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono-code font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
              {template.series.toUpperCase()} SERIES · VOL.{" "}
              {String(template.volume).padStart(2, "0")}
            </span>
            <h1 className="mt-2.5 font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
              {template.title}
            </h1>
            <p className="mt-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
              Free {template.category.toLowerCase()} CV template ready for
              instant download in editable Microsoft Word (`.docx`) and 300 DPI
              Print PDF. Formatted for DIN A4 paper and clean ATS readability.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              100% editable in Microsoft Word &amp; Google Docs (`.docx`)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              300 DPI Print PDF included for instant reference
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              Free direct download — zero sign-up required
            </li>
          </ul>

          <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)]">
            {template.hasDocx && (
              <a
                href={`/api/download/${template.id}?format=docx`}
                className="w-full py-3.5 px-5 rounded-full text-sm font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Free Word (.docx)
              </a>
            )}
            {template.hasPdf && (
              <a
                href={`/api/download/${template.id}?format=pdf`}
                className="w-full py-3 px-5 rounded-lg text-sm font-bold border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Print PDF
              </a>
            )}
            {template.hasPdf && (
              <a
                href={`/api/download/${template.id}?format=pdf&inline=1`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Live PDF in New Tab
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Internal SEO Links: Related CV Templates */}
      {related.length > 0 && (
        <section className="space-y-5 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="font-display font-extrabold text-xl text-[var(--text-primary)]">
            More Free {template.category} CV Templates
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/templates/${item.id}`}
                className="studio-card rounded-xl p-3 hover:border-[var(--accent-primary)]/50 transition-colors flex flex-col gap-2.5"
              >
                <div className="aspect-[1/1.36] rounded-md overflow-hidden bg-white a4-sheet-shadow">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>
                <div className="font-display font-bold text-xs text-[var(--text-primary)] truncate">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
