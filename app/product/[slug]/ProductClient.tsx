"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import RelatedProducts from "@/components/RelatedProducts";

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

  const [allProducts, setAllProducts] = useState<MergedProduct[]>([]);
  const [product, setProduct] = useState<MergedProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const [favorite, setFavorite] = useState(false);
  const [compare, setCompare] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadProduct() {
      const data = await getFullMergedProducts();
      const found = data.find((item) => item.slug === slug) || null;

      setAllProducts(data);
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
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 1700);
  }

  const discount = useMemo(() => {
    if (!product?.oldPrice || product.oldPrice <= product.price) return 0;

    return Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100
    );
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return allProducts
      .filter((item) => {
        const sameCategory =
          item.categoryUz === product.categoryUz ||
          item.categoryRu === product.categoryRu;

        return sameCategory && item.slug !== product.slug;
      })
      .slice(0, 4);
  }, [allProducts, product]);

  if (loading) {
    return (
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-2xl font-black text-orange-500">
            Loading...
          </div>
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
    {
      label: lang === "uz" ? "Kategoriya" : "Категория",
      value: lang === "uz" ? product.categoryUz : product.categoryRu,
    },
    {
      label: lang === "uz" ? "Status" : "Статус",
      value: product.inStock
        ? lang === "uz"
          ? "Omborda bor"
          : "В наличии"
        : lang === "uz"
        ? "Omborda yo‘q"
        : "Нет в наличии",
    },
    {
      label: lang === "uz" ? "Reyting" : "Рейтинг",
      value: `★ ${product.rating}`,
    },
  ];

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />
      <Toast message={toast} dark={dark} />

      <section className="mx-auto max-w-[1440px] px-5 py-7">
        <Link
          href="/catalog"
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-orange-500"
        >
          <ArrowLeft size={17} />
          {lang === "uz" ? "Katalogga qaytish" : "Вернуться в каталог"}
        </Link>

        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className={`rounded-[30px] border p-5 ${theme.card}`}>
            <div className="relative flex min-h-[420px] items-center justify-center rounded-[24px] bg-white p-6">
              {discount > 0 && (
                <div className="absolute left-4 top-4 rounded-full bg-green-500 px-4 py-2 text-sm font-black text-white">
                  -{discount}%
                </div>
              )}

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[360px] max-w-full object-contain"
                />
              ) : (
                <div className="text-[140px]">{product.emoji || "📦"}</div>
              )}
            </div>
          </div>

          <aside className={`h-fit rounded-[30px] border p-5 ${theme.card}`}>
            <div className="inline-flex rounded-full bg-orange-500/10 px-4 py-2 text-xs font-black text-orange-500">
              {product.inStock
                ? lang === "uz"
                  ? "Omborda bor"
                  : "Есть в наличии"
                : lang === "uz"
                ? "Omborda yo‘q"
                : "Нет в наличии"}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
              {product.name}
            </h1>

            <p className={`mt-4 text-base font-medium leading-relaxed ${theme.soft}`}>
              {lang === "uz" ? product.shortUz : product.shortRu}
            </p>

            <div className="mt-4 flex items-center gap-1 text-orange-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={17} fill="currentColor" />
              ))}

              <span className={`ml-2 text-sm font-black ${theme.soft}`}>
                {product.rating}
              </span>
            </div>

            <div className="mt-6 rounded-[24px] bg-orange-500/10 p-5">
              {product.oldPrice && product.oldPrice > product.price && (
                <div className="text-lg font-black text-zinc-400 line-through">
                  {formatPrice(product.oldPrice)}
                </div>
              )}

              <div className="mt-1 text-4xl font-black text-orange-500">
                {formatPrice(product.price)}
              </div>

              {product.oldPrice && product.oldPrice > product.price && (
                <div className="mt-3 inline-flex rounded-full bg-green-500/10 px-4 py-2 text-sm font-black text-green-600">
                  {lang === "uz" ? "Tejaysiz: " : "Выгода: "}
                  {formatPrice(product.oldPrice - product.price)}
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-4 text-base font-black text-white"
              >
                <ShoppingCart size={21} />
                {lang === "uz" ? "Savatga qo‘shish" : "Добавить в корзину"}
              </button>

              <a
                href={`https://t.me/GulinkaDW?text=${telegramMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-base font-black ${theme.input}`}
              >
                <MessageCircle size={21} />
                {lang === "uz"
                  ? "Telegram orqali buyurtma"
                  : "Заказать в Telegram"}
              </a>

              <a
                href="tel:+998901234567"
                className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-base font-black ${theme.input}`}
              >
                <Phone size={21} />
                {lang === "uz" ? "Telefon qilish" : "Позвонить"}
              </a>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={handleFavorite}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black ${
                  favorite
                    ? "border-orange-500 bg-orange-500 text-white"
                    : theme.input
                }`}
              >
                <Heart size={18} fill={favorite ? "currentColor" : "none"} />
                {lang === "uz" ? "Sevimli" : "Избранное"}
              </button>

              <button
                onClick={handleCompare}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black ${
                  compare
                    ? "border-orange-500 bg-orange-500 text-white"
                    : theme.input
                }`}
              >
                <Scale size={18} />
                {lang === "uz" ? "Taqqoslash" : "Сравнить"}
              </button>
            </div>
          </aside>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className={`rounded-[30px] border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-black">
              {lang === "uz" ? "Tavsif" : "Описание"}
            </h2>

            <p className={`mt-4 whitespace-pre-line text-base font-medium leading-relaxed ${theme.soft}`}>
              {lang === "uz" ? product.descriptionUz : product.descriptionRu}
            </p>
          </div>

          <div className={`rounded-[30px] border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-black">
              {lang === "uz" ? "Xarakteristikalar" : "Характеристики"}
            </h2>

            <div className="mt-4 grid gap-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${theme.input}`}
                >
                  <span className={`text-sm font-black ${theme.soft}`}>
                    {spec.label}
                  </span>

                  <span className="text-right text-sm font-black">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3">
              <div className={`rounded-2xl border p-4 ${theme.input}`}>
                <div className="flex items-center gap-2 font-black text-orange-500">
                  <ShieldCheck size={20} />
                  {lang === "uz" ? "Kafolat" : "Гарантия"}
                </div>

                <p className={`mt-2 text-sm ${theme.soft}`}>
                  {lang === "uz"
                    ? "Mahsulot kafolat asosida taqdim etiladi."
                    : "Товар предоставляется с гарантией."}
                </p>
              </div>

              <div className={`rounded-2xl border p-4 ${theme.input}`}>
                <div className="flex items-center gap-2 font-black text-orange-500">
                  <Truck size={20} />
                  {lang === "uz" ? "Yetkazib berish" : "Доставка"}
                </div>

                <p className={`mt-2 text-sm ${theme.soft}`}>
                  {lang === "uz"
                    ? "Toshkent va viloyatlarga yetkazib berish mavjud."
                    : "Доставка по Ташкенту и регионам."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts products={relatedProducts} />
      </section>
    </main>
  );
}