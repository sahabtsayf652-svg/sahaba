import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AgentationGuard } from "@/components/AgentationGuard";
import { HappySeedsWatermark } from "@/components/HappySeedsWatermark";
import { WebsiteSchema, OrganizationSchema } from "./schema";
import jsonMetadata from "../metadata.json";
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
  ...jsonMetadata,
  verification: {
    google: "dEuy1pGW-zkGboku4Z5gjxbfgVcW5yJiE9xg97ZKb8E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <WebsiteSchema />
        <OrganizationSchema />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <HappySeedsWatermark />
        <AgentationGuard />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
