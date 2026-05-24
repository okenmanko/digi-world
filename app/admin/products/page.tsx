"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Trash2,
  Pencil,
  Save,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";

import {
  createSupabaseProduct,
  deleteSupabaseProduct,
  getSupabaseProducts,
  updateSupabaseProduct,
} from "@/lib/supabaseProducts";

import {
  getSupabaseCategories,
  type Category,
} from "@/lib/supabaseCategories";

import { formatPrice } from "@/lib/products";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  old_price?: number | null;
  image: string;
  category: string;
  description: string;
  stock: boolean;
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const { dark, lang } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    old_price: "",
    image: "",
    category: "",
    description: "",
    stock: true,
  });

  async function loadData() {
    setLoading(true);

    const productData = await getSupabaseProducts();
    const categoryData = await getSupabaseCategories();

    setProducts((productData || []) as Product[]);
    setCategories((categoryData || []) as Category[]);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setEditingId(null);

    setForm({
      name: "",
      slug: "",
      price: "",
      old_price: "",
      image: "",
      category: "",
      description: "",
      stock: true,
    });
  }

  async function submitProduct() {
    if (!form.name || !form.slug || !form.price || !form.category) {
      alert(
        lang === "uz"
          ? "Nomi, slug, narx va kategoriya kerak"
          : "Нужны название, slug, цена и категория"
      );
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      image: form.image || "",
      category: form.category,
      description: form.description || "",
      stock: form.stock,
    };

    if (editingId) {
      await updateSupabaseProduct(editingId, payload);
    } else {
      await createSupabaseProduct(payload);
    }

    resetForm();
    await loadData();
  }

  async function removeProduct(id: string) {
    const ok = confirm(
      lang === "uz" ? "Mahsulotni o‘chirasizmi?" : "Удалить товар?"
    );

    if (!ok) return;

    await deleteSupabaseProduct(id);
    await loadData();
  }

  function editProduct(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      price: String(product.price || ""),
      old_price: String(product.old_price || ""),
      image: product.image || "",
      category: product.category || "",
      description: product.description || "",
      stock: product.stock,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1440px] px-5 py-7">
          <div className={`rounded-[32px] border p-6 ${theme.card}`}>
            <div className="flex items-center gap-3">
              <Package className="text-orange-500" size={34} />

              <h1 className="text-4xl font-black md:text-6xl">
                {lang === "uz" ? "Mahsulotlar" : "Товары"}
              </h1>
            </div>

            <p className={`mt-3 text-lg font-medium ${theme.soft}`}>
              {lang === "uz"
                ? "Mahsulot qo‘shish, kategoriya tanlash va narx tahrirlash."
                : "Добавление товаров, выбор категории и редактирование цены."}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className={`h-fit rounded-[30px] border p-5 ${theme.card}`}>
              <h2 className="text-3xl font-black">
                {editingId
                  ? lang === "uz"
                    ? "Tahrirlash"
                    : "Редактирование"
                  : lang === "uz"
                  ? "Yangi mahsulot"
                  : "Новый товар"}
              </h2>

              <div className="mt-5 grid gap-4">
                <input
                  value={form.name}
                  onChange={(e) => {
                    const value = e.target.value;

                    setForm({
                      ...form,
                      name: value,
                      slug: editingId ? form.slug : makeSlug(value),
                    });
                  }}
                  placeholder={lang === "uz" ? "Mahsulot nomi" : "Название товара"}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slug: makeSlug(e.target.value),
                    })
                  }
                  placeholder="slug"
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                >
                  <option value="">
                    {lang === "uz" ? "Kategoriya tanlang" : "Выберите категорию"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.name_uz}>
                      {lang === "uz" ? category.name_uz : category.name_ru}
                    </option>
                  ))}
                </select>

                <input
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  type="number"
                  placeholder={lang === "uz" ? "Narx" : "Цена"}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <input
                  value={form.old_price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      old_price: e.target.value,
                    })
                  }
                  type="number"
                  placeholder={lang === "uz" ? "Eski narx" : "Старая цена"}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <input
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  placeholder="Image URL"
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                {form.image && (
                  <div className="flex h-40 items-center justify-center rounded-2xl bg-white p-4">
                    <img
                      src={form.image}
                      alt="preview"
                      className="h-full object-contain"
                    />
                  </div>
                )}

                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder={lang === "uz" ? "Tavsif" : "Описание"}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <label
                  className={`flex items-center gap-3 rounded-2xl border px-5 py-4 font-black ${theme.input}`}
                >
                  <input
                    type="checkbox"
                    checked={form.stock}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stock: e.target.checked,
                      })
                    }
                  />

                  {lang === "uz" ? "Omborda mavjud" : "В наличии"}
                </label>

                <button
                  onClick={submitProduct}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-5 text-lg font-black text-white"
                >
                  {editingId ? <Save size={22} /> : <Plus size={22} />}

                  {editingId
                    ? lang === "uz"
                      ? "Saqlash"
                      : "Сохранить"
                    : lang === "uz"
                    ? "Qo‘shish"
                    : "Добавить"}
                </button>

                {editingId && (
                  <button
                    onClick={resetForm}
                    className={`rounded-2xl border px-6 py-4 font-black ${theme.input}`}
                  >
                    {lang === "uz" ? "Bekor qilish" : "Отмена"}
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-5">
              {loading ? (
                <div className={`rounded-[30px] border p-10 text-center ${theme.card}`}>
                  <div className="text-2xl font-black text-orange-500">
                    Loading...
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className={`rounded-[30px] border p-10 text-center ${theme.card}`}>
                  <Package className="mx-auto text-orange-500" size={56} />

                  <h2 className="mt-5 text-2xl font-black">
                    {lang === "uz" ? "Mahsulot yo‘q" : "Товаров нет"}
                  </h2>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className={`rounded-[30px] border p-5 ${theme.card}`}
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-5">
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-white">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-24 w-24 object-contain"
                            />
                          ) : (
                            <div className="text-5xl">📦</div>
                          )}
                        </div>

                        <div>
                          <h2 className="text-2xl font-black">{product.name}</h2>

                          <div className={`mt-2 text-sm font-bold ${theme.soft}`}>
                            {product.category || "—"}
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="text-3xl font-black text-orange-500">
                              {formatPrice(product.price)}
                            </div>

                            {product.old_price &&
                              product.old_price > product.price && (
                                <div className="text-lg font-black text-zinc-400 line-through">
                                  {formatPrice(product.old_price)}
                                </div>
                              )}
                          </div>

                          {product.old_price &&
                            product.old_price > product.price && (
                              <div className="mt-2 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-sm font-black text-green-500">
                                -
                                {Math.round(
                                  ((product.old_price - product.price) /
                                    product.old_price) *
                                    100
                                )}
                                %
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => editProduct(product)}
                          className={`flex items-center gap-2 rounded-2xl border px-5 py-4 font-black ${theme.input}`}
                        >
                          <Pencil size={18} />
                          {lang === "uz" ? "Tahrirlash" : "Изменить"}
                        </button>

                        <button
                          onClick={() => removeProduct(product.id)}
                          className="flex items-center gap-2 rounded-2xl border border-red-500 px-5 py-4 font-black text-red-500"
                        >
                          <Trash2 size={18} />
                          {lang === "uz" ? "O‘chirish" : "Удалить"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}