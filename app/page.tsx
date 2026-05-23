"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ClipboardList,
  CreditCard,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";

export default function HomePage() {
  const { lang, dark } = useApp();

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
    input: dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white",
  };

  const categories = [
    {
      titleUz: "Televizorlar",
      titleRu: "Телевизоры",
      emoji: "📺",
      href: "/catalog/tv",
    },
    {
      titleUz: "Maishiy texnika",
      titleRu: "Бытовая техника",
      emoji: "🏠",
      href: "/catalog/home-appliances",
    },
    {
      titleUz: "Smartfonlar",
      titleRu: "Смартфоны",
      emoji: "📱",
      href: "/catalog/smartphones",
    },
    {
      titleUz: "Mikroto‘lqinli pechlar",
      titleRu: "Микроволновки",
      emoji: "🍽️",
      href: "/catalog/microwave",
    },
  ];

  const advantages = [
    {
      icon: ShieldCheck,
      titleUz: "Kafolat bilan",
      titleRu: "С гарантией",
      textUz: "Texnikalar ishonchli va kafolat asosida taqdim etiladi.",
      textRu: "Техника предоставляется с гарантией и проверенным качеством.",
    },
    {
      icon: Truck,
      titleUz: "Tez yetkazib berish",
      titleRu: "Быстрая доставка",
      textUz: "Buyurtmalar tez va qulay tarzda yetkazib beriladi.",
      textRu: "Заказы доставляются быстро и удобно.",
    },
    {
      icon: CreditCard,
      titleUz: "Qulay to‘lov",
      titleRu: "Удобная оплата",
      textUz: "Naqd, karta va bo‘lib to‘lash imkoniyati.",
      textRu: "Наличные, карта и рассрочка.",
    },
  ];

  const stats = [
    {
      value: "200+",
      labelUz: "tashkilotga xizmat",
      labelRu: "организаций обслужено",
    },
    {
      value: "24/7",
      labelUz: "online katalog",
      labelRu: "онлайн каталог",
    },
    {
      value: "100%",
      labelUz: "rasmiy hujjatlar",
      labelRu: "официальные документы",
    },
  ];

  return (
    <main className={`min-h-screen overflow-hidden ${theme.page}`}>
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            className={`relative overflow-hidden rounded-[42px] border p-7 md:p-10 lg:p-12 ${theme.card}`}
          >
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
                <Sparkles size={18} />
                {lang === "uz"
                  ? "Digi World — premium texnika do‘koni"
                  : "Digi World — магазин техники"}
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl">
                {lang === "uz"
                  ? "Uy va biznes uchun ishonchli texnika"
                  : "Надёжная техника для дома и бизнеса"}
              </h1>

              <p className={`mt-7 max-w-2xl text-lg font-medium leading-relaxed md:text-xl ${theme.soft}`}>
                {lang === "uz"
                  ? "Digi World’da televizorlar, maishiy texnika va elektronika: kafolat, tez yetkazib berish va qulay buyurtma."
                  : "В Digi World — телевизоры, бытовая техника и электроника: гарантия, быстрая доставка и удобное оформление заказа."}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20"
                >
                  {lang === "uz" ? "Katalogga o‘tish" : "Перейти в каталог"}
                  <ArrowRight size={21} />
                </Link>

                <Link
                  href="/admin"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-7 py-4 text-lg font-black ${theme.input}`}
                >
                  <BarChart3 size={21} />
                  Admin panel
                </Link>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.value}
                    className={`rounded-[26px] border p-5 ${theme.input}`}
                  >
                    <div className="text-3xl font-black text-orange-500">
                      {item.value}
                    </div>

                    <div className={`mt-1 text-sm font-bold ${theme.soft}`}>
                      {lang === "uz" ? item.labelUz : item.labelRu}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`rounded-[42px] border p-6 ${theme.card}`}>
            <div className="flex min-h-[520px] flex-col justify-between overflow-hidden rounded-[34px] bg-gradient-to-br from-orange-500 via-red-500 to-zinc-950 p-7 text-white">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
                  <BadgeCheck size={18} />
                  {lang === "uz" ? "Rasmiy va ishonchli" : "Официально и надёжно"}
                </div>

                <h2 className="mt-7 text-4xl font-black leading-tight md:text-5xl">
                  {lang === "uz"
                    ? "Buyurtma, to‘lov va yetkazib berish — hammasi bir joyda"
                    : "Заказ, оплата и доставка — всё в одном месте"}
                </h2>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    icon: ShoppingBag,
                    textUz: "Online katalog",
                    textRu: "Онлайн каталог",
                  },
                  {
                    icon: PackageCheck,
                    textUz: "Ombor va mahsulotlar",
                    textRu: "Склад и товары",
                  },
                  {
                    icon: ClipboardList,
                    textUz: "Buyurtmalar nazorati",
                    textRu: "Контроль заказов",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.textUz}
                      className="flex items-center gap-3 rounded-3xl bg-white/15 p-4 font-black backdrop-blur"
                    >
                      <Icon size={24} />
                      {lang === "uz" ? item.textUz : item.textRu}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black md:text-5xl">
                {lang === "uz" ? "Kategoriyalar" : "Категории"}
              </h2>

              <p className={`mt-2 font-medium ${theme.soft}`}>
                {lang === "uz"
                  ? "Kerakli texnikani tez toping."
                  : "Быстро найдите нужную технику."}
              </p>
            </div>

            <Link
              href="/catalog"
              className="font-black text-orange-500"
            >
              {lang === "uz" ? "Barcha mahsulotlar →" : "Все товары →"}
            </Link>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className={`group rounded-[32px] border p-6 transition hover:-translate-y-1 hover:border-orange-500 ${theme.card}`}
              >
                <div className="text-6xl">{category.emoji}</div>

                <h3 className="mt-5 text-2xl font-black">
                  {lang === "uz" ? category.titleUz : category.titleRu}
                </h3>

                <div className="mt-5 inline-flex items-center gap-2 font-black text-orange-500">
                  {lang === "uz" ? "Ko‘rish" : "Открыть"}
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {advantages.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.titleUz}
                className={`rounded-[32px] border p-6 ${theme.card}`}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                  <Icon size={28} />
                </div>

                <h3 className="text-2xl font-black">
                  {lang === "uz" ? item.titleUz : item.titleRu}
                </h3>

                <p className={`mt-3 font-medium leading-relaxed ${theme.soft}`}>
                  {lang === "uz" ? item.textUz : item.textRu}
                </p>
              </div>
            );
          })}
        </section>
      </section>
    </main>
  );
}