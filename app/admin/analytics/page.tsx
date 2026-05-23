"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  ClipboardList,
  RefreshCcw,
  ShoppingCart,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/products";
import { getSupabaseOrders } from "@/lib/supabaseOrders";

type DbOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  total: number;
  status: string;
  created_at: string;
};

export default function AdminAnalyticsPage() {
  const { lang, dark } = useApp();

  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const data = await getSupabaseOrders();
    setOrders(data as DbOrder[]);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSales = orders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const newOrders = orders.filter((o) => o.status === "yangi").length;
    const deliveredOrders = orders.filter((o) => o.status === "yetkazildi").length;
    const cancelledOrders = orders.filter((o) => o.status === "bekor").length;

    const averageCheck =
      totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    return {
      totalOrders,
      totalSales,
      newOrders,
      deliveredOrders,
      cancelledOrders,
      averageCheck,
    };
  }, [orders]);

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
      icon: ShoppingCart,
      titleUz: "Jami buyurtmalar",
      titleRu: "Всего заказов",
      value: stats.totalOrders,
    },
    {
      icon: BarChart3,
      titleUz: "Jami savdo",
      titleRu: "Общие продажи",
      value: formatPrice(stats.totalSales),
    },
    {
      icon: ClipboardList,
      titleUz: "Yangi buyurtmalar",
      titleRu: "Новые заказы",
      value: stats.newOrders,
    },
    {
      icon: CheckCircle,
      titleUz: "Yetkazilgan",
      titleRu: "Доставлено",
      value: stats.deliveredOrders,
    },
    {
      icon: XCircle,
      titleUz: "Bekor qilingan",
      titleRu: "Отменено",
      value: stats.cancelledOrders,
    },
    {
      icon: BarChart3,
      titleUz: "O‘rtacha chek",
      titleRu: "Средний чек",
      value: formatPrice(stats.averageCheck),
    },
  ];

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1440px] px-5 py-8">
          <Link
            href="/admin"
            className="mb-6 inline-flex items-center gap-2 font-bold text-orange-500"
          >
            <ArrowLeft size={18} />
            {lang === "uz" ? "Admin panelga qaytish" : "Назад в админ панель"}
          </Link>

          <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-orange-500" size={36} />
                  <h1 className="text-4xl font-black md:text-6xl">
                    {lang === "uz" ? "Analytics" : "Аналитика"}
                  </h1>
                </div>

                <p className={`mt-4 text-lg font-medium ${theme.soft}`}>
                  {lang === "uz"
                    ? "Real Supabase orderlar bo‘yicha statistika."
                    : "Статистика по реальным заказам из Supabase."}
                </p>
              </div>

              <button
                onClick={loadOrders}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 font-black ${theme.input}`}
              >
                <RefreshCcw size={18} />
                {lang === "uz" ? "Yangilash" : "Обновить"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className={`mt-6 rounded-[32px] border p-10 text-center ${theme.card}`}>
              <div className="text-2xl font-black text-orange-500">
                Loading...
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.titleUz}
                    className={`rounded-[32px] border p-6 ${theme.card}`}
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                      <Icon size={32} />
                    </div>

                    <div className={`text-sm font-black ${theme.soft}`}>
                      {lang === "uz" ? card.titleUz : card.titleRu}
                    </div>

                    <div className="mt-2 text-3xl font-black">
                      {card.value}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </AdminGuard>
  );
}