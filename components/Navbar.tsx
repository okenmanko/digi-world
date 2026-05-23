"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Moon,
  Search,
  ShoppingCart,
  Sun,
  Menu,
  User,
  Heart,
  Scale,
  Home,
} from "lucide-react";

import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const router = useRouter();

  const {
    lang,
    setLang,
    dark,
    setDark,
    logged,
    cartCount,
    favoritesCount,
    compareCount,
  } = useApp();

  const [search, setSearch] = useState("");

  const input = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const header = dark ? "border-white/10 bg-[#050505]/90" : "border-black/10 bg-white/90";

  const badge =
    "absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-black text-white";

  function submitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      router.push("/catalog");
      return;
    }

    router.push(`/catalog?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <header className={`sticky top-0 z-50 h-[92px] border-b backdrop-blur-xl ${header}`}>
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-4 px-5">
          <Link href="/" className="flex h-[70px] w-[70px] items-center justify-center">
            <Image
              src="/logo.png"
              alt="Digi World"
              width={70}
              height={70}
              className="h-[70px] w-[70px] object-contain"
              priority
            />
          </Link>

          <Link
            href="/catalog"
            className="hidden items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-5 py-3 font-black text-white md:flex"
          >
            <Menu size={19} />
            {lang === "uz" ? "Katalog" : "Каталог"}
          </Link>

          <form
            onSubmit={submitSearch}
            className={`hidden flex-1 items-center gap-3 rounded-2xl border px-4 py-3 lg:flex ${input}`}
          >
            <Search className="text-orange-500" size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "uz" ? "Mahsulot qidirish..." : "Поиск товаров..."}
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/favorites" className={`relative hidden rounded-2xl border p-3 md:block ${input}`}>
              <Heart size={20} />
              {favoritesCount > 0 && <span className={badge}>{favoritesCount}</span>}
            </Link>

            <Link href="/compare" className={`relative hidden rounded-2xl border p-3 md:block ${input}`}>
              <Scale size={20} />
              {compareCount > 0 && <span className={badge}>{compareCount}</span>}
            </Link>

            <Link href="/cart" className={`relative rounded-2xl border p-3 ${input}`}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className={badge}>{cartCount}</span>}
            </Link>

            <Link href={logged ? "/profile" : "/login"} className={`rounded-2xl border p-3 ${input}`}>
              <User size={20} />
            </Link>

            <button onClick={() => setDark(!dark)} className={`rounded-2xl border p-3 ${input}`}>
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className={`flex gap-1 rounded-2xl border p-1 ${input}`}>
              {(["uz", "ru"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setLang(item)}
                  className={`rounded-xl px-3 py-2 text-xs font-black ${
                    lang === item ? "bg-orange-500 text-white" : "opacity-60"
                  }`}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={submitSearch} className="mx-auto block max-w-[1440px] px-5 pb-4 lg:hidden">
          <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${input}`}>
            <Search className="text-orange-500" size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "uz" ? "Mahsulot qidirish..." : "Поиск товаров..."}
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>
        </form>
      </header>

      <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl md:hidden ${header}`}>
        <div className="grid grid-cols-5 px-2 py-2">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs font-black">
            <Home size={20} />
            {lang === "uz" ? "Bosh" : "Главная"}
          </Link>

          <Link href="/catalog" className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs font-black">
            <Menu size={20} />
            {lang === "uz" ? "Katalog" : "Каталог"}
          </Link>

          <Link href="/favorites" className="relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs font-black">
            <Heart size={20} />
            {favoritesCount > 0 && <span className={badge}>{favoritesCount}</span>}
            {lang === "uz" ? "Like" : "Избр."}
          </Link>

          <Link href="/compare" className="relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs font-black">
            <Scale size={20} />
            {compareCount > 0 && <span className={badge}>{compareCount}</span>}
            {lang === "uz" ? "Compare" : "Сравн."}
          </Link>

          <Link href="/cart" className="relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs font-black">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className={badge}>{cartCount}</span>}
            {lang === "uz" ? "Savat" : "Корз."}
          </Link>
        </div>
      </nav>
    </>
  );
}