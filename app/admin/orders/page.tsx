"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  Trash2,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/products";
import {
  deleteSupabaseOrder,
  getSupabaseOrders,
  updateSupabaseOrderStatus,
} from "@/lib/supabaseOrders";

type DbOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: {
    slug: string;
    name: string;
    price: number;
    qty: number;
  }[];
  total: number;
  status: string;
  created_at: string;
};

export default function AdminOrdersPage() {
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

  async function changeStatus(id: string, status: string) {
    await updateSupabaseOrderStatus(id, status);
    await loadOrders();
  }

  async function removeOrder(id: string) {
    const ok = confirm(
      lang === "uz" ? "Buyurtmani o‘chirasizmi?" : "Удалить заказ?"
    );

    if (!ok) return;

    await deleteSupabaseOrder(id);
    await loadOrders();
  }

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const statusLabels: Record<string, string> = {
    yangi: lang === "uz" ? "Yangi" : "Новый",
    jarayonda: lang === "uz" ? "Jarayonda" : "В работе",
    yetkazildi: lang === "uz" ? "Yetkazildi" : "Доставлен",
    bekor: lang === "uz" ? "Bekor qilindi" : "Отменён",
  };

  const statusClass: Record<string, string> = {
    yangi: "bg-orange-500/10 text-orange-500",
    jarayonda: "bg-blue-500/10 text-blue-500",
    yetkazildi: "bg-green-500/10 text-green-500",
    bekor: "bg-red-500/10 text-red-500",
  };

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
                  <ClipboardList className="text-orange-500" size={34} />
                  <h1 className="text-4xl font-black md:text-6xl">
                    {lang === "uz" ? "Buyurtmalar" : "Заказы"}
                  </h1>
                </div>

                <p className={`mt-4 text-lg ${theme.soft}`}>
                  {lang === "uz"
                    ? "Supabase orders table’dan real buyurtmalar."
                    : "Реальные заказы из таблицы Supabase orders."}
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
          ) : orders.length === 0 ? (
            <div className={`mt-6 rounded-[32px] border p-10 text-center ${theme.card}`}>
              <ClipboardList className="mx-auto text-orange-500" size={48} />

              <h2 className="mt-5 text-2xl font-black">
                {lang === "uz" ? "Hozircha buyurtma yo‘q" : "Пока заказов нет"}
              </h2>
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-[32px] border p-6 ${theme.card}`}
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
                          {order.id}
                        </span>

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-black ${
                            statusClass[order.status] || statusClass.yangi
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>

                        <span className={`text-sm font-bold ${theme.soft}`}>
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>

                      <h2 className="mt-4 text-2xl font-black">
                        {order.customer_name}
                      </h2>

                      <div className={`mt-3 grid gap-2 text-sm font-bold ${theme.soft}`}>
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          {order.customer_phone}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          Uzbekistan
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:w-[520px]">
                      <select
                        value={order.status}
                        onChange={(e) => changeStatus(order.id, e.target.value)}
                        className={`rounded-2xl border px-4 py-3 font-black outline-none ${theme.input}`}
                      >
                        <option value="yangi">{statusLabels.yangi}</option>
                        <option value="jarayonda">{statusLabels.jarayonda}</option>
                        <option value="yetkazildi">{statusLabels.yetkazildi}</option>
                        <option value="bekor">{statusLabels.bekor}</option>
                      </select>

                      <button
                        onClick={() => removeOrder(order.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 px-5 py-3 font-black text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                        {lang === "uz" ? "O‘chirish" : "Удалить"}
                      </button>
                    </div>
                  </div>

                  <div className={`mt-6 rounded-[24px] border p-4 ${theme.input}`}>
                    <div className="mb-4 flex items-center gap-2 font-black">
                      <Package size={20} className="text-orange-500" />
                      {lang === "uz" ? "Mahsulotlar" : "Товары"}
                    </div>

                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div
                          key={`${order.id}-${item.slug}`}
                          className="flex justify-between gap-4 text-sm font-bold"
                        >
                          <span>
                            {item.name} x{item.qty}
                          </span>

                          <span className="text-orange-500">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="my-4 h-px bg-orange-500/20" />

                    <div className="flex justify-between gap-4 text-xl font-black">
                      <span>{lang === "uz" ? "Jami" : "Итого"}</span>
                      <span className="text-orange-500">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </AdminGuard>
  );
}