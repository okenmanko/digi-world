"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, ShoppingCart } from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";

type Props = {
  params: Promise<{
    category: string;
  }>;
};

export default function CategoryPage({ params }: Props) {
  const { category } = use(params);
  const { lang, dark, refreshCartCount } = useApp();

  const [products, setProducts] = useState<MergedProduct[]>([]);

  const currentCategory = getCategoryBySlug(category);

  useEffect(() => {
    async function load() {
      const data = await getFullMergedProducts();
      setProducts(data);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    if (!currentCategory) return [];

    return products.filter((product) => {
      const text = [
        product.name,
        product.categoryUz,
        product.categoryRu,
        product.shortUz,
        product.shortRu,
      ]
        .join(" ")
        .toLowerCase();

      return currentCategory.keywords.some((key) =>
        text.includes(key.toLowerCase())
      );
    });
  }, [products, currentCategory]);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark
      ? "border-white/10 bg-white/5 text-white"
      : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  function handleAdd(slug: string) {
    addToCart(slug);
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
            {currentCategory
              ? lang === "uz"
                ? currentCategory.nameUz
                : currentCategory.nameRu
              : category}
          </h1>

          <p className={`mt-3 text-lg font-medium ${theme.soft}`}>
            {lang === "uz"
              ? `${filtered.length} ta mahsulot`
              : `${filtered.length} товаров`}
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <div
              key={product.slug}
              className={`rounded-[30px] border p-4 ${theme.card}`}
            >
              <div className="flex h-[240px] items-center justify-center overflow-hidden rounded-[24px] bg-white">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[220px] w-full object-contain"
                  />
                ) : (
                  <div className="text-7xl">{product.emoji}</div>
                )}
              </div>

              <h2 className="mt-4 line-clamp-2 min-h-14 text-lg font-black">
                {product.name}
              </h2>

              <div className="mt-4 text-2xl font-black text-orange-500">
                {formatPrice(product.price)}
              </div>

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
          ))}
        </div>
      </section>
    </main>
  );
}