"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Heart,
  Home,
  LayoutGrid,
  Moon,
  Sun,
} from "lucide-react";
import { useApp, useTheme } from "@/lib/store";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { favoriteIds } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/88 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#107C41] text-white dark:bg-[#C8F550] dark:text-[#081611] shadow-sm transition-transform group-hover:scale-105">
            <FileText className="w-4 h-4 stroke-[2.4]" />
          </span>
          <span className="font-display font-extrabold text-[17px] tracking-tight text-[var(--text-primary)]">
            RESUMEFLOW
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono-code font-semibold tracking-wider bg-[var(--accent-tint)] text-[var(--accent-primary)]">
            103 CVs
          </span>
        </Link>

        {/* Center Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 px-1.5 py-1 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] dark:bg-white dark:border-white/20 dark:shadow-lg">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-[#107C41] text-white shadow-sm dark:bg-[#081611] dark:text-[#C8F550]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:text-[#0B1519]/75 dark:hover:text-[#081611]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/templates"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname?.startsWith("/templates")
                ? "bg-[#107C41] text-white shadow-sm dark:bg-[#081611] dark:text-[#C8F550]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:text-[#0B1519]/75 dark:hover:text-[#081611]"
            }`}
          >
            Templates
            <span
              className={`text-[10px] font-mono-code px-1.5 rounded-full ${
                pathname?.startsWith("/templates")
                  ? "bg-white/20 text-white dark:bg-[#C8F550]/20 dark:text-[#C8F550]"
                  : "bg-black/5 dark:bg-black/10"
              }`}
            >
              103
            </span>
          </Link>
          <Link
            href="/templates?favorites=1"
            className="px-4 py-1.5 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:text-[#0B1519]/75 dark:hover:text-[#081611] transition-all flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-[var(--accent-primary)] dark:text-[#107C41]" />
            Saved
            {favoriteIds.length > 0 && (
              <span className="text-[10px] font-mono-code px-1.5 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] dark:bg-[#081611] dark:text-[#C8F550]">
                {favoriteIds.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Right Controls: Theme Switcher + Browse CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={(e) => toggleTheme(e)}
            aria-label="Toggle Light and Dark Mode"
            title={
              theme === "light"
                ? "Switch to Dark Forest Mode"
                : "Switch to Light Emerald Mode"
            }
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)] active:scale-90 transition-transform cursor-pointer overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "light" ? (
                <motion.span
                  key="moon"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <Moon className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <Sun className="w-4 h-4 text-[#C8F550]" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Browse 103 CVs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { favoriteIds } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-lg px-2 py-1.5 safe-area-bottom">
      <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-medium transition-all ${
            pathname === "/"
              ? "bg-[var(--accent-tint)] text-[var(--accent-primary)] font-semibold"
              : "text-[var(--text-secondary)]"
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </Link>
        <Link
          href="/templates"
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-medium transition-all ${
            pathname?.startsWith("/templates")
              ? "bg-[var(--accent-tint)] text-[var(--accent-primary)] font-semibold"
              : "text-[var(--text-secondary)]"
          }`}
        >
          <LayoutGrid className="w-4 h-4 mb-0.5" />
          <span>Templates</span>
        </Link>
        <Link
          href="/templates?favorites=1"
          className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-medium text-[var(--text-secondary)] transition-all"
        >
          <Heart className="w-4 h-4 mb-0.5" />
          <span>Saved ({favoriteIds.length})</span>
        </Link>
      </div>
    </nav>
  );
}
