import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Navbar, MobileBottomNav } from "@/components/Navbar";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://resumeflow-cv.netlify.app";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free CV Templates (103 Word .DOCX & PDF Downloads) — ResumeFlow",
    template: "%s | ResumeFlow Free CV Templates",
  },
  description:
    "Download 103 free professional CV templates in editable Microsoft Word (.docx) and 300 DPI Print PDF. Executive, Creative, Tech, Minimalist & Academic A4 resumes — no sign-up required.",
  keywords: [
    "free cv templates",
    "cv templates word download",
    "professional cv template pdf",
    "free resume templates docx",
    "modern cv template free download",
    "ats friendly cv templates",
    "executive resume template word",
    "indesign cv templates",
    "a4 cv format word free",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "ResumeFlow",
    title: "103 Free Professional CV Templates — Word (.docx) & PDF Download",
    description:
      "Browse and download 103 designer-crafted CV templates in editable Microsoft Word (.docx) and Print PDF. Instant download, zero login.",
    images: [
      {
        url: "/thumbnails/id-vol-01.webp",
        width: 620,
        height: 877,
        alt: "ResumeFlow Free Professional CV Templates Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "103 Free CV Templates — Word (.docx) & PDF Download | ResumeFlow",
    description:
      "Download 103 studio-crafted InDesign & Illustrator CV templates in editable Word (.docx) and Print PDF.",
    images: ["/thumbnails/id-vol-01.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ResumeFlow",
  url: SITE_URL,
  description:
    "Archive of 103 free professional CV templates downloadable in Microsoft Word (.docx) and Print PDF.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/templates?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${dmSans.variable} ${newsreader.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
        <AppProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <MobileBottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
