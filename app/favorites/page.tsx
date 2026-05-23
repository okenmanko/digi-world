"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { getFavorites, removeFromFavorites, type FavoriteItem } from "@/lib/favorites";
import { addToCart } from "@/lib/cart";
import { formatPrice, products } from "@/lib/products";

export default function FavoritesPage() {
  const { lang, dark, refreshCartCount, refreshFavoritesCount } = useApp();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function reload() {
    setFavorites(getFavorites());
    refreshFavoritesCount();
  }

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const favoriteProducts = favorites
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
          <div className="flex items-center gap-3">
            <Heart className="text-orange-500" size={34} />

            <h1 className="text-4xl font-black md:text-6xl">
              {lang === "uz" ? "Sevimlilar" : "Избранное"}
            </h1>
          </div>

          <p className={`mt-4 text-lg ${theme.soft}`}>
            {lang === "uz" ? "Saqlangan mahsulotlaringiz." : "Ваши сохранённые товары."}
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className={`mt-6 rounded-[32px] border p-10 text-center ${theme.card}`}>
            <Heart className="mx-auto text-orange-500" size={48} />

            <h2 className="mt-5 text-2xl font-black">
              {lang === "uz" ? "Sevimlilar bo‘sh" : "Избранное пусто"}
            </h2>

            <Link
              href="/catalog"
              className="mt-6 inline-flex rounded-2xl bg-orange-500 px-7 py-4 font-black text-white"
            >
              {lang === "uz" ? "Katalogga o‘tish" : "Перейти в каталог"}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProducts.map(
              (product) =>
                product && (
                  <div key={product.slug} className={`rounded-[30px] border p-4 ${theme.card}`}>
                    <div className="flex h-52 items-center justify-center rounded-[24px] bg-gradient-to-br from-orange-500/10 to-red-500/10">
                      <div className="text-7xl">{product.emoji}</div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 inline-flex rounded-full bg-orange-500/10 px-3 py-1 text-xs font-black text-orange-500">
                        {lang === "uz" ? product.categoryUz : product.categoryRu}
                      </div>

                      <h3 className="min-h-12 text-lg font-black">
                        {product.name}
                      </h3>

                      <p className={`mt-2 min-h-10 text-sm font-medium ${theme.soft}`}>
                        {lang === "uz" ? product.shortUz : product.shortRu}
                      </p>

                      <div className="mt-4 text-xl font-black">
                        {formatPrice(product.price)}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
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
                            removeFromFavorites(product.slug);
                            reload();
                          }}
                          className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-black ${theme.input}`}
                        >
                          <Trash2 size={18} />
                          {lang === "uz" ? "O‘chirish" : "Удалить"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </section>
    </main>
  );
}