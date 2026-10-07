import type { Metadata } from "next";
import { company, siteUrl } from "@/lib/tutoring";
import "./globals.css";

const description = "One-on-one high school, AP, general and organic chemistry tutoring with Gavin Brown and Felix Campbell, chemistry PhD students at the University of Arkansas.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Chemistry Tutoring in Fayetteville, AR | ${company.name}`,
  description,
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_US",
    url: "/",
    title: `Chemistry Tutoring | ${company.name}`,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${company.name}: chemistry tutoring with Gavin Brown and Felix Campbell` }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
