"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Banknote,
  CreditCard,
  Truck,
  User,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

import { useApp } from "@/context/AppContext";

import { clearCart, getCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";

export default function CheckoutPage() {
  const { dark, lang, refreshCartCount } = useApp();

  const [products, setProducts] = useState<MergedProduct[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [delivery, setDelivery] = useState("courier");
  const [payment, setPayment] = useState("cash");

  useEffect(() => {
    async function load() {
      const data = await getFullMergedProducts();
      setProducts(data);
    }

    load();
  }, []);

  const cart = getCart();

  const items = cart
    .map((item) => {
      const product = products.find(
        (p) => p.slug === item.slug
      );

      if (!product) return null;

      return {
        ...product,
        qty: item.qty,
      };
    })
    .filter(Boolean);

  const total = items.reduce(
    (sum, item) =>
      item
        ? sum + item.price * item.qty
        : sum,
    0
  );

  const oldTotal = items.reduce(
    (sum, item) => {
      if (!item) return sum;

      const oldPrice =
        item.oldPrice &&
        item.oldPrice > item.price
          ? item.oldPrice
          : item.price;

      return (
        sum + oldPrice * item.qty
      );
    },
    0
  );

  const saved = Math.max(
    oldTotal - total,
    0
  );

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

    soft: dark
      ? "text-zinc-400"
      : "text-zinc-600",
  };

  function finishOrder() {
    if (
      !name ||
      !phone ||
      !city ||
      !address
    ) {
      alert(
        lang === "uz"
          ? "Ma’lumotlarni to‘ldiring"
          : "Заполните данные"
      );

      return;
    }

    clearCart();

    refreshCartCount();

    window.location.href =
      "/success";
  }

  return (
    <main
      className={`min-h-screen ${theme.page}`}
    >
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-6">
        <div
          className={`rounded-[28px] border p-5 md:p-6 ${theme.card}`}
        >
          <h1 className="text-3xl font-black md:text-5xl">
            {lang === "uz"
              ? "Buyurtmani rasmiylashtirish"
              : "Оформление заказа"}
          </h1>

          <p
            className={`mt-2 text-base ${theme.soft}`}
          >
            {lang === "uz"
              ? "Ma’lumotlarni to‘ldiring."
              : "Заполните данные."}
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_390px]">
          <div className="grid gap-5">
            <div
              className={`rounded-[26px] border p-5 ${theme.card}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <User size={22} />

                <h2 className="text-2xl font-black">
                  {lang === "uz"
                    ? "Mijoz ma’lumotlari"
                    : "Данные клиента"}
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder={
                    lang === "uz"
                      ? "Ismingiz"
                      : "Ваше имя"
                  }
                  className={`rounded-2xl border px-4 py-3 outline-none ${theme.input}`}
                />

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  placeholder="+998 90 123 45 67"
                  className={`rounded-2xl border px-4 py-3 outline-none ${theme.input}`}
                />

                <select
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  className={`rounded-2xl border px-4 py-3 outline-none ${theme.input}`}
                >
                  <option value="">
                    {lang === "uz"
                      ? "Viloyatni tanlang"
                      : "Выберите регион"}
                  </option>

                  <option value="Toshkent shahri">
                    Toshkent shahri
                  </option>

                  <option value="Toshkent viloyati">
                    Toshkent viloyati
                  </option>

                  <option value="Andijon">
                    Andijon
                  </option>

                  <option value="Buxoro">
                    Buxoro
                  </option>

                  <option value="Farg‘ona">
                    Farg‘ona
                  </option>

                  <option value="Jizzax">
                    Jizzax
                  </option>

                  <option value="Namangan">
                    Namangan
                  </option>

                  <option value="Navoiy">
                    Navoiy
                  </option>

                  <option value="Qashqadaryo">
                    Qashqadaryo
                  </option>

                  <option value="Samarqand">
                    Samarqand
                  </option>

                  <option value="Sirdaryo">
                    Sirdaryo
                  </option>

                  <option value="Surxondaryo">
                    Surxondaryo
                  </option>

                  <option value="Xorazm">
                    Xorazm
                  </option>

                  <option value="Qoraqalpog‘iston">
                    Qoraqalpog‘iston
                  </option>
                </select>

                <input
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  placeholder={
                    lang === "uz"
                      ? "Manzil"
                      : "Адрес"
                  }
                  className={`rounded-2xl border px-4 py-3 outline-none ${theme.input}`}
                />
              </div>
            </div>

            <div
              className={`rounded-[26px] border p-5 ${theme.card}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <Truck size={22} />

                <h2 className="text-2xl font-black">
                  {lang === "uz"
                    ? "Yetkazib berish"
                    : "Доставка"}
                </h2>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setDelivery(
                      "courier"
                    )
                  }
                  className={`rounded-2xl px-4 py-3 text-left font-black ${
                    delivery ===
                    "courier"
                      ? "bg-orange-500 text-white"
                      : theme.input
                  }`}
                >
                  {lang === "uz"
                    ? "Kuryer orqali"
                    : "Курьер"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDelivery(
                      "pickup"
                    )
                  }
                  className={`rounded-2xl px-4 py-3 text-left font-black ${
                    delivery ===
                    "pickup"
                      ? "bg-orange-500 text-white"
                      : theme.input
                  }`}
                >
                  {lang === "uz"
                    ? "Olib ketish"
                    : "Самовывоз"}
                </button>
              </div>
            </div>

            <div
              className={`rounded-[26px] border p-5 ${theme.card}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <CreditCard size={22} />

                <h2 className="text-2xl font-black">
                  {lang === "uz"
                    ? "To‘lov turi"
                    : "Тип оплаты"}
                </h2>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() =>
                    setPayment(
                      "cash"
                    )
                  }
                  className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-3 text-center font-black transition ${
                    payment ===
                    "cash"
                      ? "bg-orange-500 text-white"
                      : theme.input
                  }`}
                >
                  <Banknote size={20} />
                  Naqd
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPayment(
                      "click"
                    )
                  }
                  className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-3 text-center font-black transition ${
                    payment ===
                    "click"
                      ? "bg-orange-500 text-white"
                      : theme.input
                  }`}
                >
                  Click
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPayment(
                      "payme"
                    )
                  }
                  className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-3 text-center font-black transition ${
                    payment ===
                    "payme"
                      ? "bg-orange-500 text-white"
                      : theme.input
                  }`}
                >
                  Payme
                </button>
              </div>
            </div>
          </div>

          <aside
            className={`h-fit rounded-[26px] border p-5 ${theme.card}`}
          >
            <h2 className="text-3xl font-black">
              {lang === "uz"
                ? "Buyurtma"
                : "Заказ"}
            </h2>

            <div className="mt-4 grid gap-3">
              {items.map((item) =>
                item ? (
                  <div
                    key={item.slug}
                    className={`rounded-2xl border p-3 ${theme.input}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-black">
                          {item.name}
                        </div>

                        <div
                          className={`mt-1 text-sm ${theme.soft}`}
                        >
                          x{item.qty}
                        </div>
                      </div>

                      <div className="text-base font-black text-orange-500">
                        {formatPrice(
                          item.price *
                            item.qty
                        )}
                      </div>
                    </div>

                    {item.oldPrice &&
                      item.oldPrice >
                        item.price && (
                        <div className="mt-2 text-sm font-bold text-zinc-400 line-through">
                          {formatPrice(
                            item.oldPrice *
                              item.qty
                          )}
                        </div>
                      )}
                  </div>
                ) : null
              )}
            </div>

            <div className="mt-4 border-t border-black/10 pt-4">
              <div className="flex justify-between text-sm font-bold">
                <span
                  className={theme.soft}
                >
                  {lang === "uz"
                    ? "Eski narx"
                    : "Старая цена"}
                </span>

                <span className="line-through text-zinc-400">
                  {formatPrice(
                    oldTotal
                  )}
                </span>
              </div>

              {saved > 0 && (
                <div className="mt-2 flex justify-between rounded-2xl bg-green-500/10 px-4 py-3 text-sm font-black text-green-600">
                  <span>
                    {lang === "uz"
                      ? "Siz tejaysiz"
                      : "Ваша выгода"}
                  </span>

                  <span>
                    {formatPrice(
                      saved
                    )}
                  </span>
                </div>
              )}

              <div className="mt-4 flex justify-between text-sm font-bold">
                <span
                  className={theme.soft}
                >
                  {lang === "uz"
                    ? "Yetkazish"
                    : "Доставка"}
                </span>

                <span>
                  {delivery ===
                  "courier"
                    ? "Kuryer"
                    : "Pickup"}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm font-bold">
                <span
                  className={theme.soft}
                >
                  {lang === "uz"
                    ? "To‘lov"
                    : "Оплата"}
                </span>

                <span>
                  {payment ===
                  "cash"
                    ? "Naqd"
                    : payment ===
                      "click"
                    ? "Click"
                    : "Payme"}
                </span>
              </div>

              <div className="mt-4 border-t border-black/10 pt-4">
                <div className="flex items-end justify-between gap-3">
                  <span className="text-2xl font-black">
                    {lang === "uz"
                      ? "Jami"
                      : "Итого"}
                  </span>

                  <span className="text-3xl font-black text-orange-500">
                    {formatPrice(
                      total
                    )}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={
                finishOrder
              }
              className="mt-5 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-5 py-4 text-base font-black text-white"
            >
              {lang === "uz"
                ? "Buyurtma berish"
                : "Оформить заказ"}
            </button>

            <Link
              href="/cart"
              className={`mt-3 flex w-full items-center justify-center rounded-2xl border px-5 py-4 text-base font-black ${theme.input}`}
            >
              {lang === "uz"
                ? "Savatga qaytish"
                : "Назад"}
            </Link>
          </aside>
        </div>
      </section>
      <footer/>
    </main>
  );
}