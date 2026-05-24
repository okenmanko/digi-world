import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, ShieldCheck, Truck } from "lucide-react";

import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] text-zinc-950">
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[36px] border border-black/10 bg-white p-8 md:p-12">
            <div className="inline-flex rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
              ✨ Digi World — premium texnika do‘koni
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] md:text-7xl">
              Uy va biznes uchun ishonchli texnika
            </h1>

            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-600">
              Digi World’da televizorlar, maishiy texnika va elektronika:
              kafolat, tez yetkazib berish va qulay buyurtma.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20"
              >
                Katalogga o‘tish
                <ArrowRight size={22} />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-3xl font-black text-orange-500">200+</div>
                <div className="mt-1 text-sm font-bold text-zinc-600">
                  tashkilotga xizmat
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-3xl font-black text-orange-500">24/7</div>
                <div className="mt-1 text-sm font-bold text-zinc-600">
                  online katalog
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-3xl font-black text-orange-500">100%</div>
                <div className="mt-1 text-sm font-bold text-zinc-600">
                  rasmiy hujjatlar
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[36px] border border-black/10 bg-white p-8">
            <div className="rounded-[30px] bg-gradient-to-br from-orange-500 via-red-500 to-zinc-950 p-8 text-white">
              <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black">
                Rasmiy va ishonchli
              </div>

              <h2 className="mt-8 text-4xl font-black leading-tight md:text-5xl">
                Buyurtma, to‘lov va yetkazib berish — hammasi bir joyda
              </h2>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl bg-white/15 px-5 py-4 font-black">
                  Online katalog
                </div>
                <div className="rounded-2xl bg-white/15 px-5 py-4 font-black">
                  Ombor va mahsulotlar
                </div>
                <div className="rounded-2xl bg-white/15 px-5 py-4 font-black">
                  Buyurtmalar nazorati
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-black/10 bg-white p-6">
            <Truck className="text-orange-500" size={30} />
            <h3 className="mt-4 text-xl font-black">Tez yetkazib berish</h3>
            <p className="mt-2 text-sm font-medium text-zinc-600">
              Toshkent va viloyatlarga yetkazib berish.
            </p>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white p-6">
            <ShieldCheck className="text-orange-500" size={30} />
            <h3 className="mt-4 text-xl font-black">Rasmiy kafolat</h3>
            <p className="mt-2 text-sm font-medium text-zinc-600">
              Mahsulotlar kafolat asosida taqdim etiladi.
            </p>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white p-6">
            <BadgeCheck className="text-orange-500" size={30} />
            <h3 className="mt-4 text-xl font-black">Rasmiy hujjatlar</h3>
            <p className="mt-2 text-sm font-medium text-zinc-600">
              Faktura, nakladnoy va kerakli hujjatlar.
            </p>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white p-6">
            <Clock className="text-orange-500" size={30} />
            <h3 className="mt-4 text-xl font-black">Qulay buyurtma</h3>
            <p className="mt-2 text-sm font-medium text-zinc-600">
              Mahsulotni tanlang va tezda buyurtma qiling.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}