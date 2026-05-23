"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { getCart, clearCart, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { createOrder } from "@/lib/orders";
import { createSupabaseOrder } from "@/lib/supabaseOrders";
import {
  getFullMergedProducts,
  type MergedProduct,
} from "@/lib/mergedProducts";

export default function CheckoutPage() {
  const router = useRouter();
  const { dark, lang, refreshCartCount } = useApp();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<MergedProduct[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [delivery, setDelivery] = useState("courier");
  const [payment, setPayment] = useState("cash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setCart(getCart());
      const data = await getFullMergedProducts();
      setProducts(data);
    }

    load();
  }, []);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.slug === item.slug);

      if (!product) return null;

      return {
        ...product,
        qty: item.qty,
      };
    })
    .filter(Boolean);

  const total = cartItems.reduce(
    (sum, item) => (item ? sum + item.price * item.qty : sum),
    0
  );

  function deliveryLabel() {
    return delivery === "courier"
      ? lang === "uz"
        ? "Kuryer"
        : "Курьер"
      : lang === "uz"
      ? "Olib ketish"
      : "Самовывоз";
  }

  function paymentLabel() {
    if (payment === "cash") return lang === "uz" ? "Naqd" : "Наличные";
    if (payment === "card") return lang === "uz" ? "Karta" : "Карта";
    return lang === "uz" ? "Bo‘lib to‘lash" : "Рассрочка";
  }

  async function submitOrder() {
    if (!name || !phone || !address) {
      alert(
        lang === "uz"
          ? "Ism, telefon va manzilni to‘ldiring"
          : "Заполните имя, телефон и адрес"
      );
      return;
    }

    if (cartItems.length === 0) {
      alert(lang === "uz" ? "Savat bo‘sh" : "Корзина пустая");
      return;
    }

    setLoading(true);

    const items = cartItems.map((item) => ({
      slug: item!.slug,
      name: item!.name,
      price: item!.price,
      qty: item!.qty,
    }));

    const localOrder = createOrder({
      customerName: name,
      phone,
      city,
      address,
      comment: "",
      delivery: deliveryLabel(),
      payment: paymentLabel(),
      items,
      total,
    });

    const supabaseOrder = await createSupabaseOrder({
      customer_name: name,
      customer_phone: phone,
      items,
      total,
    });

    if (!supabaseOrder.success) {
      setLoading(false);
      alert(
        lang === "uz"
          ? "Supabase order saqlamadi. RLS policy kerak bo‘lishi mumkin."
          : "Supabase не сохранил заказ. Возможно нужна RLS policy."
      );
      return;
    }

    const realOrderId =
      supabaseOrder.data?.[0]?.id || localOrder.id;

    localStorage.setItem("digi_world_last_order_id", realOrderId);

    clearCart();
    refreshCartCount();

    setLoading(false);
    router.push("/success");
  }

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto max-w-[1440px] px-5 py-8">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 font-bold text-orange-500"
        >
          <ArrowLeft size={18} />
          {lang === "uz" ? "Savatga qaytish" : "Назад в корзину"}
        </Link>

        <div className={`rounded-[36px] border p-6 md:p-8 ${theme.card}`}>
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-orange-500" size={36} />

            <h1 className="text-4xl font-black md:text-6xl">
              {lang === "uz" ? "Checkout" : "Оформление"}
            </h1>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="grid gap-6">
            <div className={`rounded-[32px] border p-6 ${theme.card}`}>
              <h2 className="text-2xl font-black">
                {lang === "uz" ? "Mijoz ma’lumotlari" : "Данные клиента"}
              </h2>

              <div className="mt-5 grid gap-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "uz" ? "Ismingiz" : "Ваше имя"}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={lang === "uz" ? "Shahar" : "Город"}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />

                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={lang === "uz" ? "Manzil" : "Адрес"}
                  className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
                />
              </div>
            </div>

            <div className={`rounded-[32px] border p-6 ${theme.card}`}>
              <h2 className="flex items-center gap-2 text-2xl font-black">
                <Truck size={24} />
                {lang === "uz" ? "Yetkazib berish" : "Доставка"}
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <button
                  onClick={() => setDelivery("courier")}
                  className={`rounded-2xl border px-5 py-4 text-left font-black ${
                    delivery === "courier"
                      ? "border-orange-500 bg-orange-500 text-white"
                      : theme.input
                  }`}
                >
                  {lang === "uz" ? "Kuryer" : "Курьер"}
                </button>

                <button
                  onClick={() => setDelivery("pickup")}
                  className={`rounded-2xl border px-5 py-4 text-left font-black ${
                    delivery === "pickup"
                      ? "border-orange-500 bg-orange-500 text-white"
                      : theme.input
                  }`}
                >
                  {lang === "uz" ? "Olib ketish" : "Самовывоз"}
                </button>
              </div>
            </div>

            <div className={`rounded-[32px] border p-6 ${theme.card}`}>
              <h2 className="flex items-center gap-2 text-2xl font-black">
                <CreditCard size={24} />
                {lang === "uz" ? "To‘lov turi" : "Способ оплаты"}
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  { id: "cash", uz: "Naqd", ru: "Наличные" },
                  { id: "card", uz: "Karta", ru: "Карта" },
                  { id: "installment", uz: "Bo‘lib to‘lash", ru: "Рассрочка" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPayment(item.id)}
                    className={`rounded-2xl border px-5 py-4 text-left font-black ${
                      payment === item.id
                        ? "border-orange-500 bg-orange-500 text-white"
                        : theme.input
                    }`}
                  >
                    {lang === "uz" ? item.uz : item.ru}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className={`h-fit rounded-[32px] border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-black">
              {lang === "uz" ? "Buyurtma" : "Заказ"}
            </h2>

            {cartItems.length === 0 ? (
              <div className={`mt-6 rounded-2xl border p-5 text-center ${theme.input}`}>
                <ShoppingBag className="mx-auto text-orange-500" size={38} />

                <p className={`mt-3 font-bold ${theme.soft}`}>
                  {lang === "uz" ? "Savat bo‘sh" : "Корзина пустая"}
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {cartItems.map((item) =>
                  item ? (
                    <div
                      key={item.slug}
                      className={`rounded-2xl border p-4 ${theme.input}`}
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <div className="font-black">{item.name}</div>
                          <div className={`mt-1 text-sm ${theme.soft}`}>
                            x{item.qty}
                          </div>
                        </div>

                        <div className="font-black text-orange-500">
                          {formatPrice(item.price * item.qty)}
                        </div>
                      </div>
                    </div>
                  ) : null
                )}

                <div className="h-px bg-orange-500/20" />

                <div className="flex items-center justify-between">
                  <span className={`font-black ${theme.soft}`}>
                    {lang === "uz" ? "Jami" : "Итого"}
                  </span>

                  <span className="text-2xl font-black text-orange-500">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={submitOrder}
                  disabled={loading}
                  className="mt-3 w-full rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-black text-white disabled:opacity-60"
                >
                  {loading
                    ? lang === "uz"
                      ? "Yuborilmoqda..."
                      : "Отправляется..."
                    : lang === "uz"
                    ? "Buyurtmani yuborish"
                    : "Отправить заказ"}
                </button>

                <div className={`mt-2 flex items-center justify-center gap-2 text-sm ${theme.soft}`}>
                  <Phone size={16} />
                  +998 90 123 45 67
                </div>

                <div className={`flex items-center justify-center gap-2 text-sm ${theme.soft}`}>
                  <MapPin size={16} />
                  Tashkent, Uzbekistan
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}