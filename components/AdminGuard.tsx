"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { isAdminLogged } from "@/lib/adminAuth";

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({
  children,
}: Props) {
  const router = useRouter();

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    if (!isAdminLogged()) {
      router.push("/admin");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return <>{children}</>;
}