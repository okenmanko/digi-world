"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Heart, Search, ShoppingCart } from "lucide-react";

import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import CatalogFilters, { type CatalogSort } from "@/components/CatalogFilters";

import { useApp } from "@/context/AppContext";
import { addToCart, getCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";
import {
  getSupabaseCategories,
  type Category,
} from "@/lib/supabaseCategories";

export default function CatalogPage() {
  const { lang, dark, refreshCartCount, refreshFavoritesCount } = useApp();

  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<CatalogSort>("default");
  const [category, setCategory] = useState("all");
  const [toast, setToast] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function load() {
      const productData = await getFullMergedProducts();
      const categoryData = await getSupabaseCategories();

      setProducts(productData);
      setCategories(categoryData as Category[]);
    }

    load();
  }, [refreshKey]);

  const categoryNames = useMemo(() => {
    return categories.map((item) => (lang === "uz" ? item.name_uz : item.name_ru));
  }, [categories, lang]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    let result = products.filter((p) => {
      const productCategory = lang === "uz" ? p.categoryUz : p.categoryRu;
      const matchesCategory = category === "all" || productCategory === category;

      const matchesSearch = [
        p.name,
        p.categoryUz,
        p.categoryRu,
        p.shortUz,
        p.shortRu,
        p.descriptionUz,
        p.descriptionRu,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);

      return matchesCategory && matchesSearch;
    });

    if (sort === "newest") result = [...result].reverse();
    if (sort === "cheap") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "expensive") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "stock") result = result.filter((p) => p.inStock);

    return result;
  }, [products, query, sort, category, lang]);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 1600);
  }

  function isInCart(slug: string) {
    return getCart().some((item) => item.slug === slug);
  }

  function handleAdd(slug: string) {
    addToCart(slug);
    refreshCartCount();
    setRefreshKey((x) => x + 1);
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

      <section className="mx-auto max-w-[1440px] px-5 py-7">
        <div className={`rounded-[32px] border p-6 ${theme.card}`}>
          <h1 className="text-4xl font-black md:text-6xl">
            {lang === "uz" ? "Katalog" : "Каталог"}
          </h1>

          <p className={`mt-3 text-lg font-medium ${theme.soft}`}>
            {lang === "uz" ? "Digi World mahsulotlari" : "Товары Digi World"}
          </p>

          <div className={`mt-6 flex items-center gap-3 rounded-2xl border px-5 py-4 ${theme.input}`}>
            <Search className="text-orange-500" size={22} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "uz" ? "Mahsulot qidirish..." : "Поиск товара..."}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                category === "all"
                  ? "border-orange-500 bg-orange-500 text-white"
                  : theme.input
              }`}
            >
              {lang === "uz" ? "Barchasi" : "Все"}
            </button>

            {categoryNames.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                  category === item
                    ? "border-orange-500 bg-orange-500 text-white"
                    : theme.input
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className={`mt-4 text-sm font-black ${theme.soft}`}>
            {lang === "uz" ? `${filtered.length} ta mahsulot` : `${filtered.length} товаров`}
          </div>
        </div>

        <div className="mt-5">
          <CatalogFilters
            sort={sort}
            setSort={setSort}
            category={category}
            setCategory={setCategory}
            categories={categoryNames}
          />
        </div>

        {filtered.length === 0 ? (
          <div className={`mt-6 rounded-[30px] border p-10 text-center ${theme.card}`}>
            <Search className="mx-auto text-orange-500" size={48} />
            <h2 className="mt-5 text-2xl font-black">
              {lang === "uz" ? "Mahsulot topilmadi" : "Товар не найден"}
            </h2>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => {
              const fav = isFavorite(product.slug);
              const added = isInCart(product.slug);

              const hasDiscount =
                product.oldPrice && product.oldPrice > product.price;

              const discountPercent = hasDiscount
                ? Math.round(
                    ((Number(product.oldPrice) - product.price) /
                      Number(product.oldPrice)) *
                      100
                  )
                : 0;

              return (
                <div
                  key={`${product.slug}-${refreshKey}`}
                  className={`rounded-[30px] border p-4 ${theme.card}`}
                >
                  <div className="relative flex h-[240px] items-center justify-center overflow-hidden rounded-[24px] bg-white">
                    {hasDiscount && (
                      <div className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-2 text-xs font-black text-white">
                        -{discountPercent}%
                      </div>
                    )}

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-[220px] w-full object-contain"
                      />
                    ) : (
                      <div className="text-7xl">{product.emoji || "📦"}</div>
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

                  <div className="mt-4">
                    {hasDiscount && (
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-lg font-black text-zinc-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>

                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-black text-green-600">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}

                    <div className="text-3xl font-black text-orange-500">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAdd(product.slug)}
                      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black text-white ${
                        added
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-orange-400 to-red-500"
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {added
                        ? lang === "uz"
                          ? "Qo‘shildi"
                          : "Добавлено"
                        : lang === "uz"
                        ? "Savatga"
                        : "В корзину"}
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