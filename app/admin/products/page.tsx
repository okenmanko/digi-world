"use client";

import { useEffect, useState } from "react";
import {
  ImagePlus,
  PackagePlus,
  Save,
  Trash2,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";
import {
  getAdminProducts,
  saveAdminProducts,
} from "@/lib/adminProducts";

import { createSupabaseProduct } from "@/lib/supabaseProducts";
import { uploadProductImage } from "@/lib/supabaseStorage";

export default function AdminProductsPage() {
  const { lang, dark } = useApp();

  const [products, setProducts] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProducts(getAdminProducts());
  }, []);

  const theme = {
    page: dark
      ? "bg-[#050505] text-white"
      : "bg-[#f6f7fb] text-zinc-950",

    card: dark
      ? "border-white/10 bg-white/[0.04]"
      : "border-black/10 bg-white",

    input: dark
      ? "border-white/10 bg-white/5 text-white"
      : "border-black/10 bg-white text-zinc-950",
  };

  async function handleImageUpload(file: File) {
    setUploading(true);

    const url = await uploadProductImage(file);

    setUploading(false);

    if (!url) {
      alert(
        lang === "uz"
          ? "Rasm yuklanmadi"
          : "Фото не загрузилось"
      );

      return;
    }

    setImage(url);
  }

  async function saveProduct() {
    if (!name || !category || !price) {
      alert(
        lang === "uz"
          ? "Ma’lumotlarni to‘ldiring"
          : "Заполните данные"
      );

      return;
    }

    setSaving(true);

    const product = {
      id: Date.now().toString(),
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      category,
      price: Number(price),
      image,
      stock: true,
    };

    const localProducts = [product, ...products];

    saveAdminProducts(localProducts);
    setProducts(localProducts);

    await createSupabaseProduct({
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.name,
      stock: true,
    });

    setName("");
    setCategory("");
    setPrice("");
    setImage("");

    setSaving(false);

    alert(
      lang === "uz"
        ? "Mahsulot qo‘shildi"
        : "Товар добавлен"
    );
  }

  function removeProduct(id: string) {
    const filtered = products.filter(
      (p) => p.id !== id
    );

    setProducts(filtered);
    saveAdminProducts(filtered);
  }

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1400px] px-5 py-8">
          <div
            className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}
          >
            <div className="flex items-center gap-3">
              <PackagePlus
                className="text-orange-500"
                size={34}
              />

              <h1 className="text-4xl font-black md:text-6xl">
                {lang === "uz"
                  ? "Mahsulot qo‘shish"
                  : "Добавить товар"}
              </h1>
            </div>

            <div className="mt-7 grid gap-4">
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder={
                  lang === "uz"
                    ? "Mahsulot nomi"
                    : "Название товара"
                }
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <input
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder={
                  lang === "uz"
                    ? "Kategoriya"
                    : "Категория"
                }
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <input
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                type="number"
                placeholder={
                  lang === "uz"
                    ? "Narx"
                    : "Цена"
                }
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <div className="grid gap-3">
                <div className="flex items-center gap-2 font-black">
                  <ImagePlus
                    size={18}
                    className="text-orange-500"
                  />

                  Product Image Upload
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                {uploading && (
                  <div className="font-black text-orange-500">
                    {lang === "uz"
                      ? "Rasm yuklanmoqda..."
                      : "Фото загружается..."}
                  </div>
                )}

                {image && (
                  <div className="overflow-hidden rounded-3xl border border-orange-500/20 bg-white p-4">
                    <img
                      src={image}
                      alt="preview"
                      className="mx-auto h-[220px] object-contain"
                    />
                  </div>
                )}
              </div>

              <button
                disabled={saving}
                onClick={saveProduct}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-black text-white"
              >
                <Save size={20} />

                {saving
                  ? lang === "uz"
                    ? "Saqlanmoqda..."
                    : "Сохраняется..."
                  : lang === "uz"
                  ? "Mahsulot qo‘shish"
                  : "Добавить товар"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className={`rounded-[30px] border p-6 ${theme.card}`}
              >
                <div className="flex items-start justify-between gap-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-32 w-32 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-orange-500/10 text-5xl">
                      📦
                    </div>
                  )}

                  <button
                    onClick={() =>
                      removeProduct(product.id)
                    }
                    className="rounded-2xl border border-red-500/20 p-3 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h2 className="mt-5 text-2xl font-black">
                  {product.name}
                </h2>

                <p className="mt-2 font-bold text-zinc-500">
                  {product.category}
                </p>

                <div className="mt-4 text-2xl font-black text-orange-500">
                  {Number(
                    product.price
                  ).toLocaleString()}{" "}
                  so‘m
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}