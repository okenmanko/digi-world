"use client";

import { SlidersHorizontal } from "lucide-react";

import { useApp } from "@/context/AppContext";

export type CatalogSort =
  | "default"
  | "newest"
  | "cheap"
  | "expensive"
  | "stock";

type Props = {
  sort: CatalogSort;
  setSort: (sort: CatalogSort) => void;
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
};

export default function CatalogFilters({
  sort,
  setSort,
  category,
  setCategory,
  categories,
}: Props) {
  const { lang, dark } = useApp();

  const theme = {
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  return (
    <div className={`rounded-[28px] border p-5 ${theme.card}`}>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="text-orange-500" size={22} />
        <h3 className="text-xl font-black">
          {lang === "uz" ? "Filterlar" : "Фильтры"}
        </h3>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className={`mb-2 block text-sm font-black ${theme.soft}`}>
            {lang === "uz" ? "Kategoriya" : "Категория"}
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full rounded-2xl border px-5 py-4 font-black outline-none ${theme.input}`}
          >
            <option value="all">
              {lang === "uz" ? "Barchasi" : "Все"}
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`mb-2 block text-sm font-black ${theme.soft}`}>
            {lang === "uz" ? "Saralash" : "Сортировка"}
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as CatalogSort)}
            className={`w-full rounded-2xl border px-5 py-4 font-black outline-none ${theme.input}`}
          >
            <option value="default">
              {lang === "uz" ? "Standart" : "Стандарт"}
            </option>

            <option value="newest">
              {lang === "uz" ? "Yangi mahsulotlar" : "Новые товары"}
            </option>

            <option value="cheap">
              {lang === "uz" ? "Arzon → qimmat" : "Дешёвые → дорогие"}
            </option>

            <option value="expensive">
              {lang === "uz" ? "Qimmat → arzon" : "Дорогие → дешёвые"}
            </option>

            <option value="stock">
              {lang === "uz" ? "Faqat ombordagi" : "Только в наличии"}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}