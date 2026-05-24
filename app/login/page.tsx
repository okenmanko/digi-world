"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Send, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const telegramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!telegramRef.current) return;

    telegramRef.current.innerHTML = "";

    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "16");
    script.setAttribute("data-auth-url", "/api/auth/telegram/callback");
    script.setAttribute("data-request-access", "write");

    telegramRef.current.appendChild(script);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-5 py-10 text-zinc-950">
      <div className="w-full max-w-[520px] rounded-[34px] border border-black/10 bg-white p-7 text-center shadow-xl shadow-black/5 md:p-9">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
          <Send size={38} />
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-5xl">
          Digi World
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-base font-medium leading-relaxed text-zinc-600">
          Katalog va buyurtmalarni ko‘rish uchun Telegram orqali tizimga kiring.
        </p>

        <div className="mt-7 flex justify-center" ref={telegramRef} />

        <div className="mt-7 rounded-2xl bg-orange-500/10 p-4 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-orange-500" size={22} />

            <div>
              <div className="font-black">Xavfsiz kirish</div>
              <p className="mt-1 text-sm font-medium leading-relaxed text-zinc-600">
                Telefon yoki email kiritish shart emas. Kirish faqat Telegram
                akkauntingiz orqali tasdiqlanadi.
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