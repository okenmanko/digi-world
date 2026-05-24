"use client";

import Link from "next/link";
import { CheckCircle2, Home, ShoppingBag } from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";

export default function SuccessPage() {
  const { lang, dark } = useApp();

  const orderId =
    typeof window !== "undefined"
      ? localStorage.getItem("digi_world_last_order_id")
      : "";

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
  };

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto flex min-h-[70vh] max-w-[820px] items-center justify-center px-5 py-6">
        <div className={`w-full rounded-[30px] border p-6 text-center md:p-9 ${theme.card}`}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <CheckCircle2 size={46} />
          </div>

          <h1 className="mx-auto mt-6 max-w-2xl text-3xl font-black leading-tight md:text-5xl">
            {lang === "uz" ? "Buyurtma qabul qilindi!" : "Заказ принят!"}
          </h1>

          <p className={`mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed ${theme.soft}`}>
            {lang === "uz"
              ? "Rahmat! Buyurtmangiz qabul qilindi. Tez orada operatorimiz siz bilan bog‘lanadi."
              : "Спасибо! Ваш заказ принят. Наш оператор скоро свяжется с вами."}
          </p>

          {orderId && (
            <div className={`mx-auto mt-6 max-w-[460px] rounded-[22px] border p-5 ${theme.input}`}>
              <div className={`text-xs font-black ${theme.soft}`}>
                {lang === "uz" ? "Buyurtma raqami" : "Номер заказа"}
              </div>

              <div className="mt-2 break-words text-xl font-black leading-snug text-orange-500 md:text-2xl">
                {orderId}
              </div>
            </div>
          )}

          <div className="mx-auto mt-7 grid max-w-[480px] gap-3 sm:grid-cols-2">
            <Link
              href="/catalog"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-5 py-3 text-base font-black text-white"
            >
              <ShoppingBag size={19} />
              {lang === "uz" ? "Katalog" : "Каталог"}
            </Link>

            <Link
              href="/"
              className={`flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-base font-black ${theme.input}`}
            >
              <Home size={19} />
              {lang === "uz" ? "Bosh sahifa" : "Главная"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}