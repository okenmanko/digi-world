"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

import { useApp } from "@/context/AppContext";

import {
  clearCart,
  decreaseCartItem,
  getCart,
  addToCart,
  removeFromCart,
  type CartItem,
} from "@/lib/cart";

import { formatPrice } from "@/lib/products";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";

export default function CartPage() {
  const { dark, lang, refreshCartCount } = useApp();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<MergedProduct[]>([]);

  useEffect(() => {
    async function load() {
      setCart(getCart());
      const data = await getFullMergedProducts();
      setProducts(data);
    }

    load();
  }, []);

  function refresh() {
    setCart(getCart());
    refreshCartCount();
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

  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) return null;

      return {
        ...product,
        qty: item.qty,
      };
    })
    .filter(Boolean);

  const total = cartItems.reduce(
    (sum, item) => (item ? sum + item.price * item.qty : sum),
    0
  );

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-7">
        <Link
          href="/catalog"
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-orange-500"
        >
          <ArrowLeft size={17} />
          {lang === "uz" ? "Katalogga qaytish" : "Вернуться в каталог"}
        </Link>

        <div className={`rounded-[30px] border p-6 ${theme.card}`}>
          <h1 className="text-4xl font-black md:text-6xl">
            {lang === "uz" ? "Savat" : "Корзина"}
          </h1>

          <p className={`mt-3 text-base font-medium ${theme.soft}`}>
            {lang === "uz"
              ? "Buyurtmangizni tekshiring."
              : "Проверьте ваш заказ."}
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {cartItems.length === 0 ? (
              <div className={`rounded-[28px] border p-8 text-center ${theme.card}`}>
                <ShoppingBag className="mx-auto text-orange-500" size={48} />

                <h2 className="mt-4 text-2xl font-black">
                  {lang === "uz" ? "Savat bo‘sh" : "Корзина пустая"}
                </h2>

                <p className={`mt-2 text-sm ${theme.soft}`}>
                  {lang === "uz" ? "Mahsulot qo‘shing." : "Добавьте товары."}
                </p>

                <Link
                  href="/catalog"
                  className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-3 font-black text-white"
                >
                  {lang === "uz" ? "Katalogga o‘tish" : "Перейти в каталог"}
                </Link>
              </div>
            ) : (
              cartItems.map((item) =>
                item ? (
                  <div
                    key={item.slug}
                    className={`rounded-[28px] border p-5 ${theme.card}`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-4xl">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-20 w-20 object-contain"
                            />
                          ) : (
                            item.emoji || "📦"
                          )}
                        </div>

                        <div>
                          <h2 className="text-xl font-black">{item.name}</h2>

                          <div className={`mt-1 text-sm ${theme.soft}`}>
                            x{item.qty}
                          </div>

                          <div className="mt-3 text-3xl font-black text-orange-500">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            decreaseCartItem(item.slug);
                            refresh();
                          }}
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${theme.input}`}
                        >
                          <Minus size={19} />
                        </button>

                        <div
                          className={`flex h-11 min-w-[56px] items-center justify-center rounded-xl border px-4 text-lg font-black ${theme.input}`}
                        >
                          {item.qty}
                        </div>

                        <button
                          onClick={() => {
                            addToCart(item.slug);
                            refresh();
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-orange-400 to-red-500 text-white"
                        >
                          <Plus size={19} />
                        </button>

                        <button
                          onClick={() => {
                            removeFromCart(item.slug);
                            refresh();
                          }}
                          className="flex h-11 items-center gap-2 rounded-xl border border-red-500 px-4 text-sm font-black text-red-500"
                        >
                          <Trash2 size={18} />
                          {lang === "uz" ? "O‘chirish" : "Удалить"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null
              )
            )}
          </div>

          <aside className={`h-fit rounded-[28px] border p-5 ${theme.card}`}>
            <h2 className="text-3xl font-black">
              {lang === "uz" ? "Jami" : "Итого"}
            </h2>

            <div className="mt-5 text-4xl font-black text-orange-500">
              {formatPrice(total)}
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-5 py-4 text-base font-black text-white"
            >
              {lang === "uz"
                ? "Buyurtmani rasmiylashtirish"
                : "Оформить заказ"}
            </Link>

            <button
              onClick={() => {
                clearCart();
                refresh();
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500 px-5 py-4 text-base font-black text-red-500"
            >
              <Trash2 size={18} />
              {lang === "uz" ? "Savatni tozalash" : "Очистить корзину"}
            </button>
          </aside>
        </div>
      </section>
      <footer/>
    </main>
  );
}