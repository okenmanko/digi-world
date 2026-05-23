"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, User, Users, Phone } from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";
import { getUser, type User as UserType } from "@/lib/auth";
import { getOrders, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export default function AdminUsersPage() {
  const { lang, dark } = useApp();

  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setUser(getUser());
    setOrders(getOrders());
  }, []);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark ? "border-white/10 bg-white/5 text-white" : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const userOrders = user ? orders.filter((order) => order.phone === user.phone) : [];
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1440px] px-5 py-8">
          <Link href="/admin" className="mb-6 inline-flex items-center gap-2 font-bold text-orange-500">
            <ArrowLeft size={18} />
            {lang === "uz" ? "Admin panelga qaytish" : "Назад в админ панель"}
          </Link>

          <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
            <div className="flex items-center gap-3">
              <Users className="text-orange-500" size={34} />
              <h1 className="text-4xl font-black md:text-6xl">
                {lang === "uz" ? "Mijozlar" : "Клиенты"}
              </h1>
            </div>

            <p className={`mt-4 text-lg ${theme.soft}`}>
              {lang === "uz"
                ? "Hozircha localStorage orqali ro‘yxatdan o‘tgan mijozlar."
                : "Пока клиенты из localStorage регистрации."}
            </p>
          </div>

          {!user ? (
            <div className={`mt-6 rounded-[32px] border p-10 text-center ${theme.card}`}>
              <User className="mx-auto text-orange-500" size={48} />

              <h2 className="mt-5 text-2xl font-black">
                {lang === "uz" ? "Mijoz topilmadi" : "Клиент не найден"}
              </h2>
            </div>
          ) : (
            <div className={`mt-6 rounded-[32px] border p-6 ${theme.card}`}>
              <div className="grid gap-5 md:grid-cols-4">
                <div className={`rounded-[26px] border p-5 ${theme.input}`}>
                  <User className="mb-3 text-orange-500" size={28} />
                  <div className={`text-sm font-bold ${theme.soft}`}>
                    {lang === "uz" ? "Ism" : "Имя"}
                  </div>
                  <div className="mt-1 text-xl font-black">{user.name}</div>
                </div>

                <div className={`rounded-[26px] border p-5 ${theme.input}`}>
                  <Phone className="mb-3 text-orange-500" size={28} />
                  <div className={`text-sm font-bold ${theme.soft}`}>
                    {lang === "uz" ? "Telefon" : "Телефон"}
                  </div>
                  <div className="mt-1 text-xl font-black">{user.phone}</div>
                </div>

                <div className={`rounded-[26px] border p-5 ${theme.input}`}>
                  <div className="mb-3 text-3xl">🛒</div>
                  <div className={`text-sm font-bold ${theme.soft}`}>
                    {lang === "uz" ? "Buyurtmalar" : "Заказы"}
                  </div>
                  <div className="mt-1 text-xl font-black">{userOrders.length}</div>
                </div>

                <div className={`rounded-[26px] border p-5 ${theme.input}`}>
                  <div className="mb-3 text-3xl">💰</div>
                  <div className={`text-sm font-bold ${theme.soft}`}>
                    {lang === "uz" ? "Umumiy xarid" : "Общая покупка"}
                  </div>
                  <div className="mt-1 text-xl font-black text-orange-500">
                    {formatPrice(totalSpent)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </AdminGuard>
  );
}