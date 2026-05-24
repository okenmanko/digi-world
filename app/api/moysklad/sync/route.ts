import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MOYSKLAD_API_URL =
  "https://api.moysklad.ru/api/remap/1.2/entity/product";

const USD_RATE = 12200;

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

function getUsdPrice(product: any) {
  const salePrice = product.salePrices?.[0]?.value;

  if (!salePrice) return 0;

  return Number(salePrice) / 100;
}

function getMarkupPercent(usdPrice: number) {
  if (usdPrice <= 100) return 20;
  if (usdPrice <= 300) return 15;
  if (usdPrice <= 600) return 10;
  return 5;
}

function calculateFinalPrice(usdPrice: number) {
  const markupPercent = getMarkupPercent(usdPrice);
  const baseUzs = usdPrice * USD_RATE;
  const finalPrice = Math.round(baseUzs * (1 + markupPercent / 100));

  return finalPrice;
}

function calculateOldPrice(price: number) {
  return Math.round(price * 1.15);
}

export async function GET() {
  try {
    const token = process.env.MOYSKLAD_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "MOYSKLAD_TOKEN topilmadi",
        },
        { status: 500 }
      );
    }

    const response = await fetch(`${MOYSKLAD_API_URL}?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;charset=utf-8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          step: "moysklad_fetch",
          status: response.status,
          error: await response.text(),
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rows = data.rows || [];

    let insertedOrUpdated = 0;
    const failed: any[] = [];

    for (const row of rows) {
      try {
        const name = row.name || "No name";
        const usdPrice = getUsdPrice(row);

        const price = calculateFinalPrice(usdPrice);
        const oldPrice = calculateOldPrice(price);
        const markupPercent = getMarkupPercent(usdPrice);

        const product = {
          name,
          slug: createSlug(name || row.id),
          price,
          old_price: oldPrice,
          image: "",
          category: row.productFolder?.name || "MoySklad",
          description:
            row.description || `${name} — Digi World katalogidagi mahsulot.`,
          stock: row.archived === false,
          rating: 4.8,
        };

        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("slug", product.slug)
          .maybeSingle();

        if (existing?.id) {
          const { error } = await supabase
            .from("products")
            .update(product)
            .eq("id", existing.id);

          if (error) {
            failed.push({
              name,
              step: "update",
              error,
            });
          } else {
            insertedOrUpdated++;
          }
        } else {
          const { error } = await supabase.from("products").insert(product);

          if (error) {
            failed.push({
              name,
              step: "insert",
              error,
            });
          } else {
            insertedOrUpdated++;
          }
        }
      } catch (error: any) {
        failed.push({
          name: row?.name || "unknown",
          step: "loop",
          error: error.message || String(error),
        });
      }
    }

    return NextResponse.json({
      success: failed.length === 0,
      usd_rate: USD_RATE,
      moysklad_count: rows.length,
      attempted: rows.length,
      inserted_or_updated: insertedOrUpdated,
      failed_count: failed.length,
      failed: failed.slice(0, 10),
      formula: {
        usd_0_100: "+20%",
        usd_101_300: "+15%",
        usd_301_600: "+10%",
        usd_600_plus: "+5%",
        old_price: "price + 15%",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        step: "catch",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}