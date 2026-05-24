"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Heart,
  Menu,
  Moon,
  Scale,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import { useApp } from "@/context/AppContext";
import SearchOverlay from "@/components/SearchOverlay";

export default function Navbar() {
  const {
    lang,
    setLang,
    dark,
    setDark,
    cartCount,
    favoritesCount,
    compareCount,
    logged,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const theme = {
    nav: dark
      ? "border-white/10 bg-[#050505]/85 text-white"
      : "border-black/10 bg-white/85 text-zinc-950",

    button: dark
      ? "border-white/10 bg-white/5"
      : "border-black/10 bg-white",

    soft: dark ? "text-zinc-400" : "text-zinc-600",

    drawer: dark
      ? "border-white/10 bg-[#111] text-white"
      : "border-black/10 bg-white text-zinc-950",
  };

  return (
    <>
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between rounded-[24px] border px-5 py-4 backdrop-blur-xl ${theme.nav}`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border lg:hidden ${theme.button}`}
            >
              <Menu size={20} />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white">
                <Image
                  src="/logo.png"
                  alt="Digi World"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>

              <div>
                <div className="text-[18px] font-black">
                  Digi World
                </div>

                <div
                  className={`text-[11px] font-bold ${theme.soft}`}
                >
                  Electronics Store
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <Search size={19} />
            </button>

            <button
              onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
              className={`hidden rounded-2xl border px-4 py-3 text-sm font-black md:flex ${theme.button}`}
            >
              {lang === "uz" ? "RU" : "UZ"}
            </button>

            <button
              onClick={() => setDark(!dark)}
              className={`hidden h-11 w-11 items-center justify-center rounded-2xl border md:flex ${theme.button}`}
            >
              <Moon size={19} />
            </button>

            <Link
              href="/favorites"
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <Heart size={19} />

              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="/compare"
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <Scale size={19} />

              {compareCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <ShoppingCart size={19} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href={logged ? "/profile" : "/login"}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <User size={19} />
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm lg:hidden">
          <div
            className={`absolute left-0 top-0 h-full w-[300px] border-r p-5 ${theme.drawer}`}
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="text-2xl font-black">
                Digi World
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${theme.button}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl border px-5 py-4 text-lg font-black ${theme.button}`}
              >
                {lang === "uz" ? "Bosh sahifa" : "Главная"}
              </Link>

              <Link
                href="/catalog"
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl border px-5 py-4 text-lg font-black ${theme.button}`}
              >
                {lang === "uz" ? "Katalog" : "Каталог"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}