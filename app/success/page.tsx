"use client";

import Link from "next/link";
import { CheckCircle, ClipboardList, Home, ShoppingBag } from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";

export default function SuccessPage() {
  const { lang, dark } = useApp();

  const lastOrderId =
    typeof window !== "undefined"
      ? localStorage.getItem("digi_world_last_order_id")
      : "";

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
    input: dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white",
  };

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto flex min-h-[70vh] max-w-[900px] items-center justify-center px-5 py-10">
        <div className={`w-full rounded-[36px] border p-8 text-center md:p-14 ${theme.card}`}>
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <CheckCircle size={56} />
          </div>

          <h1 className="mt-8 text-4xl font-black md:text-6xl">
            {lang === "uz" ? "Buyurtma qabul qilindi!" : "Заказ принят!"}
          </h1>

          <p className={`mx-auto mt-5 max-w-xl text-lg font-medium leading-relaxed ${theme.soft}`}>
            {lang === "uz"
              ? "Buyurtmangiz admin panelga saqlandi. Tez orada siz bilan bog‘lanamiz."
              : "Ваш заказ сохранён в админ панели. Скоро мы с вами свяжемся."}
          </p>

          {lastOrderId && (
            <div className={`mx-auto mt-7 max-w-md rounded-2xl border p-5 ${theme.input}`}>
              <div className={`text-sm font-bold ${theme.soft}`}>
                {lang === "uz" ? "Buyurtma raqami" : "Номер заказа"}
              </div>

              <div className="mt-1 text-2xl font-black text-orange-500">
                {lastOrderId}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link
              href="/catalog"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-4 font-black text-white"
            >
              <ShoppingBag size={20} />
              {lang === "uz" ? "Katalog" : "Каталог"}
            </Link>

            <Link
              href="/"
              className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 font-black ${theme.input}`}
            >
              <Home size={20} />
              {lang === "uz" ? "Bosh sahifa" : "Главная"}
            </Link>

            <Link
              href="/admin/orders"
              className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 font-black ${theme.input}`}
            >
              <ClipboardList size={20} />
              {lang === "uz" ? "Admin orders" : "Заказы"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}