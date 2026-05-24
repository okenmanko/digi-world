"use client";

import Link from "next/link";
import { Send, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const botUrl = "https://t.me/dwauth_bot";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-5 py-10 text-zinc-950">
      <div className="w-full max-w-[520px] rounded-[34px] border border-black/10 bg-white p-7 text-center shadow-xl shadow-black/5 md:p-9">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
          <Send size={38} />
        </div>

        <h1 className="mt-6 text-5xl font-black">
          Digi World
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-base font-medium leading-relaxed text-zinc-600">
          Katalog va buyurtmalarni ko‘rish uchun Telegram orqali tizimga kiring.
        </p>

        <a
          href={botUrl}
          target="_blank"
          className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-lg font-black text-white transition hover:scale-[1.02]"
        >
          Telegram orqali kirish
        </a>

        <div className="mt-7 rounded-2xl bg-orange-500/10 p-4 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 shrink-0 text-orange-500"
              size={22}
            />

            <div>
              <div className="font-black">
                Xavfsiz kirish
              </div>

              <p className="mt-1 text-sm font-medium leading-relaxed text-zinc-600">
                Telefon yoki email kerak emas.
                Kirish Telegram akkaunt orqali amalga oshiriladi.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex font-black text-orange-500"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  );
}