import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Code required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("telegram_login_codes")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({
        success: false,
        status: "not_found",
      });
    }

    if (data.status !== "confirmed") {
      return NextResponse.json({
        success: false,
        status: data.status,
      });
    }

    const user = {
      telegram_id: data.telegram_id,
      username: data.telegram_username,
      first_name: data.telegram_first_name,
    };

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set("tg_auth", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Check code error" },
      { status: 500 }
    );
  }
}