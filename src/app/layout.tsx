import type { Metadata } from "next";
import "./globals.css";

import { Press_Start_2P } from "next/font/google";
import { Onest } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "Вектор · Pixel Driver Game",
  description:
    "Пройди путь до Кибертрака Вектор и открой скидку до 5000 ₽ на обучение в автошколе «Вектор».",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`h-full antialiased ${onest.className}`}>
      <body className={`${onest.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
