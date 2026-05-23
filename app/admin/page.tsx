"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Lock,
  LogOut,
  PackagePlus,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { products, formatPrice } from "@/lib/products";
import { isAdminLogged, loginAdmin, logoutAdmin } from "@/lib/adminAuth";
import { getSupabaseOrders } from "@/lib/supabaseOrders";
import { getFullMergedProducts } from "@/lib/mergedProducts";

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
  const [totalProducts, setTotalProducts] = useState(products.length);

  useEffect(() => {
    async function load() {
      const dbOrders = await getSupabaseOrders();
      setOrders(dbOrders as DbOrder[]);

      const merged = await getFullMergedProducts();
      setTotalProducts(merged.length);

      if (isAdminLogged()) {
        setAccess(true);
      }
    }

    load();
  }, []);

  const theme = useMemo(
    () => ({
      page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
      card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
      input: dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
      soft: dark ? "text-zinc-400" : "text-zinc-600",
    }),
    [dark]
  );

  const totalOrders = orders.length;
  const newOrders = orders.filter((order) => order.status === "yangi").length;
  const salesTotal = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  function login() {
    if (password === ADMIN_PASSWORD) {
      loginAdmin();
      setAccess(true);
      return;
    }

    alert(lang === "uz" ? "Admin parol noto‘g‘ri" : "Неверный пароль администратора");
  }

  if (!access) {
    return (
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto flex min-h-[70vh] max-w-[520px] items-center justify-center px-5 py-10">
          <div className={`w-full rounded-[36px] border p-8 ${theme.card}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
              <Lock size={38} />
            </div>

            <h1 className="mt-6 text-center text-4xl font-black">
              {lang === "uz" ? "Admin panel" : "Админ панель"}
            </h1>

            <p className={`mt-3 text-center font-medium ${theme.soft}`}>
              {lang === "uz" ? "Admin parolni kiriting." : "Введите пароль администратора."}
            </p>

            <div className="mt-7 grid gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") login();
                }}
                placeholder={lang === "uz" ? "Admin parol" : "Пароль администратора"}
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <button
                onClick={login}
                className="rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-black text-white"
              >
                {lang === "uz" ? "Kirish" : "Войти"}
              </button>

              <p className={`text-center text-xs ${theme.soft}`}>
                MVP test parol: <span className="font-black text-orange-500">12345</span>
              </p>
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
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
                <ShieldCheck size={18} />
                {lang === "uz" ? "Admin access" : "Доступ администратора"}
              </div>

              <h1 className="mt-4 text-4xl font-black md:text-6xl">
                {lang === "uz" ? "Digi World boshqaruv paneli" : "Панель управления Digi World"}
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
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 px-5 py-3 font-black text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut size={18} />
              {lang === "uz" ? "Chiqish" : "Выйти"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: Boxes,
              titleUz: "Mahsulotlar",
              titleRu: "Товары",
              value: totalProducts,
            },
            {
              icon: ShoppingCart,
              titleUz: "Buyurtmalar",
              titleRu: "Заказы",
              value: totalOrders,
            },
            {
              icon: ClipboardList,
              titleUz: "Yangi buyurtmalar",
              titleRu: "Новые заказы",
              value: newOrders,
            },
            {
              icon: BarChart3,
              titleUz: "Umumiy savdo",
              titleRu: "Общие продажи",
              value: formatPrice(salesTotal),
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.titleUz} className={`rounded-[30px] border p-6 ${theme.card}`}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                  <Icon size={28} />
                </div>

                <div className={`text-sm font-black ${theme.soft}`}>
                  {lang === "uz" ? item.titleUz : item.titleRu}
                </div>

                <div className="mt-2 text-3xl font-black">{item.value}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className={`h-fit rounded-[32px] border p-5 ${theme.card}`}>
            <div className="grid gap-3">
              <Link href="/admin" className="flex items-center gap-3 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white">
                <BarChart3 size={20} />
                Dashboard
              </Link>

              <Link href="/admin/products" className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black ${theme.input}`}>
                <PackagePlus size={20} />
                {lang === "uz" ? "Mahsulotlar" : "Товары"}
              </Link>

              <Link href="/admin/orders" className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black ${theme.input}`}>
                <ClipboardList size={20} />
                {lang === "uz" ? "Buyurtmalar" : "Заказы"}
              </Link>

              <Link href="/admin/users" className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black ${theme.input}`}>
                <Users size={20} />
                {lang === "uz" ? "Mijozlar" : "Клиенты"}
              </Link>
            </div>
          </aside>

          <div className={`rounded-[32px] border p-6 ${theme.card}`}>
            <h2 className="text-3xl font-black">
              {lang === "uz" ? "Oxirgi buyurtmalar" : "Последние заказы"}
            </h2>

            {orders.length === 0 ? (
              <div className={`mt-6 rounded-[28px] border p-8 text-center ${theme.input}`}>
                <ClipboardList className="mx-auto text-orange-500" size={44} />

                <h3 className="mt-4 text-xl font-black">
                  {lang === "uz" ? "Hozircha buyurtma yo‘q" : "Пока заказов нет"}
                </h3>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
                  <thead>
                    <tr className={`text-left text-sm ${theme.soft}`}>
                      <th className="px-4">ID</th>
                      <th className="px-4">Client</th>
                      <th className="px-4">Phone</th>
                      <th className="px-4">Total</th>
                      <th className="px-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.slice(0, 6).map((order) => (
                      <tr key={order.id} className={theme.input}>
                        <td className="max-w-[190px] truncate rounded-l-2xl border-y border-l px-4 py-4 font-black">
                          {order.id}
                        </td>

                        <td className="border-y px-4 py-4 font-bold">
                          {order.customer_name}
                        </td>

                        <td className="border-y px-4 py-4 font-bold">
                          {order.customer_phone}
                        </td>

                        <td className="border-y px-4 py-4 font-black text-orange-500">
                          {formatPrice(Number(order.total || 0))}
                        </td>

                        <td className="rounded-r-2xl border-y border-r px-4 py-4">
                          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-black text-orange-500">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Link
                  href="/admin/orders"
                  className="mt-5 inline-flex rounded-2xl bg-orange-500 px-6 py-3 font-black text-white"
                >
                  {lang === "uz" ? "Barcha buyurtmalar" : "Все заказы"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}