"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  RefreshCcw,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";

type SyncResult = {
  success: boolean;
  moysklad_count?: number;
  attempted?: number;
  inserted_or_updated?: number;
  failed_count?: number;
  failed?: any[];
  error?: string;
};

export default function AdminMoySkladPage() {
  const { lang, dark } = useApp();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  async function syncProducts() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/moysklad/sync", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Sync error",
      });
    }

    setLoading(false);
  }

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1000px] px-5 py-7">
          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 font-black text-orange-500"
          >
            <ArrowLeft size={18} />
            {lang === "uz" ? "Admin panelga qaytish" : "Назад"}
          </Link>

          <div className={`rounded-[32px] border p-6 md:p-8 ${theme.card}`}>
            <div className="flex items-center gap-3">
              <Database className="text-orange-500" size={36} />

              <h1 className="text-4xl font-black md:text-6xl">
                MoySklad Sync
              </h1>
            </div>

            <p className={`mt-4 text-lg font-medium ${theme.soft}`}>
              {lang === "uz"
                ? "MoySklad’dagi tovarlarni Supabase products jadvaliga import/update qiladi."
                : "Импортирует и обновляет товары из МойСклад в Supabase."}
            </p>

            <button
              onClick={syncProducts}
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-5 text-lg font-black text-white disabled:opacity-60"
            >
              <RefreshCcw size={22} className={loading ? "animate-spin" : ""} />
              {loading
                ? lang === "uz"
                  ? "Import qilinmoqda..."
                  : "Импорт..."
                : lang === "uz"
                ? "MoySklad’dan import qilish"
                : "Импорт из МойСклад"}
            </button>
          </div>

          {result && (
            <div className={`mt-6 rounded-[32px] border p-6 ${theme.card}`}>
              <div className="flex items-center gap-3">
                {result.success ? (
                  <CheckCircle2 className="text-green-500" size={34} />
                ) : (
                  <XCircle className="text-red-500" size={34} />
                )}

                <h2 className="text-3xl font-black">
                  {result.success
                    ? lang === "uz"
                      ? "Sync muvaffaqiyatli"
                      : "Sync успешно"
                    : lang === "uz"
                    ? "Sync xatosi"
                    : "Ошибка sync"}
                </h2>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className={`rounded-2xl border p-4 ${theme.input}`}>
                  <div className={`text-sm font-black ${theme.soft}`}>
                    MoySklad count
                  </div>
                  <div className="mt-1 text-2xl font-black">
                    {result.moysklad_count ?? 0}
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${theme.input}`}>
                  <div className={`text-sm font-black ${theme.soft}`}>
                    Inserted / Updated
                  </div>
                  <div className="mt-1 text-2xl font-black text-orange-500">
                    {result.inserted_or_updated ?? 0}
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${theme.input}`}>
                  <div className={`text-sm font-black ${theme.soft}`}>
                    Failed
                  </div>
                  <div className="mt-1 text-2xl font-black text-red-500">
                    {result.failed_count ?? 0}
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${theme.input}`}>
                  <div className={`text-sm font-black ${theme.soft}`}>
                    Status
                  </div>
                  <div className="mt-1 text-2xl font-black">
                    {result.success ? "OK" : "ERROR"}
                  </div>
                </div>
              </div>

              {result.error && (
                <pre className="mt-5 overflow-auto rounded-2xl bg-red-500/10 p-4 text-sm text-red-500">
                  {result.error}
                </pre>
              )}
            </div>
          )}
        </section>
      </main>
    </AdminGuard>
  );
}