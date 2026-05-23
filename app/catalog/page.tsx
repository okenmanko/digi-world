"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Heart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import { useApp } from "@/context/AppContext";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { categories } from "@/lib/categories";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";

type SortType = "default" | "cheap" | "expensive" | "rating" | "stock";

export default function CatalogPage() {
  const { lang, dark, refreshCartCount, refreshFavoritesCount } = useApp();

  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortType>("default");
  const [toast, setToast] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      const data = await getFullMergedProducts();
      setProducts(data);
    }

    loadProducts();
  }, [refreshKey]);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark
      ? "border-white/10 bg-white/5 text-white"
      : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    let result = products.filter((p) =>
      [p.name, p.categoryUz, p.categoryRu, p.shortUz, p.shortRu]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );

    if (sort === "cheap") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "expensive") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    if (sort === "stock") result = result.filter((p) => p.inStock);

    return result;
  }, [products, query, sort]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 1600);
  }

  function handleAdd(slug: string) {
    addToCart(slug);
    refreshCartCount();
    showToast(lang === "uz" ? "Savatga qo‘shildi" : "Добавлено в корзину");
  }

  function handleFavorite(slug: string) {
    toggleFavorite(slug);
    refreshFavoritesCount();
    setRefreshKey((x) => x + 1);
    showToast(lang === "uz" ? "Sevimlilar yangilandi" : "Избранное обновлено");
  }

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />
      <Toast message={toast} dark={dark} />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
          <h1 className="text-4xl font-black md:text-6xl">
            {lang === "uz" ? "Katalog" : "Каталог"}
          </h1>

          <p className={`mt-3 text-lg font-medium ${theme.soft}`}>
            {lang === "uz" ? "Digi World mahsulotlari" : "Товары Digi World"}
          </p>

          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                className={`whitespace-nowrap rounded-2xl border px-5 py-3 text-sm font-black ${theme.input}`}
              >
                {lang === "uz" ? cat.nameUz : cat.nameRu}
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_260px]">
            <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${theme.input}`}>
              <Search className="text-orange-500" size={22} />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "uz" ? "Mahsulot qidirish..." : "Поиск товара..."}
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${theme.input}`}>
              <SlidersHorizontal className="text-orange-500" size={22} />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="w-full bg-transparent font-black outline-none"
              >
                <option value="default">{lang === "uz" ? "Standart" : "Стандарт"}</option>
                <option value="cheap">{lang === "uz" ? "Arzon → qimmat" : "Дешёвые → дорогие"}</option>
                <option value="expensive">{lang === "uz" ? "Qimmat → arzon" : "Дорогие → дешёвые"}</option>
                <option value="rating">{lang === "uz" ? "Rating bo‘yicha" : "По рейтингу"}</option>
                <option value="stock">{lang === "uz" ? "Faqat ombordagi" : "Только в наличии"}</option>
              </select>
            </div>
          </div>

          <div className={`mt-4 text-sm font-black ${theme.soft}`}>
            {lang === "uz" ? `${filtered.length} ta mahsulot` : `${filtered.length} товаров`}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={`mt-6 rounded-[32px] border p-10 text-center ${theme.card}`}>
            <Search className="mx-auto text-orange-500" size={48} />
            <h2 className="mt-5 text-2xl font-black">
              {lang === "uz" ? "Mahsulot topilmadi" : "Товар не найден"}
            </h2>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => {
              const fav = isFavorite(product.slug);

              return (
                <div
                  key={`${product.slug}-${refreshKey}`}
                  className={`rounded-[30px] border p-4 ${theme.card}`}
                >
                  <div className="relative flex h-[240px] items-center justify-center overflow-hidden rounded-[24px] bg-white">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-[220px] w-full object-contain"
                      />
                    ) : (
                      <div className="text-7xl">{product.emoji}</div>
                    )}

                    <button
                      onClick={() => handleFavorite(product.slug)}
                      className={`absolute right-3 top-3 rounded-2xl border p-3 ${
                        fav
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-black/10 bg-white text-zinc-950"
                      }`}
                    >
                      <Heart size={18} fill={fav ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <h2 className="mt-4 line-clamp-2 min-h-14 text-lg font-black">
                    {product.name}
                  </h2>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        product.inStock
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {product.inStock
                        ? lang === "uz"
                          ? "Omborda bor"
                          : "В наличии"
                        : lang === "uz"
                        ? "Yo‘q"
                        : "Нет"}
                    </span>

                    <span className="text-sm font-black text-orange-500">
                      ★ {product.rating}
                    </span>
                  </div>

                  <div className="mt-4 text-2xl font-black text-orange-500">
                    {formatPrice(product.price)}
                  </div>

                  {product.oldPrice && (
                    <div className="text-sm font-bold text-zinc-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAdd(product.slug)}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-4 py-3 font-black text-white"
                    >
                      <ShoppingCart size={18} />
                      {lang === "uz" ? "Savatga" : "В корзину"}
                    </button>

                    <Link
                      href={`/product/${product.slug}`}
                      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-black ${theme.input}`}
                    >
                      <Eye size={18} />
                      {lang === "uz" ? "Ko‘rish" : "Открыть"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}