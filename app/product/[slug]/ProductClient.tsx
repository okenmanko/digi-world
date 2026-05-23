"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Phone,
  Scale,
  ShoppingCart,
  Star,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import { useApp } from "@/context/AppContext";
import { addToCart } from "@/lib/cart";
import { toggleFavorite, isFavorite } from "@/lib/favorites";
import { toggleCompare, isCompare } from "@/lib/compare";
import { formatPrice } from "@/lib/products";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ProductClient({ params }: Props) {
  const { slug } = use(params);

  const {
    lang,
    dark,
    refreshCartCount,
    refreshFavoritesCount,
    refreshCompareCount,
  } = useApp();

  const [product, setProduct] = useState<MergedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [compare, setCompare] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadProduct() {
      const data = await getFullMergedProducts();
      const found = data.find((p) => p.slug === slug) || null;

      setProduct(found);

      if (found) {
        setFavorite(isFavorite(found.slug));
        setCompare(isCompare(found.slug));
      }

      setLoading(false);
    }

    loadProduct();
  }, [slug]);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 1800);
  }

  if (loading) {
    return (
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-2xl font-black text-orange-500">Loading...</div>
        </div>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  function handleAdd() {
    if (!product) return;

    addToCart(product.slug);
    refreshCartCount();

    showToast(lang === "uz" ? "Savatga qo‘shildi" : "Добавлено в корзину");
  }

  function handleFavorite() {
    if (!product) return;

    toggleFavorite(product.slug);
    setFavorite(isFavorite(product.slug));
    refreshFavoritesCount();

    showToast(lang === "uz" ? "Sevimlilar yangilandi" : "Избранное обновлено");
  }

  function handleCompare() {
    if (!product) return;

    toggleCompare(product.slug);
    setCompare(isCompare(product.slug));
    refreshCompareCount();

    showToast(lang === "uz" ? "Taqqoslash yangilandi" : "Сравнение обновлено");
  }

  const telegramMessage = encodeURIComponent(
    `Salom! Men ${product.name} mahsulotini buyurtma qilmoqchiman.`
  );

  const specs = [
    { label: "Kategoriya", value: product.categoryUz },
    {
      label: "Status",
      value: product.inStock ? "Omborda bor" : "Omborda yo‘q",
    },
  ];

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />
      <Toast message={toast} dark={dark} />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <Link
          href="/catalog"
          className="mb-6 inline-flex items-center gap-2 font-bold text-orange-500"
        >
          <ArrowLeft size={18} />
          {lang === "uz" ? "Katalogga qaytish" : "Вернуться в каталог"}
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_500px]">
          <div className={`rounded-[32px] border p-5 ${theme.card}`}>
            <div className="flex min-h-[460px] items-center justify-center rounded-[26px] bg-gradient-to-br from-orange-500/10 to-red-500/10">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[380px] max-w-full object-contain"
                />
              ) : (
                <div className="text-[150px] md:text-[220px]">
                  {product.emoji}
                </div>
              )}
            </div>
          </div>

          <div className={`rounded-[32px] border p-6 md:p-8 ${theme.card}`}>
            <div className="mb-4 inline-flex rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
              {product.inStock
                ? lang === "uz"
                  ? "Omborda bor"
                  : "Есть в наличии"
                : lang === "uz"
                ? "Omborda yo‘q"
                : "Нет в наличии"}
            </div>

            <h1 className="text-3xl font-black leading-tight md:text-5xl">
              {product.name}
            </h1>

            <p className={`mt-5 text-lg font-medium ${theme.soft}`}>
              {lang === "uz" ? product.shortUz : product.shortRu}
            </p>

            <div className="mt-5 flex items-center gap-1 text-orange-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} fill="currentColor" />
              ))}

              <span className={`ml-2 text-sm font-bold ${theme.soft}`}>
                {product.rating}
              </span>
            </div>

            <div className="mt-8">
              <div className="text-4xl font-black text-orange-500">
                {formatPrice(product.price)}
              </div>

              {product.oldPrice && (
                <div className="mt-1 text-lg font-bold text-zinc-400 line-through">
                  {formatPrice(product.oldPrice)}
                </div>
              )}
            </div>

            <div className="mt-7 grid gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 text-lg font-black text-white"
              >
                <ShoppingCart size={22} />
                {lang === "uz" ? "Savatga qo‘shish" : "Добавить в корзину"}
              </button>

              <a
                href={`https://t.me/GulinkaDW?text=${telegramMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 rounded-2xl border px-7 py-4 text-lg font-black ${theme.input}`}
              >
                <MessageCircle size={22} />
                {lang === "uz" ? "Telegram orqali buyurtma" : "Заказать в Telegram"}
              </a>

              <a
                href="tel:+998901234567"
                className={`flex items-center justify-center gap-2 rounded-2xl border px-7 py-4 text-lg font-black ${theme.input}`}
              >
                <Phone size={22} />
                {lang === "uz" ? "Telefon qilish" : "Позвонить"}
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleFavorite}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-black ${
                  favorite
                    ? "border-orange-500 bg-orange-500 text-white"
                    : theme.input
                }`}
              >
                <Heart size={18} fill={favorite ? "currentColor" : "none"} />
                {lang === "uz" ? "Sevimlilar" : "Избранное"}
              </button>

              <button
                onClick={handleCompare}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-black ${
                  compare
                    ? "border-orange-500 bg-orange-500 text-white"
                    : theme.input
                }`}
              >
                <Scale size={18} />
                {lang === "uz" ? "Taqqoslash" : "Сравнить"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className={`rounded-[32px] border p-6 md:p-8 ${theme.card}`}>
            <h2 className="text-2xl font-black md:text-3xl">
              {lang === "uz" ? "Tavsif" : "Описание"}
            </h2>

            <p className={`mt-5 text-lg font-medium leading-relaxed ${theme.soft}`}>
              {lang === "uz" ? product.descriptionUz : product.descriptionRu}
            </p>
          </div>

          <div className={`rounded-[32px] border p-6 md:p-8 ${theme.card}`}>
            <h2 className="text-2xl font-black md:text-3xl">
              {lang === "uz" ? "Xarakteristikalar" : "Характеристики"}
            </h2>

            <div className="mt-5 space-y-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${theme.input}`}
                >
                  <span className={`font-bold ${theme.soft}`}>
                    {spec.label}
                  </span>

                  <span className="font-black">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}