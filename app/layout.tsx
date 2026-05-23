import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: {
    default: "Digi World — бытовая техника и электроника в Узбекистане",
    template: "%s | Digi World",
  },
  description:
    "Digi World — интернет-магазин бытовой техники и электроники. Телевизоры, техника для дома, аксессуары, гарантия и быстрая доставка по Узбекистану.",
  keywords: [
    "Digi World",
    "бытовая техника Узбекистан",
    "электроника Узбекистан",
    "купить телевизор",
    "интернет магазин техники",
    "maishiy texnika",
    "elektronika",
    "televizor sotib olish",
    "Uzum Market",
    "Tashkent electronics",
  ],
  authors: [{ name: "Digi World" }],
  creator: "Digi World",
  publisher: "Digi World",
  metadataBase: new URL("https://digiworld.uz"),
  openGraph: {
    title: "Digi World — бытовая техника и электроника",
    description:
      "Качественная бытовая техника и электроника с гарантией и доставкой по Узбекистану.",
    url: "https://digiworld.uz",
    siteName: "Digi World",
    locale: "ru_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digi World — бытовая техника и электроника",
    description:
      "Интернет-магазин техники Digi World: гарантия, качество и доставка.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}