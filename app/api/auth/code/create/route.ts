import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function createCode() {
  const code = generateCode();

  const { error } = await supabase.from("telegram_login_codes").insert({
    code,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, code });
}

export async function GET() {
  return createCode();
}

export async function POST() {
  return createCode();
}