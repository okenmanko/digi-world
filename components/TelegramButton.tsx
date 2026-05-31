"use client";

import { Send } from "lucide-react";

export default function TelegramButton() {
  return (
    <a
      href="https://t.me/digiworldbukhara"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[999] flex items-center gap-3 rounded-full bg-[#229ED9] px-5 py-4 font-black text-white shadow-2xl transition hover:scale-105"
    >
      <Send size={22} />
      Telegram
    </a>
  );
}