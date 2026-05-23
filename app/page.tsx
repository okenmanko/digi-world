"use client";

import Link from "next/link";
import { ChevronRight, Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";

export default function Home() {
  const { lang, dark } = useApp();

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <div className={`rounded-[36px] border p-8 md:p-14 ${theme.card}`}>
          <div className="mb-6 inline-flex rounded-full bg-orange-500/10 px-5 py-2 text-sm font-black text-orange-500">
            {lang === "uz"
              ? "Digi World — ishonchli texnika do‘koni"
              : "Digi World — надёжный магазин техники"}
          </div>

          <h1 className="max-w-5xl text-4xl font-black leading-tight md:text-7xl">
            {lang === "uz"
              ? "Uy va ofis uchun premium texnika"
              : "Премиальная техника для дома и офиса"}
          </h1>

          <p className={`mt-6 max-w-3xl text-lg font-medium leading-relaxed md:text-xl ${theme.soft}`}>
            {lang === "uz"
              ? "Televizorlar, konditsionerlar, maishiy texnika va elektronika. Tez yetkazib berish, rasmiy kafolat va professional xizmat."
              : "Телевизоры, кондиционеры, бытовая техника и электроника. Быстрая доставка, официальная гарантия и профессиональный сервис."}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-8 py-4 font-black text-white"
            >
              {lang === "uz" ? "Mahsulotlarni ko‘rish" : "Смотреть товары"}
              <ChevronRight size={20} />
            </Link>

            <Link
              href="/cart"
              className={`inline-flex items-center justify-center rounded-2xl border px-8 py-4 font-black ${theme.card}`}
            >
              {lang === "uz" ? "Savatni ko‘rish" : "Открыть корзину"}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-5 px-5 pb-12 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Truck, uz: "Tez yetkazib berish", ru: "Быстрая доставка" },
          { icon: ShieldCheck, uz: "Rasmiy kafolat", ru: "Официальная гарантия" },
          { icon: CreditCard, uz: "Bo‘lib to‘lash", ru: "Рассрочка" },
          { icon: Headphones, uz: "Professional yordam", ru: "Поддержка" },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.uz} className={`rounded-[30px] border p-6 ${theme.card}`}>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <Icon size={28} />
              </div>

              <h3 className="text-xl font-black">
                {lang === "uz" ? item.uz : item.ru}
              </h3>
            </div>
          );
        })}
      </section>
    </main>
  );
}