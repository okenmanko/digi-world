"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TelegramButton from "@/components/TelegramButton";
import MobileBottomNav from "@/components/MobileBottomNav";

import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/products";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "@/lib/cart";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";

type LocalCartItem = {
  slug: string;
  quantity: number;
};

type CartLine = LocalCartItem & {
  product: MergedProduct;
};

export default function CartPage() {
  const { lang, dark, refreshCartCount } = useApp();

  const [cart, setCart] = useState<LocalCartItem[]>([]);
  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      const productData = await getFullMergedProducts();

      setProducts(productData);
      setCart(getCart() as any);
      setReady(true);
    }

    load();
  }, []);

  const cartLines: CartLine[] = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.slug === item.slug);

        if (!product) return null;

        return {
          ...item,
          product,
        };
      })
      .filter((item): item is CartLine => Boolean(item));
  }, [cart, products]);

  const totals = useMemo(() => {
    const currentTotal = cartLines.reduce((sum, item) => {
      return sum + Number(item.product.price || 0) * item.quantity;
    }, 0);

    const oldTotal = cartLines.reduce((sum, item) => {
      const price = Number(item.product.price || 0);

      const oldPrice =
        item.product.oldPrice && Number(item.product.oldPrice) > price
          ? Number(item.product.oldPrice)
          : price;

      return sum + oldPrice * item.quantity;
    }, 0);

    const saved = Math.max(oldTotal - currentTotal, 0);

    const savedPercent =
      oldTotal > 0 ? Math.round((saved / oldTotal) * 100) : 0;

    return {
      currentTotal,
      oldTotal,
      saved,
      savedPercent,
    };
  }, [cartLines]);

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

    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  function reloadCart() {
    setCart(getCart() as any);
    refreshCartCount();
  }

  function decrease(slug: string, quantity: number) {
    if (quantity <= 1) {
      removeFromCart(slug);
    } else {
      updateQuantity(slug, quantity - 1);
    }

    reloadCart();
  }

  function increase(slug: string, quantity: number) {
    updateQuantity(slug, quantity + 1);
    reloadCart();
  }

  function remove(slug: string) {
    removeFromCart(slug);
    reloadCart();
  }

  function cleanCart() {
    clearCart();
    reloadCart();
  }

  if (!ready) {
    return (
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1440px] px-5 py-10">
          <div
            className={`rounded-[32px] border p-10 text-center ${theme.card}`}
          >
            <div className="text-2xl font-black text-orange-500">
              Loading...
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={`min-h-screen pb-20 ${theme.page}`}>
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-7">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 font-black text-orange-500"
        >
          <ArrowLeft size={18} />
          {lang === "uz" ? "Katalogga qaytish" : "Вернуться в каталог"}
        </Link>

        <div className={`mt-5 rounded-[32px] border p-6 ${theme.card}`}>
          <h1 className="text-5xl font-black md:text-6xl">
            {lang === "uz" ? "Savat" : "Корзина"}
          </h1>

          <p className={`mt-3 text-lg font-medium ${theme.soft}`}>
            {lang === "uz"
              ? "Buyurtmangizni tekshiring."
              : "Проверьте ваш заказ."}
          </p>
        </div>

        {cartLines.length === 0 ? (
          <div
            className={`mt-6 rounded-[32px] border p-10 text-center ${theme.card}`}
          >
            <ShoppingCart className="mx-auto text-orange-500" size={64} />

            <h2 className="mt-5 text-3xl font-black">
              {lang === "uz" ? "Savat bo‘sh" : "Корзина пуста"}
            </h2>

            <Link
              href="/catalog"
              className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-black text-white"
            >
              {lang === "uz" ? "Katalogga o‘tish" : "Перейти в каталог"}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">
            <div className="grid gap-4">
              {cartLines.map((item) => {
                const product = item.product;
                const price = Number(product.price || 0);

                const hasDiscount =
                  Boolean(product.oldPrice) && Number(product.oldPrice) > price;

                const oldLineTotal = hasDiscount
                  ? Number(product.oldPrice) * item.quantity
                  : price * item.quantity;

                const currentLineTotal = price * item.quantity;

                const savedLine = Math.max(oldLineTotal - currentLineTotal, 0);

                const discountPercent = hasDiscount
                  ? Math.round(
                    ((Number(product.oldPrice) - price) /
                      Number(product.oldPrice)) *
                    100
                  )
                  : 0;

                return (
                  <div
                    key={product.slug}
                    className={`rounded-[30px] border p-5 ${theme.card}`}
                  >
                    <div className="grid gap-5 md:grid-cols-[120px_1fr_auto] md:items-center">
                      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-[24px] bg-white">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-[105px] w-[105px] object-contain"
                          />
                        ) : (
                          <div className="text-6xl">
                            {product.emoji || "📦"}
                          </div>
                        )}
                      </div>

                      <div>
                        <h2 className="text-2xl font-black leading-tight">
                          {product.name}
                        </h2>

                        <div className={`mt-2 text-sm font-black ${theme.soft}`}>
                          x{item.quantity}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {hasDiscount && (
                            <span className="text-lg font-black text-zinc-400 line-through">
                              {formatPrice(oldLineTotal)}
                            </span>
                          )}

                          <span className="text-3xl font-black text-orange-500">
                            {formatPrice(currentLineTotal)}
                          </span>

                          {hasDiscount && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-600">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>

                        {savedLine > 0 && (
                          <div className="mt-2 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-sm font-black text-green-600">
                            {lang === "uz" ? "Tejaysiz: " : "Выгода: "}
                            {formatPrice(savedLine)}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 md:justify-end">
                        <button
                          onClick={() => decrease(product.slug, item.quantity)}
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${theme.input}`}
                        >
                          <Minus size={18} />
                        </button>

                        <div
                          className={`flex h-12 min-w-16 items-center justify-center rounded-2xl border px-5 font-black ${theme.input}`}
                        >
                          {item.quantity}
                        </div>

                        <button
                          onClick={() => increase(product.slug, item.quantity)}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 text-white"
                        >
                          <Plus size={18} />
                        </button>

                        <button
                          onClick={() => remove(product.slug)}
                          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-500 px-5 font-black text-red-500"
                        >
                          <Trash2 size={18} />
                          {lang === "uz" ? "O‘chirish" : "Удалить"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className={`h-fit rounded-[30px] border p-6 ${theme.card}`}>
              <h2 className="text-3xl font-black">
                {lang === "uz" ? "Jami" : "Итого"}
              </h2>

              <div className="mt-5 rounded-[24px] bg-orange-500/10 p-5">
                {totals.saved > 0 && (
                  <>
                    <div className="text-sm font-black text-zinc-500">
                      {lang === "uz" ? "Eski narx bo‘yicha" : "По старой цене"}
                    </div>

                    <div className="mt-1 text-2xl font-black text-zinc-400 line-through">
                      {formatPrice(totals.oldTotal)}
                    </div>
                  </>
                )}

                <div className="mt-4 text-sm font-black text-zinc-500">
                  {lang === "uz" ? "Hozirgi narx" : "Текущая цена"}
                </div>

                <div className="mt-1 text-4xl font-black text-orange-500">
                  {formatPrice(totals.currentTotal)}
                </div>

                {totals.saved > 0 && (
                  <div className="mt-4 rounded-2xl bg-green-500/10 p-4">
                    <div className="text-sm font-black text-green-600">
                      {lang === "uz" ? "Siz tejaysiz" : "Вы экономите"}
                    </div>

                    <div className="mt-1 text-3xl font-black text-green-600">
                      {formatPrice(totals.saved)}
                    </div>

                    <div className="mt-1 text-sm font-black text-green-600">
                      -{totals.savedPercent}%
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-5 text-center font-black text-white"
                >
                  {lang === "uz"
                    ? "Buyurtmani rasmiylashtirish"
                    : "Оформить заказ"}
                </Link>

                <button
                  onClick={cleanCart}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-red-500 px-6 py-4 font-black text-red-500"
                >
                  <Trash2 size={18} />
                  {lang === "uz" ? "Savatni tozalash" : "Очистить корзину"}
                </button>
              </div>
            </aside>
          </div>
        )}
      </section>

      <Footer />
      <TelegramButton />
      <MobileBottomNav />
    </main>
  );
}