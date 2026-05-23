"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  LogOut,
  Package,
  Phone,
  Scale,
  ShoppingBag,
  User,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useApp } from "@/context/AppContext";
import { getUser, logoutUser } from "@/lib/auth";
import { getFavorites } from "@/lib/favorites";
import { getCompare } from "@/lib/compare";
import { getCart } from "@/lib/cart";
import { getSupabaseOrders } from "@/lib/supabaseOrders";

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

export default function ProfilePage() {
  const { lang, dark, setLogged } = useApp();

  const [user, setUser] = useState<{
    name: string;
    phone: string;
  } | null>(null);

  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      const currentUser = getUser();
      setUser(currentUser);

      setFavoritesCount(getFavorites().length);
      setCompareCount(getCompare().length);
      setCartCount(getCart().reduce((sum, item) => sum + item.qty, 0));

      const dbOrders = (await getSupabaseOrders()) as DbOrder[];

      if (currentUser?.phone) {
        setOrders(
          dbOrders.filter(
            (order) =>
              order.customer_phone === currentUser.phone ||
              order.customer_phone === currentUser.name
          )
        );
      } else {
        setOrders([]);
      }

      setLoadingOrders(false);
    }

    loadProfile();
  }, []);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
    danger: dark
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : "border-red-500/20 bg-red-500/10 text-red-500",
  };

  const statusLabels: Record<string, string> = {
    yangi: lang === "uz" ? "Yangi" : "Новый",
    jarayonda: lang === "uz" ? "Jarayonda" : "В работе",
    yetkazildi: lang === "uz" ? "Yetkazildi" : "Доставлен",
    bekor: lang === "uz" ? "Bekor qilindi" : "Отменён",
  };

  function logout() {
    logoutUser();
    setLogged(false);
    window.location.href = "/";
  }

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  return (
    <AuthGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1440px] px-5 py-8">
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className={`rounded-[36px] border p-6 ${theme.card}`}>
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
                <User size={42} />
              </div>

              <h1 className="mt-5 text-3xl font-black">
                {user?.name || "User"}
              </h1>

              <p className={`mt-2 font-medium ${theme.soft}`}>
                {user?.phone || ""}
              </p>

              <div className="mt-7 grid gap-3">
                <div className={`rounded-2xl border p-4 ${theme.card}`}>
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="text-orange-500" size={22} />

                    <div>
                      <div className="font-black">
                        {lang === "uz" ? "Savat" : "Корзина"}
                      </div>

                      <div className={theme.soft}>{cartCount}</div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${theme.card}`}>
                  <div className="flex items-center gap-3">
                    <Heart className="text-orange-500" size={22} />

                    <div>
                      <div className="font-black">
                        {lang === "uz" ? "Sevimlilar" : "Избранное"}
                      </div>

                      <div className={theme.soft}>{favoritesCount}</div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${theme.card}`}>
                  <div className="flex items-center gap-3">
                    <Scale className="text-orange-500" size={22} />

                    <div>
                      <div className="font-black">
                        {lang === "uz" ? "Taqqoslash" : "Сравнение"}
                      </div>

                      <div className={theme.soft}>{compareCount}</div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${theme.card}`}>
                  <div className="flex items-center gap-3">
                    <Phone className="text-orange-500" size={22} />

                    <div>
                      <div className="font-black">
                        {lang === "uz" ? "Umumiy xarid" : "Всего покупок"}
                      </div>

                      <div className="font-black text-orange-500">
                        {totalSpent.toLocaleString()} so‘m
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-4 font-black ${theme.danger}`}
              >
                <LogOut size={20} />

                {lang === "uz" ? "Chiqish" : "Выйти"}
              </button>
            </div>

            <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
              <div className="flex items-center gap-3">
                <Package className="text-orange-500" size={32} />

                <h2 className="text-3xl font-black md:text-5xl">
                  {lang === "uz" ? "Buyurtmalar" : "Заказы"}
                </h2>
              </div>

              {loadingOrders ? (
                <div className="mt-8 rounded-3xl border border-dashed border-orange-500/20 p-10 text-center">
                  <div className="text-xl font-black text-orange-500">
                    Loading...
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-orange-500/20 p-10 text-center">
                  <Package className="mx-auto text-orange-500" size={48} />

                  <h3 className="mt-5 text-2xl font-black">
                    {lang === "uz" ? "Buyurtmalar yo‘q" : "Заказов пока нет"}
                  </h3>

                  <p className={`mt-2 ${theme.soft}`}>
                    {lang === "uz"
                      ? "Checkoutda shu telefon raqam bilan buyurtma yuboring."
                      : "Оформите заказ с этим номером телефона."}
                  </p>

                  <Link
                    href="/catalog"
                    className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-4 font-black text-white"
                  >
                    {lang === "uz" ? "Katalogga o‘tish" : "Перейти в каталог"}
                  </Link>
                </div>
              ) : (
                <div className="mt-8 grid gap-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`rounded-3xl border p-5 ${theme.card}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="text-lg font-black">#{order.id}</div>

                          <div className={theme.soft}>
                            {new Date(order.created_at).toLocaleString()}
                          </div>
                        </div>

                        <div className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
                          {statusLabels[order.status] || order.status}
                        </div>
                      </div>

                      <div className="mt-5 text-2xl font-black text-orange-500">
                        {Number(order.total || 0).toLocaleString()} so‘m
                      </div>

                      <div className={`mt-2 ${theme.soft}`}>
                        {order.items?.length || 0} ta mahsulot
                      </div>

                      <div className="mt-4 grid gap-2">
                        {order.items?.map((item) => (
                          <div
                            key={`${order.id}-${item.slug}`}
                            className={`rounded-2xl border p-3 ${theme.card}`}
                          >
                            <div className="flex justify-between gap-3">
                              <span className="font-black">
                                {item.name} x{item.qty}
                              </span>

                              <span className="font-black text-orange-500">
                                {(item.price * item.qty).toLocaleString()} so‘m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}