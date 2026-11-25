import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full studio-card rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center bg-[var(--accent-tint)] text-[var(--accent-primary)]">
          <FileText className="w-6 h-6" />
        </div>
        <div className="font-mono-code text-xs font-bold text-[var(--accent-primary)]">
          ERROR 404
        </div>
        <h1 className="font-display font-extrabold text-2xl text-[var(--text-primary)]">
          Page not found
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          The page you requested doesn&apos;t exist. Browse all 103 print-ready CV
          templates instead.
        </p>
        <div className="pt-2">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to 103 Templates
          </Link>
        </div>
      </div>
    </div>
  );
}
