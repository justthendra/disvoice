import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Changed from Geist
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans", // Use standard variable name
  display: "swap",
});

export const metadata: Metadata = {
  title: "Disvoice",
  description: "Universal Music Player Library for Discord.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
