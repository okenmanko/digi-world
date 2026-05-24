"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, RefreshCcw, Send, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  const botUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "dwauth_bot";

  async function createCode() {
    setLoading(true);

    const res = await fetch("/api/auth/code/create", {
      method: "POST",
      cache: "no-store",
    });

    const data = await res.json();

    if (data.success) {
      setCode(data.code);
    }

    setLoading(false);
  }

  async function checkCode(currentCode = code) {
    if (!currentCode || checking) return;

    setChecking(true);

    const res = await fetch("/api/auth/code/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: currentCode }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/catalog";
      return;
    }

    setChecking(false);
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  useEffect(() => {
    createCode();
  }, []);

  useEffect(() => {
    if (!code) return;

    const timer = setInterval(() => {
      checkCode(code);
    }, 2500);

    return () => clearInterval(timer);
  }, [code]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-5 py-10 text-zinc-950">
      <div className="w-full max-w-[560px] rounded-[34px] border border-black/10 bg-white p-7 text-center shadow-xl shadow-black/5 md:p-9">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
          <Send size={38} />
        </div>

        <h1 className="mt-6 text-5xl font-black">Digi World</h1>

        <p className="mx-auto mt-4 max-w-sm text-base font-medium leading-relaxed text-zinc-600">
          Saytga kirish uchun kodni Telegram botga yuboring.
        </p>

        <div className="mt-7 rounded-[28px] bg-zinc-100 p-6">
          <div className="text-sm font-black text-zinc-500">
            Sizning kirish kodingiz
          </div>

          <div className="mt-3 text-6xl font-black tracking-[0.18em] text-orange-500">
            {loading ? "..." : code}
          </div>

          <button
            onClick={copyCode}
            disabled={!code}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-zinc-950 disabled:opacity-50"
          >
            <Copy size={18} />
            {copied ? "Nusxalandi" : "Kodni copy qilish"}
          </button>
        </div>

        <a
          href={`https://t.me/${botUsername}`}
          target="_blank"
          className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-lg font-black text-white transition hover:scale-[1.02]"
        >
          Telegram botni ochish
        </a>

        <button
          onClick={() => checkCode()}
          disabled={checking || !code}
          className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white text-lg font-black text-zinc-950 disabled:opacity-50"
        >
          <RefreshCcw size={20} className={checking ? "animate-spin" : ""} />
          {checking ? "Tekshirilmoqda..." : "Men kodni yubordim"}
        </button>

        <div className="mt-7 rounded-2xl bg-orange-500/10 p-4 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-orange-500" size={22} />

            <div>
              <div className="font-black">Qanday ishlaydi?</div>
              <p className="mt-1 text-sm font-medium leading-relaxed text-zinc-600">
                1) Kodni copy qiling. 2) Telegram botga yuboring. 3) Sayt avtomatik
                kiradi.
              </p>
            </div>
          </div>
        </div>

        <Link href="/" className="mt-6 inline-flex font-black text-orange-500">
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  );
}