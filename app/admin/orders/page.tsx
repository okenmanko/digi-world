"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Box,
  Calendar,
  CreditCard,
  MapPin,
  MessageSquare,
  Phone,
  Trash2,
  Truck,
  User,
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
  city?: string;
  address?: string;
  payment?: string;
  delivery?: string;
  comment?: string;
  total: number;
  status: string;
  created_at: string;

  items: {
    slug: string;
    name: string;
    price: number;
    qty: number;
  }[];
};

export default function AdminOrdersPage() {
  const { lang, dark } = useApp();

  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);

    const data = await getSupabaseOrders();

    setOrders((data || []) as DbOrder[]);

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
      lang === "uz"
        ? "Buyurtmani o‘chirasizmi?"
        : "Удалить заказ?"
    );

    if (!ok) return;

    await deleteSupabaseOrder(id);

    await loadOrders();
  }

  function statusLabel(status: string) {
    if (status === "yangi") {
      return lang === "uz" ? "Yangi" : "Новый";
    }

    if (status === "jarayonda") {
      return lang === "uz"
        ? "Jarayonda"
        : "В работе";
    }

    if (status === "yetkazildi") {
      return lang === "uz"
        ? "Yetkazildi"
        : "Доставлен";
    }

    if (status === "bekor") {
      return lang === "uz"
        ? "Bekor qilingan"
        : "Отменён";
    }

    return status;
  }

  const theme = {
    page: dark
      ? "bg-[#050505] text-white"
      : "bg-[#f6f7fb] text-zinc-950",

    card: dark
      ? "border-white/10 bg-white/[0.04]"
      : "border-black/10 bg-white",

    input: dark
      ? "border-white/10 bg-white/5 text-white"
      : "border-black/10 bg-white text-zinc-950",

    soft: dark
      ? "text-zinc-400"
      : "text-zinc-600",
  };

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1440px] px-5 py-7">
          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 font-black text-orange-500"
          >
            <ArrowLeft size={18} />

            {lang === "uz"
              ? "Admin panelga qaytish"
              : "Назад"}
          </Link>

          <div
            className={`rounded-[30px] border p-6 ${theme.card}`}
          >
            <h1 className="text-4xl font-black md:text-6xl">
              {lang === "uz"
                ? "Buyurtmalar"
                : "Заказы"}
            </h1>

            <p
              className={`mt-3 text-lg font-medium ${theme.soft}`}
            >
              {lang === "uz"
                ? "Klient ma’lumotlari va buyurtmalar."
                : "Данные клиентов и заказы."}
            </p>
          </div>

          {loading ? (
            <div
              className={`mt-6 rounded-[30px] border p-10 text-center ${theme.card}`}
            >
              <div className="text-2xl font-black text-orange-500">
                Loading...
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div
              className={`mt-6 rounded-[30px] border p-10 text-center ${theme.card}`}
            >
              <Box
                className="mx-auto text-orange-500"
                size={54}
              />

              <h2 className="mt-5 text-2xl font-black">
                {lang === "uz"
                  ? "Buyurtmalar yo‘q"
                  : "Заказов нет"}
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
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
                          {order.id}
                        </div>

                        <div className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
                          {statusLabel(order.status)}
                        </div>

                        <div
                          className={`flex items-center gap-2 text-sm font-bold ${theme.soft}`}
                        >
                          <Calendar size={16} />

                          {new Date(
                            order.created_at
                          ).toLocaleString()}
                        </div>
                      </div>

                      <h2 className="mt-5 text-3xl font-black">
                        {order.customer_name}
                      </h2>

                      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div
                          className={`rounded-2xl border p-4 ${theme.input}`}
                        >
                          <div
                            className={`flex items-center gap-2 text-sm font-black ${theme.soft}`}
                          >
                            <Phone size={17} />

                            {lang === "uz"
                              ? "Telefon"
                              : "Телефон"}
                          </div>

                          <div className="mt-2 font-black">
                            {order.customer_phone || "—"}
                          </div>
                        </div>

                        <div
                          className={`rounded-2xl border p-4 ${theme.input}`}
                        >
                          <div
                            className={`flex items-center gap-2 text-sm font-black ${theme.soft}`}
                          >
                            <MapPin size={17} />

                            {lang === "uz"
                              ? "Viloyat"
                              : "Регион"}
                          </div>

                          <div className="mt-2 font-black">
                            {order.city || "—"}
                          </div>
                        </div>

                        <div
                          className={`rounded-2xl border p-4 ${theme.input}`}
                        >
                          <div
                            className={`flex items-center gap-2 text-sm font-black ${theme.soft}`}
                          >
                            <Truck size={17} />

                            {lang === "uz"
                              ? "Manzil"
                              : "Адрес"}
                          </div>

                          <div className="mt-2 font-black">
                            {order.address || "—"}
                          </div>
                        </div>

                        <div
                          className={`rounded-2xl border p-4 ${theme.input}`}
                        >
                          <div
                            className={`flex items-center gap-2 text-sm font-black ${theme.soft}`}
                          >
                            <CreditCard size={17} />

                            {lang === "uz"
                              ? "To‘lov"
                              : "Оплата"}
                          </div>

                          <div className="mt-2 font-black">
                            {order.payment || "—"}
                          </div>
                        </div>

                        <div
                          className={`rounded-2xl border p-4 ${theme.input}`}
                        >
                          <div
                            className={`flex items-center gap-2 text-sm font-black ${theme.soft}`}
                          >
                            <Truck size={17} />

                            {lang === "uz"
                              ? "Yetkazish"
                              : "Доставка"}
                          </div>

                          <div className="mt-2 font-black">
                            {order.delivery || "—"}
                          </div>
                        </div>

                        <div
                          className={`rounded-2xl border p-4 ${theme.input}`}
                        >
                          <div
                            className={`flex items-center gap-2 text-sm font-black ${theme.soft}`}
                          >
                            <MessageSquare size={17} />

                            {lang === "uz"
                              ? "Izoh"
                              : "Комментарий"}
                          </div>

                          <div className="mt-2 font-black">
                            {order.comment || "—"}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`mt-5 rounded-[26px] border p-5 ${theme.input}`}
                      >
                        <div className="flex items-center gap-2 text-xl font-black">
                          <Box
                            size={22}
                            className="text-orange-500"
                          />

                          {lang === "uz"
                            ? "Mahsulotlar"
                            : "Товары"}
                        </div>

                        <div className="mt-5 grid gap-3">
                          {order.items?.map((item) => (
                            <div
                              key={item.slug}
                              className="flex items-center justify-between gap-4 border-b border-white/10 pb-3"
                            >
                              <div>
                                <div className="font-black">
                                  {item.name} × {item.qty}
                                </div>
                              </div>

                              <div className="font-black text-orange-500">
                                {formatPrice(
                                  item.price * item.qty
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div className="text-2xl font-black">
                            {lang === "uz"
                              ? "Jami"
                              : "Итого"}
                          </div>

                          <div className="text-4xl font-black text-orange-500">
                            {formatPrice(order.total)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 xl:w-[320px]">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          changeStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className={`rounded-2xl border px-5 py-4 text-lg font-black outline-none ${theme.input}`}
                      >
                        <option value="yangi">
                          {lang === "uz"
                            ? "Yangi"
                            : "Новый"}
                        </option>

                        <option value="jarayonda">
                          {lang === "uz"
                            ? "Jarayonda"
                            : "В работе"}
                        </option>

                        <option value="yetkazildi">
                          {lang === "uz"
                            ? "Yetkazildi"
                            : "Доставлен"}
                        </option>

                        <option value="bekor">
                          {lang === "uz"
                            ? "Bekor qilingan"
                            : "Отменён"}
                        </option>
                      </select>

                      <button
                        onClick={() =>
                          removeOrder(order.id)
                        }
                        className="flex items-center justify-center gap-3 rounded-2xl border border-red-500 px-5 py-4 text-lg font-black text-red-500"
                      >
                        <Trash2 size={20} />

                        {lang === "uz"
                          ? "O‘chirish"
                          : "Удалить"}
                      </button>
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