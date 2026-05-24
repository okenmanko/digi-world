"use client";

import Link from "next/link";
import {
    Camera,
    MapPin,
    Phone,
    Send,
} from "lucide-react";

import { useApp } from "@/context/AppContext";

export default function Footer() {
    const { dark, lang } = useApp();

    const theme = {
        footer: dark
            ? "border-white/10 bg-[#050505] text-white"
            : "border-black/10 bg-white text-zinc-950",

        soft: dark
            ? "text-zinc-400"
            : "text-zinc-600",
    };

    return (
        <footer className={`mt-10 border-t ${theme.footer}`}>
            <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 md:grid-cols-4">
                {/* LOGO */}
                <div>
                    <h2 className="text-3xl font-black">
                        Digi World
                    </h2>

                    <p
                        className={`mt-4 text-sm font-medium leading-relaxed ${theme.soft}`}
                    >
                        {lang === "uz"
                            ? "Uy va biznes uchun ishonchli texnika. Kafolat, tez yetkazib berish va qulay buyurtma."
                            : "Надёжная техника для дома и бизнеса. Гарантия, быстрая доставка и удобный заказ."}
                    </p>
                </div>

                {/* CONTACT */}
                <div>
                    <h3 className="text-lg font-black">
                        {lang === "uz"
                            ? "Aloqa"
                            : "Контакты"}
                    </h3>

                    <div
                        className={`mt-4 grid gap-4 text-sm font-bold ${theme.soft}`}
                    >
                        <a
                            href="tel:+998553022002"
                            className="flex items-center gap-3 transition hover:text-orange-500"
                        >
                            <Phone
                                size={18}
                                className="text-orange-500"
                            />

                            +998 55 302 20 02
                        </a>

                        <a
                            href="https://t.me/digiworldbukhara"
                            target="_blank"
                            className="flex items-center gap-3 transition hover:text-orange-500"
                        >
                            <Send
                                size={18}
                                className="text-orange-500"
                            />

                            @digiworldbukhara
                        </a>

                        <a
                            href="https://instagram.com/digiworlduz"
                            target="_blank"
                            className="flex items-center gap-3 transition hover:text-orange-500"
                        >
                            <Camera
                                size={18}
                                className="text-orange-500"
                            />
                            @digiworlduz
                        </a>
                    </div>
                </div>

                {/* ADDRESS */}
                <div>
                    <h3 className="text-lg font-black">
                        {lang === "uz"
                            ? "Manzil"
                            : "Адрес"}
                    </h3>

                    <div
                        className={`mt-4 flex gap-3 text-sm font-bold ${theme.soft}`}
                    >
                        <MapPin
                            size={18}
                            className="mt-0.5 shrink-0 text-orange-500"
                        />

                        <div>
                            Bukhara, Uzbekistan
                        </div>
                    </div>
                </div>

                {/* LINKS */}
                <div>
                    <h3 className="text-lg font-black">
                        {lang === "uz"
                            ? "Bo‘limlar"
                            : "Разделы"}
                    </h3>

                    <div
                        className={`mt-4 grid gap-4 text-sm font-bold ${theme.soft}`}
                    >
                        <Link
                            href="/"
                            className="transition hover:text-orange-500"
                        >
                            {lang === "uz"
                                ? "Bosh sahifa"
                                : "Главная"}
                        </Link>

                        <Link
                            href="/catalog"
                            className="transition hover:text-orange-500"
                        >
                            {lang === "uz"
                                ? "Katalog"
                                : "Каталог"}
                        </Link>

                        <Link
                            href="/cart"
                            className="transition hover:text-orange-500"
                        >
                            {lang === "uz"
                                ? "Savat"
                                : "Корзина"}
                        </Link>
                    </div>
                </div>
            </div>

            <div
                className={`border-t px-5 py-4 text-center text-sm font-bold ${theme.soft}`}
            >
                © {new Date().getFullYear()} Digi World.
                {" "}
                {lang === "uz"
                    ? "Barcha huquqlar himoyalangan."
                    : "Все права защищены."}
            </div>
        </footer>
    );
}