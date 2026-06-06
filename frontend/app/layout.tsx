import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text, Roboto } from "next/font/google";

import "./globals.css";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-caslon",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Manohiti | Sophisticated Care, Boldly Delivered",
  description:
    "A humanistic therapy practice. Finding balance isn't about reaching a destination; it's about making peace with where you are right now.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light ${libreCaslon.variable} ${roboto.variable} ${inter.variable}`}
    >
      <body className="font-body-md text-on-surface antialiased">{children}</body>
    </html>
  );
}
