"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";
import { getCart } from "@/lib/cart";
import { getFavorites } from "@/lib/favorites";
import { getCompare } from "@/lib/compare";
import { isLoggedIn } from "@/lib/auth";

type Lang = "uz" | "ru";

type AppContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;

  dark: boolean;
  setDark: (value: boolean) => void;

  logged: boolean;
  setLogged: (value: boolean) => void;

  cartCount: number;
  favoritesCount: number;
  compareCount: number;

  refreshCartCount: () => void;
  refreshFavoritesCount: () => void;
  refreshCompareCount: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");
  const [dark, setDarkState] = useState(false);
  const [logged, setLogged] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);

  function refreshCartCount() {
    setCartCount(getCart().reduce((sum, item) => sum + item.qty, 0));
  }

  function refreshFavoritesCount() {
    setFavoritesCount(getFavorites().length);
  }

  function refreshCompareCount() {
    setCompareCount(getCompare().length);
  }

  function setLang(value: Lang) {
    setLangState(value);
    localStorage.setItem("digi_world_lang", value);
  }

  function setDark(value: boolean) {
    setDarkState(value);
    localStorage.setItem("digi_world_dark", value ? "true" : "false");
  }

  useEffect(() => {
    const savedLang = localStorage.getItem("digi_world_lang") as Lang | null;
    const savedDark = localStorage.getItem("digi_world_dark");

    if (savedLang === "uz" || savedLang === "ru") {
      setLangState(savedLang);
    }

    if (savedDark === "true") {
      setDarkState(true);
    }

    refreshCartCount();
    refreshFavoritesCount();
    refreshCompareCount();

    setLogged(isLoggedIn());

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setLogged(true);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLogged(!!session || isLoggedIn());
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,

        dark,
        setDark,

        logged,
        setLogged,

        cartCount,
        favoritesCount,
        compareCount,

        refreshCartCount,
        refreshFavoritesCount,
        refreshCompareCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}