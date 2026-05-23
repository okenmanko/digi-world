"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Scale,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import {
  getCompare,
  removeFromCompare,
  clearCompare,
  type CompareItem,
} from "@/lib/compare";
import { addToCart } from "@/lib/cart";
import { formatPrice, products } from "@/lib/products";

export default function ComparePage() {
  const {
    lang,
    dark,
    refreshCartCount,
    refreshCompareCount,
  } = useApp();

  const [compare, setCompare] = useState<CompareItem[]>([]);

  useEffect(() => {
    setCompare(getCompare());
  }, []);

  function reload() {
    setCompare(getCompare());
    refreshCompareCount();
  }

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const compareProducts = compare
    .map((item) => products.find((p) => p.slug === item.slug))
    .filter(Boolean);

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <Link
          href="/catalog"
          className="mb-6 inline-flex items-center gap-2 font-bold text-orange-500"
        >
          <ArrowLeft size={18} />
          {lang === "uz" ? "Katalogga qaytish" : "Вернуться в каталог"}
        </Link>

        <div className={`rounded-[32px] border p-6 md:p-8 ${theme.card}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Scale className="text-orange-500" size={34} />

                <h1 className="text-4xl font-black md:text-6xl">
                  {lang === "uz" ? "Taqqoslash" : "Сравнение"}
                </h1>
              </div>

              <p className={`mt-4 text-lg ${theme.soft}`}>
                {lang === "uz"
                  ? "Mahsulotlarni yonma-yon taqqoslang."
                  : "Сравните товары рядом."}
              </p>
            </div>

            {compareProducts.length > 0 && (
              <button
                onClick={() => {
                  clearCompare();
                  reload();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 px-5 py-3 font-black text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={18} />
                {lang === "uz" ? "Tozalash" : "Очистить"}
              </button>
            )}
          </div>
        </div>

        {compareProducts.length === 0 ? (
          <div className={`mt-6 rounded-[32px] border p-10 text-center ${theme.card}`}>
            <Scale className="mx-auto text-orange-500" size={48} />

            <h2 className="mt-5 text-2xl font-black">
              {lang === "uz" ? "Taqqoslash ro‘yxati bo‘sh" : "Список сравнения пуст"}
            </h2>

            <Link
              href="/catalog"
              className="mt-6 inline-flex rounded-2xl bg-orange-500 px-7 py-4 font-black text-white"
            >
              {lang === "uz" ? "Katalogga o‘tish" : "Перейти в каталог"}
            </Link>
          </div>
        ) : (
          <div className={`mt-6 overflow-x-auto rounded-[32px] border p-4 ${theme.card}`}>
            <div
              className="grid min-w-[900px] gap-4"
              style={{
                gridTemplateColumns: `220px repeat(${compareProducts.length}, minmax(240px, 1fr))`,
              }}
            >
              <div className={`rounded-3xl border p-5 font-black ${theme.input}`}>
                {lang === "uz" ? "Parametr" : "Параметр"}
              </div>

              {compareProducts.map(
                (product) =>
                  product && (
                    <div key={product.slug} className={`rounded-3xl border p-5 ${theme.input}`}>
                      <div className="flex h-40 items-center justify-center rounded-2xl bg-orange-500/10 text-7xl">
                        {product.emoji}
                      </div>

                      <h3 className="mt-4 text-lg font-black">
                        {product.name}
                      </h3>

                      <div className="mt-3 text-xl font-black text-orange-500">
                        {formatPrice(product.price)}
                      </div>

                      <div className="mt-4 grid gap-2">
                        <button
                          onClick={() => {
                            addToCart(product.slug);
                            refreshCartCount();
                          }}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-4 py-3 font-black text-white"
                        >
                          <ShoppingCart size={18} />
                          {lang === "uz" ? "Savatga" : "В корзину"}
                        </button>

                        <button
                          onClick={() => {
                            removeFromCompare(product.slug);
                            reload();
                          }}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 px-4 py-3 font-black text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={18} />
                          {lang === "uz" ? "O‘chirish" : "Удалить"}
                        </button>
                      </div>
                    </div>
                  )
              )}

              <div className={`rounded-3xl border p-5 font-black ${theme.input}`}>
                {lang === "uz" ? "Kategoriya" : "Категория"}
              </div>
              {compareProducts.map(
                (product) =>
                  product && (
                    <div key={`${product.slug}-cat`} className={`rounded-3xl border p-5 font-bold ${theme.input}`}>
                      {lang === "uz" ? product.categoryUz : product.categoryRu}
                    </div>
                  )
              )}

              <div className={`rounded-3xl border p-5 font-black ${theme.input}`}>
                {lang === "uz" ? "Narx" : "Цена"}
              </div>
              {compareProducts.map(
                (product) =>
                  product && (
                    <div key={`${product.slug}-price`} className={`rounded-3xl border p-5 font-black text-orange-500 ${theme.input}`}>
                      {formatPrice(product.price)}
                    </div>
                  )
              )}

              <div className={`rounded-3xl border p-5 font-black ${theme.input}`}>
                Rating
              </div>
              {compareProducts.map(
                (product) =>
                  product && (
                    <div key={`${product.slug}-rating`} className={`rounded-3xl border p-5 font-bold ${theme.input}`}>
                      {product.rating}
                    </div>
                  )
              )}

              <div className={`rounded-3xl border p-5 font-black ${theme.input}`}>
                Stock
              </div>
              {compareProducts.map(
                (product) =>
                  product && (
                    <div key={`${product.slug}-stock`} className={`rounded-3xl border p-5 font-bold ${theme.input}`}>
                      {product.inStock
                        ? lang === "uz"
                          ? "Omborda bor"
                          : "Есть в наличии"
                        : "Out of stock"}
                    </div>
                  )
              )}

              <div className={`rounded-3xl border p-5 font-black ${theme.input}`}>
                {lang === "uz" ? "Tavsif" : "Описание"}
              </div>
              {compareProducts.map(
                (product) =>
                  product && (
                    <div key={`${product.slug}-desc`} className={`rounded-3xl border p-5 text-sm font-medium leading-relaxed ${theme.input}`}>
                      {lang === "uz" ? product.shortUz : product.shortRu}
                    </div>
                  )
              )}

              <div className={`rounded-3xl border p-5 font-black ${theme.input}`}>
                Specs
              </div>
              {compareProducts.map(
                (product) =>
                  product && (
                    <div key={`${product.slug}-specs`} className={`rounded-3xl border p-5 ${theme.input}`}>
                      <div className="space-y-2">
                        {product.specs.map((spec) => (
                          <div key={spec.label} className="text-sm">
                            <span className={`font-bold ${theme.soft}`}>{spec.label}: </span>
                            <span className="font-black">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}