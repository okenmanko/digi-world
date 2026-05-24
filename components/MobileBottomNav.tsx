"use client";

import Link from "next/link";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";

import { useApp } from "@/context/AppContext";

export default function MobileBottomNav() {
  const { dark, cartCount, lang } = useApp();

  const theme = {
    nav: dark
      ? "border-white/10 bg-[#050505]/95"
      : "border-black/10 bg-white/95",

    text: dark
      ? "text-zinc-400"
      : "text-zinc-600",
  };

  return (
    <div
      className={`
        fixed
        bottom-0
        left-0
        right-0
        z-[999]
        border-t
        backdrop-blur-xl
        md:hidden
        ${theme.nav}
      `}
    >
      <div className="grid grid-cols-4">
        {/* HOME */}
        <Link
          href="/"
          className={`
            flex
            flex-col
            items-center
            gap-1
            py-3
            text-xs
            font-black
            ${theme.text}
          `}
        >
          <Home size={22} />

          <span>
            {lang === "uz"
              ? "Bosh sahifa"
              : "Главная"}
          </span>
        </Link>

        {/* CATALOG */}
        <Link
          href="/catalog"
          className={`
            flex
            flex-col
            items-center
            gap-1
            py-3
            text-xs
            font-black
            ${theme.text}
          `}
        >
          <LayoutGrid size={22} />

          <span>
            {lang === "uz"
              ? "Katalog"
              : "Каталог"}
          </span>
        </Link>

        {/* CART */}
        <Link
          href="/cart"
          className={`
            relative
            flex
            flex-col
            items-center
            gap-1
            py-3
            text-xs
            font-black
            ${theme.text}
          `}
        >
          <div className="relative">
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <div
                className="
                  absolute
                  -right-3
                  -top-3
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-500
                  px-1
                  text-[10px]
                  font-black
                  text-white
                "
              >
                {cartCount}
              </div>
            )}
          </div>

          <span>
            {lang === "uz"
              ? "Savat"
              : "Корзина"}
          </span>
        </Link>

        {/* PROFILE */}
        <Link
          href="/profile"
          className={`
            flex
            flex-col
            items-center
            gap-1
            py-3
            text-xs
            font-black
            ${theme.text}
          `}
        >
          <User size={22} />

          <span>
            {lang === "uz"
              ? "Profil"
              : "Профиль"}
          </span>
        </Link>
      </div>
    </div>
  );
}