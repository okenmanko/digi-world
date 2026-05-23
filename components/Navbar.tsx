"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  Scale,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import { useApp } from "@/context/AppContext";
import { getCart } from "@/lib/cart";
import { getFavorites } from "@/lib/favorites";
import { getCompare } from "@/lib/compare";
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

  useEffect(() => {
    if (!cartCount) {
      getCart();
    }

    if (!favoritesCount) {
      getFavorites();
    }

    if (!compareCount) {
      getCompare();
    }
  }, []);

  const theme = {
    nav: dark
      ? "border-white/10 bg-[#050505]/80 text-white"
      : "border-black/10 bg-white/80 text-zinc-950",

    soft: dark ? "text-zinc-400" : "text-zinc-600",

    card: dark
      ? "border-white/10 bg-white/[0.04]"
      : "border-black/10 bg-white",

    button: dark
      ? "border-white/10 bg-white/5"
      : "border-black/10 bg-white",
  };

  const navLinks = [
    {
      href: "/",
      labelUz: "Bosh sahifa",
      labelRu: "Главная",
    },
    {
      href: "/catalog",
      labelUz: "Katalog",
      labelRu: "Каталог",
    },
    {
      href: "/admin",
      labelUz: "Admin",
      labelRu: "Админ",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between rounded-[28px] border px-5 py-4 backdrop-blur-xl ${theme.nav}`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border lg:hidden ${theme.button}`}
            >
              <Menu size={22} />
            </button>

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-xl font-black text-white">
                D
              </div>

              <div>
                <div className="text-xl font-black">
                  Digi World
                </div>

                <div className={`text-xs font-bold ${theme.soft}`}>
                  Electronics Store
                </div>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-2xl border px-5 py-3 font-black transition hover:border-orange-500 ${theme.button}`}
              >
                {lang === "uz"
                  ? link.labelUz
                  : link.labelRu}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <Search size={20} />
            </button>

            <button
              onClick={() =>
                setLang(lang === "uz" ? "ru" : "uz")
              }
              className={`hidden rounded-2xl border px-4 py-3 font-black md:flex ${theme.button}`}
            >
              {lang === "uz" ? "RU" : "UZ"}
            </button>

            <button
              onClick={() => setDark(!dark)}
              className={`hidden rounded-2xl border px-4 py-3 font-black md:flex ${theme.button}`}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            <Link
              href="/favorites"
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <Heart size={20} />

              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-black text-white">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="/compare"
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <Scale size={20} />

              {compareCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-black text-white">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <ShoppingCart size={20} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href={logged ? "/profile" : "/login"}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${theme.button}`}
            >
              <User size={20} />
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm lg:hidden">
          <div
            className={`absolute left-0 top-0 h-full w-[320px] border-r p-5 ${theme.card}`}
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="text-2xl font-black">
                Digi World
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${theme.button}`}
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-2xl border px-5 py-4 text-lg font-black ${theme.button}`}
                >
                  {lang === "uz"
                    ? link.labelUz
                    : link.labelRu}
                </Link>
              ))}

              <button
                onClick={() =>
                  setLang(lang === "uz" ? "ru" : "uz")
                }
                className={`rounded-2xl border px-5 py-4 text-left text-lg font-black ${theme.button}`}
              >
                {lang === "uz"
                  ? "Русский язык"
                  : "O‘zbek tili"}
              </button>

              <button
                onClick={() => setDark(!dark)}
                className={`rounded-2xl border px-5 py-4 text-left text-lg font-black ${theme.button}`}
              >
                {dark
                  ? lang === "uz"
                    ? "Yorug‘ tema"
                    : "Светлая тема"
                  : lang === "uz"
                  ? "Qorong‘i tema"
                  : "Тёмная тема"}
              </button>
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