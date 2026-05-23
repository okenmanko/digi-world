"use client";

import { useEffect, useState } from "react";
import { Database } from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";
import { getSupabaseProducts } from "@/lib/supabaseProducts";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: boolean;
  created_at: string;
};

export default function SupabaseTestPage() {
  const { dark, lang } = useApp();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getSupabaseProducts();
      setProducts(data as Product[]);
    }

    load();
  }, []);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1200px] px-5 py-8">
          <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
            <div className="flex items-center gap-3">
              <Database className="text-orange-500" size={34} />

              <h1 className="text-4xl font-black">
                Supabase Products Test
              </h1>
            </div>

            <p className={`mt-3 ${theme.soft}`}>
              {lang === "uz"
                ? "Bu sahifa Supabase products table’dan ma’lumot o‘qiydi."
                : "Эта страница читает данные из таблицы products в Supabase."}
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {products.length === 0 ? (
              <div className={`rounded-3xl border p-8 text-center ${theme.card}`}>
                Product topilmadi yoki RLS o‘qishga ruxsat bermayapti.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className={`rounded-3xl border p-5 ${theme.card}`}
                >
                  <div className="flex items-center gap-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-24 w-24 rounded-2xl object-contain bg-white"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-orange-500/10 text-4xl">
                        📦
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl font-black">{product.name}</h2>
                      <p className={theme.soft}>{product.category}</p>
                      <p className="font-black text-orange-500">
                        {product.price?.toLocaleString()} so‘m
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}