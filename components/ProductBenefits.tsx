"use client";

import {
  BadgeCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useApp } from "@/context/AppContext";

export default function ProductBenefits() {
  const { lang, dark } = useApp();

  const theme = {
    card: dark
      ? "border-white/10 bg-white/[0.04]"
      : "border-black/10 bg-white",

    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const items = [
    {
      icon: ShieldCheck,
      titleUz: "Rasmiy kafolat",
      titleRu: "Официальная гарантия",

      textUz:
        "Mahsulotlar sifat nazoratidan o‘tgan va kafolat bilan beriladi.",

      textRu:
        "Товары проходят контроль качества и предоставляются с гарантией.",
    },

    {
      icon: Truck,
      titleUz: "Tez yetkazib berish",
      titleRu: "Быстрая доставка",

      textUz:
        "Toshkent va viloyatlarga tezkor yetkazib berish xizmati.",

      textRu:
        "Быстрая доставка по Ташкенту и регионам.",
    },

    {
      icon: BadgeCheck,
      titleUz: "Ishonchli servis",
      titleRu: "Надёжный сервис",

      textUz:
        "Digi World mijozlari uchun professional yordam va support.",

      textRu:
        "Профессиональная поддержка клиентов Digi World.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.titleUz}
            className={`rounded-[28px] border p-5 ${theme.card}`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Icon size={28} />
            </div>

            <h3 className="mt-5 text-xl font-black">
              {lang === "uz"
                ? item.titleUz
                : item.titleRu}
            </h3>

            <p className={`mt-3 text-sm font-medium leading-relaxed ${theme.soft}`}>
              {lang === "uz"
                ? item.textUz
                : item.textRu}
            </p>
          </div>
        );
      })}
    </div>
  );
}