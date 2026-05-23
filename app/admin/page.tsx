"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  ClipboardList,
  Database,
  Lock,
  LogOut,
  Package,
  PackagePlus,
  ShoppingCart,
  Users,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { isAdminLogged, loginAdmin, logoutAdmin } from "@/lib/adminAuth";
import { getSupabaseOrders } from "@/lib/supabaseOrders";
import { getFullMergedProducts } from "@/lib/mergedProducts";
import { formatPrice } from "@/lib/products";

const ADMIN_PASSWORD = "12345";

type DbOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  total: number;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const { lang, dark } = useApp();

  const [password, setPassword] = useState("");
  const [access, setAccess] = useState(false);
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function load() {
      setAccess(isAdminLogged());

      const dbOrders = await getSupabaseOrders();
      setOrders(dbOrders as DbOrder[]);

      const products = await getFullMergedProducts();
      setProductCount(products.length);
    }

    load();
  }, []);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const totalOrders = orders.length;
  const newOrders = orders.filter((order) => order.status === "yangi").length;
  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  function login() {
    if (password === ADMIN_PASSWORD) {
      loginAdmin();
      setAccess(true);
      return;
    }

    alert(lang === "uz" ? "Admin parol noto‘g‘ri" : "Неверный пароль");
  }

  if (!access) {
    return (
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto flex min-h-[75vh] max-w-[520px] items-center justify-center px-5 py-10">
          <div className={`w-full rounded-[36px] border p-8 ${theme.card}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
              <Lock size={38} />
            </div>

            <h1 className="mt-6 text-center text-4xl font-black">
              {lang === "uz" ? "Admin panel" : "Админ панель"}
            </h1>

            <p className={`mt-3 text-center font-medium ${theme.soft}`}>
              {lang === "uz"
                ? "Admin parolni kiriting."
                : "Введите пароль администратора."}
            </p>

            <div className="mt-7 grid gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") login();
                }}
                placeholder={lang === "uz" ? "Admin parol" : "Пароль"}
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <button
                onClick={login}
                className="rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-black text-white"
              >
                {lang === "uz" ? "Kirish" : "Войти"}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-6xl">
                {lang === "uz"
                  ? "Digi World admin panel"
                  : "Админ панель Digi World"}
              </h1>

              <p className={`mt-3 text-lg font-medium ${theme.soft}`}>
                {lang === "uz"
                  ? "Mahsulotlar, buyurtmalar va statistikani boshqarish."
                  : "Управление товарами, заказами и статистикой."}
              </p>
            </div>

            <button
              onClick={() => {
                logoutAdmin();
                setAccess(false);
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 px-5 py-3 font-black text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut size={18} />
              {lang === "uz" ? "Chiqish" : "Выйти"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className={`rounded-[30px] border p-6 ${theme.card}`}>
            <Package className="text-orange-500" size={34} />
            <div className={`mt-4 text-sm font-black ${theme.soft}`}>
              {lang === "uz" ? "Mahsulotlar" : "Товары"}
            </div>
            <div className="mt-2 text-3xl font-black">{productCount}</div>
          </div>

          <div className={`rounded-[30px] border p-6 ${theme.card}`}>
            <ShoppingCart className="text-orange-500" size={34} />
            <div className={`mt-4 text-sm font-black ${theme.soft}`}>
              {lang === "uz" ? "Buyurtmalar" : "Заказы"}
            </div>
            <div className="mt-2 text-3xl font-black">{totalOrders}</div>
          </div>

          <div className={`rounded-[30px] border p-6 ${theme.card}`}>
            <ClipboardList className="text-orange-500" size={34} />
            <div className={`mt-4 text-sm font-black ${theme.soft}`}>
              {lang === "uz" ? "Yangi buyurtmalar" : "Новые заказы"}
            </div>
            <div className="mt-2 text-3xl font-black">{newOrders}</div>
          </div>

          <div className={`rounded-[30px] border p-6 ${theme.card}`}>
            <BarChart3 className="text-orange-500" size={34} />
            <div className={`mt-4 text-sm font-black ${theme.soft}`}>
              {lang === "uz" ? "Umumiy savdo" : "Общие продажи"}
            </div>
            <div className="mt-2 text-3xl font-black">
              {formatPrice(totalSales)}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/admin/products"
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black transition hover:border-orange-500 ${theme.input}`}
          >
            <PackagePlus size={20} />
            {lang === "uz" ? "Mahsulotlar" : "Товары"}
          </Link>

          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black transition hover:border-orange-500 ${theme.input}`}
          >
            <ClipboardList size={20} />
            {lang === "uz" ? "Buyurtmalar" : "Заказы"}
          </Link>

          <Link
            href="/admin/analytics"
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black transition hover:border-orange-500 ${theme.input}`}
          >
            <BarChart3 size={20} />
            Analytics
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black transition hover:border-orange-500 ${theme.input}`}
          >
            <Users size={20} />
            {lang === "uz" ? "Foydalanuvchilar" : "Пользователи"}
          </Link>

          <Link
            href="/admin/supabase-test"
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black transition hover:border-orange-500 ${theme.input}`}
          >
            <Database size={20} />
            Supabase Test
          </Link>
        </div>

        <div className={`mt-6 rounded-[32px] border p-6 ${theme.card}`}>
          <h2 className="text-3xl font-black">
            {lang === "uz" ? "Oxirgi buyurtmalar" : "Последние заказы"}
          </h2>

          {orders.length === 0 ? (
            <div className={`mt-6 rounded-2xl border p-6 text-center ${theme.input}`}>
              {lang === "uz" ? "Hozircha buyurtma yo‘q" : "Пока заказов нет"}
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className={`rounded-2xl border p-4 ${theme.input}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-black">{order.customer_name}</div>
                      <div className={`text-sm font-bold ${theme.soft}`}>
                        {order.customer_phone}
                      </div>
                    </div>

                    <div className="font-black text-orange-500">
                      {formatPrice(Number(order.total || 0))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}