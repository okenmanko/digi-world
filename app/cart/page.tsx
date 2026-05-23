"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { clearCart, getCart, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";

export default function CartPage() {
  const { lang, dark, refreshCartCount } = useApp();

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

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white",
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

  function handleClear() {
    clearCart();
    setCart([]);
    refreshCartCount();
  }

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <Link
          href="/catalog"
          className="mb-6 inline-flex items-center gap-2 font-bold text-orange-500"
        >
          <ArrowLeft size={18} />
          {lang === "uz" ? "Katalogga qaytish" : "Назад в каталог"}
        </Link>

        <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
          <h1 className="text-4xl font-black md:text-6xl">
            {lang === "uz" ? "Savat" : "Корзина"}
          </h1>

          <p className={`mt-3 text-lg font-medium ${theme.soft}`}>
            {lang === "uz"
              ? "Buyurtmangizni tekshiring."
              : "Проверьте ваш заказ."}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className={`mt-6 rounded-[36px] border p-10 text-center ${theme.card}`}>
            <ShoppingCart className="mx-auto text-orange-500" size={56} />

            <h2 className="mt-5 text-2xl font-black">
              {lang === "uz" ? "Savat hozircha bo‘sh" : "Корзина пока пустая"}
            </h2>

            <Link
              href="/catalog"
              className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-8 py-4 font-black text-white"
            >
              {lang === "uz" ? "Xaridni davom ettirish" : "Продолжить покупки"}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="grid gap-4">
              {cartItems.map((item) =>
                item ? (
                  <div
                    key={item.slug}
                    className={`rounded-[28px] border p-5 ${theme.card}`}
                  >
                    <div className="flex gap-5">
                      <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-white">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-28 w-28 object-contain"
                          />
                        ) : (
                          <div className="text-5xl">{item.emoji}</div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl font-black">{item.name}</h2>

                        <p className={`mt-2 text-sm font-bold ${theme.soft}`}>
                          x{item.qty}
                        </p>

                        <div className="mt-4 text-2xl font-black text-orange-500">
                          {formatPrice(item.price * item.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>

            <aside className={`h-fit rounded-[32px] border p-6 ${theme.card}`}>
              <h2 className="text-2xl font-black">
                {lang === "uz" ? "Jami" : "Итого"}
              </h2>

              <div className="mt-5 text-4xl font-black text-orange-500">
                {formatPrice(total)}
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full justify-center rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-black text-white"
              >
                {lang === "uz" ? "Checkout" : "Оформить"}
              </Link>

              <button
                onClick={handleClear}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 px-7 py-4 font-black text-red-500"
              >
                <Trash2 size={18} />
                {lang === "uz" ? "Savatni tozalash" : "Очистить корзину"}
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}