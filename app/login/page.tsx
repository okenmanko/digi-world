"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, UserPlus } from "lucide-react";

import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { saveUser } from "@/lib/auth";
import { signInUser, signUpUser } from "@/lib/supabaseAuth";

export default function LoginPage() {
  const router = useRouter();
  const { lang, dark, setLogged } = useApp();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const theme = {
    page: dark ? "bg-[#050505] text-white" : "bg-[#f6f7fb] text-zinc-950",
    card: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white",
    input:
      dark
        ? "border-white/10 bg-white/5 text-white"
        : "border-black/10 bg-white text-zinc-950",
    soft: dark ? "text-zinc-400" : "text-zinc-600",
  };

  async function submit() {
    if (!email || !password) {
      alert(lang === "uz" ? "Email va parol kerak" : "Нужны email и пароль");
      return;
    }

    if (mode === "register" && (!name || !phone)) {
      alert(lang === "uz" ? "Ism va telefon kerak" : "Нужны имя и телефон");
      return;
    }

    setLoading(true);

    const result =
      mode === "login"
        ? await signInUser({ email, password })
        : await signUpUser({ name, phone, email, password });

    setLoading(false);

    if (!result.success) {
      alert(result.error || "Auth error");
      return;
    }

    saveUser({
      name: mode === "register" ? name : email,
      phone: mode === "register" ? phone : email,
    });

    setLogged(true);
    router.push("/profile");
  }

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <Navbar />

      <section className="mx-auto flex min-h-[75vh] max-w-[560px] items-center justify-center px-5 py-10">
        <div className={`w-full rounded-[36px] border p-8 ${theme.card}`}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
            <Lock size={38} />
          </div>

          <h1 className="mt-6 text-center text-4xl font-black">
            {mode === "login"
              ? lang === "uz"
                ? "Kirish"
                : "Вход"
              : lang === "uz"
              ? "Ro‘yxatdan o‘tish"
              : "Регистрация"}
          </h1>

          <p className={`mt-3 text-center font-medium ${theme.soft}`}>
            {lang === "uz"
              ? "Digi World shaxsiy kabineti"
              : "Личный кабинет Digi World"}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("login")}
              className={`rounded-2xl border px-5 py-3 font-black ${
                mode === "login"
                  ? "border-orange-500 bg-orange-500 text-white"
                  : theme.input
              }`}
            >
              {lang === "uz" ? "Kirish" : "Вход"}
            </button>

            <button
              onClick={() => setMode("register")}
              className={`rounded-2xl border px-5 py-3 font-black ${
                mode === "register"
                  ? "border-orange-500 bg-orange-500 text-white"
                  : theme.input
              }`}
            >
              {lang === "uz" ? "Register" : "Регистрация"}
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {mode === "register" && (
              <>
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
              </>
            )}

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@example.com"
              className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={lang === "uz" ? "Parol" : "Пароль"}
              className={`rounded-2xl border px-5 py-4 outline-none ${theme.input}`}
            />

            <button
              onClick={submit}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-4 font-black text-white disabled:opacity-60"
            >
              {mode === "login" ? <LogIn size={20} /> : <UserPlus size={20} />}

              {loading
                ? lang === "uz"
                  ? "Yuklanmoqda..."
                  : "Загрузка..."
                : mode === "login"
                ? lang === "uz"
                  ? "Kirish"
                  : "Войти"
                : lang === "uz"
                ? "Ro‘yxatdan o‘tish"
                : "Зарегистрироваться"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}