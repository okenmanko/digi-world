import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function sendTelegramMessage(chatId: string | number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    const message = update.message;
    const text = message?.text?.trim();
    const chat = message?.chat;
    const from = message?.from;

    if (!message || !chat) {
      return NextResponse.json({ ok: true });
    }

    if (text === "/start") {
      await sendTelegramMessage(
        chat.id,
        "Assalomu alaykum! Digi World saytiga kirish uchun saytda chiqqan 6 xonali kodni shu yerga yuboring."
      );

      return NextResponse.json({ ok: true });
    }

    if (!/^\d{6}$/.test(text || "")) {
      await sendTelegramMessage(
        chat.id,
        "Iltimos, saytda chiqqan 6 xonali kodni yuboring. Masalan: 482913"
      );

      return NextResponse.json({ ok: true });
    }

    const { data, error } = await supabase
      .from("telegram_login_codes")
      .select("*")
      .eq("code", text)
      .eq("status", "pending")
      .maybeSingle();

    if (error || !data) {
      await sendTelegramMessage(
        chat.id,
        "Kod topilmadi yoki allaqachon ishlatilgan. Saytda yangi kod oling."
      );

      return NextResponse.json({ ok: true });
    }

    await supabase
      .from("telegram_login_codes")
      .update({
        status: "confirmed",
        telegram_id: String(from?.id || chat.id),
        telegram_username: from?.username || "",
        telegram_first_name: from?.first_name || "",
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    await sendTelegramMessage(
      chat.id,
      "✅ Tasdiqlandi! Endi saytga qayting, avtomatik kiradi."
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Telegram webhook error" },
      { status: 500 }
    );
  }
}