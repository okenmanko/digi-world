"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { useApp } from "@/context/AppContext";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";
import { formatPrice } from "@/lib/products";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: Props) {
  const { lang, dark } = useApp();

  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getFullMergedProducts();
      setProducts(data);
    }

    if (open) load();
  }, [open]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return products.slice(0, 8);

    return products
      .filter((p) =>
        [p.name, p.categoryUz, p.categoryRu, p.shortUz, p.shortRu]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 12);
  }, [products, query]);

  if (!open) return null;

  const theme = {
    overlay: "fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm",
    card: dark
      ? "border-white/10 bg-[#111] text-white"
      : "border-black/10 bg-white text-zinc-950",
    input: dark
      ? "border-white/10 bg-white/5 text-white"
      : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  return (
    <div className={theme.overlay}>
      <div className="mx-auto max-w-[900px] px-5 py-8">
        <div className={`rounded-[32px] border p-5 ${theme.card}`}>
          <div className="flex items-center gap-3">
            <div className={`flex flex-1 items-center gap-3 rounded-2xl border px-5 py-4 ${theme.input}`}>
              <Search className="text-orange-500" size={22} />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  lang === "uz"
                    ? "Mahsulot qidirish..."
                    : "Поиск товара..."
                }
                className="w-full bg-transparent text-lg font-bold outline-none"
              />
            </div>

            <button
              onClick={onClose}
              className={`rounded-2xl border p-4 ${theme.input}`}
            >
              <X size={22} />
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {results.length === 0 ? (
              <div className={`rounded-2xl border p-6 text-center font-black ${theme.input}`}>
                {lang === "uz" ? "Mahsulot topilmadi" : "Товар не найден"}
              </div>
            ) : (
              results.map((product) => (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition hover:border-orange-500 ${theme.input}`}
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 object-contain"
                      />
                    ) : (
                      <div className="text-4xl">{product.emoji}</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-lg font-black">
                      {product.name}
                    </div>

                    <div className={`truncate text-sm font-bold ${theme.soft}`}>
                      {lang === "uz" ? product.categoryUz : product.categoryRu}
                    </div>
                  </div>

                  <div className="shrink-0 font-black text-orange-500">
                    {formatPrice(product.price)}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}