"use client";

import { useEffect, useState } from "react";
import {
  Edit,
  ImagePlus,
  PackagePlus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";
import {
  getSupabaseProducts,
  createSupabaseProduct,
  updateSupabaseProduct,
  deleteSupabaseProduct,
} from "@/lib/supabaseProducts";
import { uploadProductImage } from "@/lib/supabaseStorage";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: boolean;
  created_at?: string;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const { lang, dark } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    const data = await getSupabaseProducts();
    setProducts(data as Product[]);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark
      ? "border-white/10 bg-white/5 text-white"
      : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  function resetForm() {
    setEditingId(null);
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setImage("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setDescription(product.description || "");
    setImage(product.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleImageUpload(file: File) {
    setUploading(true);

    const url = await uploadProductImage(file);

    setUploading(false);

    if (!url) {
      alert(lang === "uz" ? "Rasm yuklanmadi" : "Фото не загрузилось");
      return;
    }

    setImage(url);
  }

  async function saveProduct() {
    if (!name || !category || !price) {
      alert(
        lang === "uz"
          ? "Nom, kategoriya va narx kerak"
          : "Нужны название, категория и цена"
      );
      return;
    }

    setSaving(true);

    const payload = {
      name,
      slug: createSlug(name),
      price: Number(price),
      image,
      category,
      description,
      stock: true,
    };

    if (editingId) {
      const updated = await updateSupabaseProduct(editingId, payload);

      if (!updated) {
        setSaving(false);
        alert(lang === "uz" ? "Update bo‘lmadi" : "Не обновилось");
        return;
      }
    } else {
      const created = await createSupabaseProduct(payload);

      if (!created) {
        setSaving(false);
        alert(lang === "uz" ? "Save bo‘lmadi" : "Не сохранилось");
        return;
      }
    }

    await loadProducts();
    resetForm();
    setSaving(false);

    alert(
      editingId
        ? lang === "uz"
          ? "Mahsulot yangilandi"
          : "Товар обновлён"
        : lang === "uz"
        ? "Mahsulot qo‘shildi"
        : "Товар добавлен"
    );
  }

  async function removeProduct(id: string) {
    const ok = confirm(
      lang === "uz" ? "Mahsulotni o‘chirasizmi?" : "Удалить товар?"
    );

    if (!ok) return;

    const deleted = await deleteSupabaseProduct(id);

    if (!deleted) {
      alert(lang === "uz" ? "O‘chmadi" : "Не удалилось");
      return;
    }

    await loadProducts();
  }

  async function toggleStock(product: Product) {
    await updateSupabaseProduct(product.id, {
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image || "",
      category: product.category,
      description: product.description || "",
      stock: !product.stock,
    });

    await loadProducts();
  }

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1400px] px-5 py-8">
          <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <PackagePlus className="text-orange-500" size={34} />

                <h1 className="text-4xl font-black md:text-6xl">
                  {lang === "uz" ? "Mahsulotlar" : "Товары"}
                </h1>
              </div>

              {editingId && (
                <button
                  onClick={resetForm}
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 font-black ${theme.input}`}
                >
                  <X size={18} />
                  {lang === "uz" ? "Bekor qilish" : "Отмена"}
                </button>
              )}
            </div>

            <div className="mt-7 grid gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "uz" ? "Mahsulot nomi" : "Название товара"}
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={lang === "uz" ? "Kategoriya" : "Категория"}
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder={lang === "uz" ? "Narx" : "Цена"}
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === "uz" ? "Tavsif" : "Описание"}
                rows={4}
                className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
              />

              <div className="grid gap-3">
                <div className="flex items-center gap-2 font-black">
                  <ImagePlus size={18} className="text-orange-500" />
                  Product Image
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL"
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                {uploading && (
                  <div className="font-black text-orange-500">
                    {lang === "uz" ? "Rasm yuklanmoqda..." : "Фото загружается..."}
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
                disabled={saving || uploading}
                onClick={saveProduct}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-black text-white disabled:opacity-60"
              >
                <Save size={20} />

                {saving
                  ? lang === "uz"
                    ? "Saqlanmoqda..."
                    : "Сохраняется..."
                  : editingId
                  ? lang === "uz"
                    ? "Yangilash"
                    : "Обновить"
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
                      className="h-32 w-32 rounded-2xl bg-white object-contain"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-orange-500/10 text-5xl">
                      📦
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className={`rounded-2xl border p-3 ${theme.input}`}
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => removeProduct(product.id)}
                      className="rounded-2xl border border-red-500/20 p-3 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h2 className="mt-5 text-2xl font-black">{product.name}</h2>

                <p className={`mt-2 font-bold ${theme.soft}`}>
                  {product.category}
                </p>

                {product.description && (
                  <p className={`mt-3 line-clamp-3 text-sm ${theme.soft}`}>
                    {product.description}
                  </p>
                )}

                <div className="mt-4 text-2xl font-black text-orange-500">
                  {Number(product.price).toLocaleString()} so‘m
                </div>

                <button
                  onClick={() => toggleStock(product)}
                  className={`mt-5 rounded-2xl px-5 py-3 font-black ${
                    product.stock
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {product.stock
                    ? lang === "uz"
                      ? "Omborda bor"
                      : "В наличии"
                    : lang === "uz"
                    ? "Omborda yo‘q"
                    : "Нет в наличии"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}