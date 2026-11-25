"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ThemeMode = "light" | "dark";
export type ToastVariant = "success" | "info" | "error";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: (e?: React.MouseEvent) => void;
}

interface AppContextValue {
  favoriteIds: string[];
  toggleFavorite: (templateId: string, label?: string) => void;
  notifyDownload: (title: string, format: "PDF" | "DOCX") => void;
  toast: (title: string, opts?: { description?: string; variant?: ToastVariant }) => void;
}

interface RippleWave {
  id: number;
  x: number;
  y: number;
  toDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const AppContext = createContext<AppContextValue | null>(null);

const THEME_KEY = "rf_theme_v3";
const FAV_KEY = "rf_favorites_v3";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [ripple, setRipple] = useState<RippleWave | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, opts?: { description?: string; variant?: ToastVariant }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const variant: ToastVariant = opts?.variant || "success";
      setToasts((prev) => [
        ...prev.slice(-2),
        { id, title, description: opts?.description, variant },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }
      const savedFavs = localStorage.getItem(FAV_KEY);
      if (savedFavs) setFavoriteIds(JSON.parse(savedFavs));
    } catch {}
  }, []);

  // 0ms instant DOM class flip + pure GPU transform/opacity ripple wave (zero React card re-renders!)
  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const next: ThemeMode = isCurrentlyDark ? "light" : "dark";

    // Instant synchronous DOM switch — zero capture delay
    document.documentElement.classList.toggle("dark", next === "dark");
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}

    // Respect prefers-reduced-motion before firing radial pulse wave
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Fire lightweight GPU radial wave from the exact button coordinates
    const x = e?.clientX ?? (typeof window !== "undefined" ? window.innerWidth - 48 : 0);
    const y = e?.clientY ?? 32;
    const waveId = Date.now();
    setRipple({ id: waveId, x, y, toDark: next === "dark" });
    setTimeout(() => {
      setRipple((curr) => (curr?.id === waveId ? null : curr));
    }, 480);
  }, []);

  const toggleFavorite = useCallback(
    (templateId: string, label?: string) => {
      setFavoriteIds((prev) => {
        const exists = prev.includes(templateId);
        const next = exists
          ? prev.filter((id) => id !== templateId)
          : [templateId, ...prev];
        try {
          localStorage.setItem(FAV_KEY, JSON.stringify(next));
        } catch {}
        toast(exists ? "Removed from Favorites" : "Saved to Favorites", {
          description: label || "Bookmark updated.",
          variant: exists ? "info" : "success",
        });
        return next;
      });
    },
    [toast]
  );

  const notifyDownload = useCallback(
    (title: string, format: "PDF" | "DOCX") => {
      toast(`${format === "DOCX" ? "Word (.docx)" : "Print PDF"} Downloading`, {
        description: title,
        variant: "success",
      });
    },
    [toast]
  );

  const themeValue = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  const appValue = useMemo(
    () => ({ favoriteIds, toggleFavorite, notifyDownload, toast }),
    [favoriteIds, toggleFavorite, notifyDownload, toast]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <AppContext.Provider value={appValue}>
        {children}

        {/* Lightweight GPU Radial Pulse Wave on Theme Switch (0ms lag) */}
        <AnimatePresence>
          {ripple && (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.42 }}
              animate={{ scale: 18, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
              style={{
                left: ripple.x - 80,
                top: ripple.y - 80,
                width: 160,
                height: 160,
                background: ripple.toDark
                  ? "radial-gradient(circle, rgba(200,245,80,0.45) 0%, rgba(16,124,65,0.28) 55%, transparent 75%)"
                  : "radial-gradient(circle, rgba(16,124,65,0.35) 0%, rgba(232,247,239,0.5) 55%, transparent 75%)",
              }}
              className="pointer-events-none fixed z-[999] rounded-full will-change-transform"
            />
          )}
        </AnimatePresence>

        {/* Sonner-grade Animated Toast Stack */}
        <div
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-[350px] pointer-events-none"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => {
              const Icon =
                t.variant === "error"
                  ? AlertCircle
                  : t.variant === "info"
                  ? Info
                  : CheckCircle2;

              const iconStyles =
                t.variant === "error"
                  ? "bg-rose-500/15 text-rose-500"
                  : t.variant === "info"
                  ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                  : "bg-[var(--accent-tint)] text-[var(--accent-primary)]";

              const barColor =
                t.variant === "error"
                  ? "bg-rose-500"
                  : t.variant === "info"
                  ? "bg-sky-500"
                  : "bg-[var(--accent-primary)]";

              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className="pointer-events-auto relative overflow-hidden rounded-2xl bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl px-3.5 py-3 flex items-start gap-3"
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconStyles}`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-display font-bold text-xs text-[var(--text-primary)] leading-snug">
                      {t.title}
                    </div>
                    {t.description && (
                      <div className="mt-0.5 text-[11px] text-[var(--text-secondary)] leading-snug truncate">
                        {t.description}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Dismiss notification"
                    onClick={() => dismissToast(t.id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 3.2, ease: "linear" }}
                    style={{ transformOrigin: "left center" }}
                    className={`absolute bottom-0 inset-x-0 h-[2.5px] opacity-80 ${barColor}`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside AppProvider");
  return ctx;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
