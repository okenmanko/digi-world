"use client";

import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";

import { useApp } from "@/context/AppContext";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { type MergedProduct } from "@/lib/mergedProducts";

type Props = {
  products: MergedProduct[];
};

export default function RelatedProducts({
  products,
}: Props) {
  const {
    lang,
    dark,
    refreshCartCount,
  } = useApp();

  const theme = {
    card: dark
      ? "border-white/10 bg-white/[0.04]"
      : "border-black/10 bg-white",

    input: dark
      ? "border-white/10 bg-white/5 text-white"
      : "border-black/10 bg-white text-zinc-950",
  };

  function handleAdd(slug: string) {
    addToCart(slug);
    refreshCartCount();
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-3xl font-black md:text-5xl">
        {lang === "uz"
          ? "O‘xshash mahsulotlar"
          : "Похожие товары"}
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.slug}
            className={`rounded-[30px] border p-4 ${theme.card}`}
          >
            <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-[24px] bg-white">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[200px] w-full object-contain"
                />
              ) : (
                <div className="text-7xl">
                  {product.emoji}
                </div>
              )}
            </div>

            <h3 className="mt-4 line-clamp-2 min-h-14 text-lg font-black">
              {product.name}
            </h3>

            <div className="mt-3 text-2xl font-black text-orange-500">
              {formatPrice(product.price)}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  handleAdd(product.slug)
                }
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-4 py-3 font-black text-white"
              >
                <ShoppingCart size={18} />
                {lang === "uz"
                  ? "Savatga"
                  : "В корзину"}
              </button>

              <Link
                href={`/product/${product.slug}`}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-black ${theme.input}`}
              >
                <Eye size={18} />
                {lang === "uz"
                  ? "Ko‘rish"
                  : "Открыть"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}