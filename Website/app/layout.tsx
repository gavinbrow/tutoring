import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Good Chemistry | Personal Chemistry Tutoring",
  description: "High school, AP, general and organic chemistry tutoring with Gavin Brown and Felix Campbell, chemistry PhD students at the University of Arkansas.",
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
