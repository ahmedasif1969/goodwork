import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const title = "Goodwork Digital — Websites, Software & AI Automation";
const description =
  "Modern websites, custom web applications, and practical AI automation. Goodwork Digital builds digital solutions around your business.";
export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Goodwork Digital",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
