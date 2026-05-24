import { NextResponse } from "next/server";

const MOYSKLAD_API_URL =
  "https://api.moysklad.ru/api/remap/1.2/entity/product";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

function getPriceFromMoySklad(product: any) {
  const salePrice = product.salePrices?.[0]?.value;

  if (!salePrice) return 0;

  return Number(salePrice) / 100;
}

function getStockFromMoySklad(product: any) {
  return Boolean(product.archived === false);
}

export async function GET() {
  try {
    const token = process.env.MOYSKLAD_TOKEN;
    const usdRate = Number(process.env.MOYSKLAD_USD_RATE || 12900);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "MOYSKLAD_TOKEN .env.local ichida yo‘q",
        },
        { status: 500 }
      );
    }

    const response = await fetch(`${MOYSKLAD_API_URL}?limit=100`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;charset=utf-8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();

      return NextResponse.json(
        {
          success: false,
          status: response.status,
          error: text,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const products =
      data.rows?.map((product: any) => {
        const usdPrice = getPriceFromMoySklad(product);
        const uzsPrice = Math.round(usdPrice * usdRate);

        return {
          moysklad_id: product.id,
          name: product.name || "No name",
          slug: createSlug(product.name || product.id),
          code: product.code || "",
          article: product.article || "",
          category: product.productFolder?.meta?.href ? "MoySklad" : "MoySklad",
          price_usd: usdPrice,
          price: uzsPrice,
          old_price: Math.round(uzsPrice * 1.15),
          image: "",
          description:
            product.description ||
            `${product.name || "Mahsulot"} — Digi World katalogidagi mahsulot.`,
          stock: getStockFromMoySklad(product),
        };
      }) || [];

    return NextResponse.json({
      success: true,
      count: products.length,
      usd_rate: usdRate,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "MoySklad import error",
      },
      { status: 500 }
    );
  }
}