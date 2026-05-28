import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
