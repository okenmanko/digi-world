import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST() {
  try {
    const code = generateCode();

    const { error } = await supabase.from("telegram_login_codes").insert({
      code,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        { success: false, error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Create code error" },
      { status: 500 }
    );
  }
}