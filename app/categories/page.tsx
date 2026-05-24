"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderTree, Pencil, Plus, Save, Trash2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import { useApp } from "@/context/AppContext";

import {
  createSupabaseCategory,
  deleteSupabaseCategory,
  getSupabaseCategories,
  updateSupabaseCategory,
  type Category,
} from "@/lib/supabaseCategories";

export default function AdminCategoriesPage() {
  const { dark, lang } = useApp();

  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name_uz: "",
    name_ru: "",
    slug: "",
  });

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input: dark
      ? "border-white/10 bg-white/5 text-white"
      : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  async function loadCategories() {
    const data = await getSupabaseCategories();
    setCategories(data as Category[]);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      name_uz: "",
      name_ru: "",
      slug: "",
    });
  }

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function submitCategory() {
    if (!form.name_uz || !form.name_ru || !form.slug) {
      alert(lang === "uz" ? "Hamma maydonni to‘ldiring" : "Заполните все поля");
      return;
    }

    if (editingId) {
      await updateSupabaseCategory(editingId, form);
    } else {
      await createSupabaseCategory(form);
    }

    resetForm();
    await loadCategories();
  }

  function editCategory(category: Category) {
    setEditingId(category.id);
    setForm({
      name_uz: category.name_uz,
      name_ru: category.name_ru,
      slug: category.slug,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeCategory(id: string) {
    const ok = confirm(
      lang === "uz" ? "Kategoriyani o‘chirasizmi?" : "Удалить категорию?"
    );

    if (!ok) return;

    await deleteSupabaseCategory(id);
    await loadCategories();
  }

  return (
    <AdminGuard>
      <main className={`min-h-screen ${theme.page}`}>
        <Navbar />

        <section className="mx-auto max-w-[1200px] px-5 py-7">
          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 font-black text-orange-500"
          >
            <ArrowLeft size={18} />
            {lang === "uz" ? "Admin panelga qaytish" : "Назад"}
          </Link>

          <div className={`rounded-[32px] border p-6 ${theme.card}`}>
            <div className="flex items-center gap-3">
              <FolderTree className="text-orange-500" size={36} />
              <h1 className="text-4xl font-black md:text-6xl">
                {lang === "uz" ? "Kategoriyalar" : "Категории"}
              </h1>
            </div>

            <p className={`mt-3 text-lg font-medium ${theme.soft}`}>
              {lang === "uz"
                ? "Mahsulotlar uchun kategoriya qo‘shish va tahrirlash."
                : "Добавление и редактирование категорий товаров."}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className={`h-fit rounded-[30px] border p-5 ${theme.card}`}>
              <h2 className="text-3xl font-black">
                {editingId
                  ? lang === "uz"
                    ? "Kategoriyani tahrirlash"
                    : "Редактировать категорию"
                  : lang === "uz"
                  ? "Yangi kategoriya"
                  : "Новая категория"}
              </h2>

              <div className="mt-5 grid gap-4">
                <input
                  value={form.name_uz}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({
                      ...form,
                      name_uz: value,
                      slug: editingId ? form.slug : makeSlug(value),
                    });
                  }}
                  placeholder="Nomi UZ: Televizorlar"
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <input
                  value={form.name_ru}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name_ru: e.target.value,
                    })
                  }
                  placeholder="Название RU: Телевизоры"
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
                  placeholder="slug: tv"
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <button
                  onClick={submitCategory}
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

            <div className="grid gap-4">
              {categories.length === 0 ? (
                <div className={`rounded-[30px] border p-10 text-center ${theme.card}`}>
                  <FolderTree className="mx-auto text-orange-500" size={56} />
                  <h2 className="mt-5 text-2xl font-black">
                    {lang === "uz" ? "Kategoriya yo‘q" : "Категорий нет"}
                  </h2>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className={`rounded-[28px] border p-5 ${theme.card}`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="inline-flex rounded-full bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-500">
                          /catalog/{category.slug}
                        </div>

                        <h2 className="mt-4 text-3xl font-black">
                          {lang === "uz" ? category.name_uz : category.name_ru}
                        </h2>

                        <p className={`mt-2 font-bold ${theme.soft}`}>
                          {category.name_uz} / {category.name_ru}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => editCategory(category)}
                          className={`flex items-center gap-2 rounded-2xl border px-5 py-4 font-black ${theme.input}`}
                        >
                          <Pencil size={18} />
                          {lang === "uz" ? "Tahrirlash" : "Изменить"}
                        </button>

                        <button
                          onClick={() => removeCategory(category.id)}
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