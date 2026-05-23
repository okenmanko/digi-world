"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { isLoggedIn } from "@/lib/auth";

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();

      if (data.session || isLoggedIn()) {
        setAllowed(true);
        return;
      }

      router.push("/login");
    }

    checkAuth();
  }, [router]);

  if (!allowed) return null;

  return <>{children}</>;
}