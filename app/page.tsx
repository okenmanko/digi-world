"use client";

import Link from "next/link";

import {
  BarChart3,
  ClipboardList,
  FolderTree,
  Lock,
  LogOut,
  Package,
  RefreshCcw,
  ShoppingCart,
  Users,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";

export default function AdminPage() {
  const { dark, lang } = useApp();

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const cards = [
    {
      href: "/admin/orders",
      icon: ClipboardList,
      title: lang === "uz" ? "Buyurtmalar" : "Заказы",
      desc: lang === "uz" ? "Klient buyurtmalari" : "Заказы клиентов",
    },
    {
      href: "/admin/products",
      icon: Package,
      title: lang === "uz" ? "Mahsulotlar" : "Товары",
      desc: lang === "uz" ? "Mahsulot qo‘shish va tahrirlash" : "Добавление и редактирование товаров",
    },
    {
      href: "/admin/categories",
      icon: FolderTree,
      title: lang === "uz" ? "Kategoriyalar" : "Категории",
      desc: lang === "uz" ? "Kategoriya qo‘shish va tahrirlash" : "Добавление и редактирование категорий",
    },
    {
      href: "/admin/moysklad",
      icon: RefreshCcw,
      title: "MoySklad Sync",
      desc: lang === "uz" ? "MoySklad import" : "Импорт MoySklad",
    },
    {
      href: "/catalog",
      icon: ShoppingCart,
      title: lang === "uz" ? "Sayt katalogi" : "Каталог",
      desc: lang === "uz" ? "Saytda ko‘rish" : "Посмотреть сайт",
    },
  ];

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1440px] px-5 py-7">
          <div className={`rounded-[34px] border p-6 md:p-8 ${theme.card}`}>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
                <Lock size={34} />
              </div>

              <div>
                <h1 className="text-4xl font-black md:text-6xl">
                  Admin Panel
                </h1>

                <p className={`mt-2 text-lg font-medium ${theme.soft}`}>
                  Digi World Control Center
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`group rounded-[30px] border p-6 transition hover:-translate-y-1 hover:border-orange-500 ${theme.card}`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
                    <Icon size={30} />
                  </div>

                  <h2 className="mt-6 text-2xl font-black">
                    {card.title}
                  </h2>

                  <p className={`mt-2 text-base font-medium ${theme.soft}`}>
                    {card.desc}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className={`mt-7 rounded-[34px] border p-6 ${theme.card}`}>
            <div className="flex items-center gap-3">
              <BarChart3 className="text-orange-500" size={30} />

              <h2 className="text-3xl font-black">
                {lang === "uz" ? "Statistika" : "Статистика"}
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className={`rounded-2xl border p-5 ${theme.input}`}>
                <div className={`text-sm font-black ${theme.soft}`}>
                  {lang === "uz" ? "Buyurtmalar" : "Заказы"}
                </div>
                <div className="mt-2 text-4xl font-black text-orange-500">
                  24
                </div>
              </div>

              <div className={`rounded-2xl border p-5 ${theme.input}`}>
                <div className={`text-sm font-black ${theme.soft}`}>
                  {lang === "uz" ? "Mahsulotlar" : "Товары"}
                </div>
                <div className="mt-2 text-4xl font-black text-orange-500">
                  100+
                </div>
              </div>

              <div className={`rounded-2xl border p-5 ${theme.input}`}>
                <div className={`text-sm font-black ${theme.soft}`}>
                  {lang === "uz" ? "Kategoriyalar" : "Категории"}
                </div>
                <div className="mt-2 text-4xl font-black text-orange-500">
                  6+
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-7 rounded-[34px] border p-6 ${theme.card}`}>
            <div className="flex items-center gap-3">
              <Users className="text-orange-500" size={28} />

              <h2 className="text-3xl font-black">
                Digi World
              </h2>
            </div>

            <p className={`mt-3 max-w-3xl text-lg leading-relaxed ${theme.soft}`}>
              Admin panel: buyurtmalar, mahsulotlar, kategoriyalar va MoySklad sync.
            </p>

            <button className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500 px-5 py-4 font-black text-red-500">
              <LogOut size={20} />
              {lang === "uz" ? "Chiqish" : "Выйти"}
            </button>
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}