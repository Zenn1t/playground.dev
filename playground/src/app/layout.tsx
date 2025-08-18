import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mark Reshetov – Backend Developer",
  description: "Portfolio of Mark Reshetov (mnx), backend developer focused on APIs, Stripe integrations, and scalable backend systems.",
  keywords: ["Mark Reshetov", "mnx", "backend developer", "FastAPI", "Stripe", "SQLAlchemy", "portfolio"],
  authors: [{ name: "Mark Reshetov", url: "https://..." }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
