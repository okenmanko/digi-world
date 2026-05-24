import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MOYSKLAD_API_URL =
    "https://api.moysklad.ru/api/remap/1.2/entity/product";

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9а-яё]+/gi, "-")
        .replace(/(^-|-$)/g, "");
}

function getPrice(product: any) {
    const salePrice = product.salePrices?.[0]?.value;
    if (!salePrice) return 0;
    return Number(salePrice) / 100;
}

async function getProductImage(product: any, token: string) {
    try {
        const imagesHref = product.images?.meta?.href;
        if (!imagesHref) return "";

        const res = await fetch(imagesHref, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json;charset=utf-8",
            },
            cache: "no-store",
        });

        if (!res.ok) return "";

        const data = await res.json();
        const first = data.rows?.[0];

        return first?.miniature?.href || first?.tiny?.href || first?.meta?.downloadHref || "";
    } catch {
        return "";
    }
}

async function generateAiCard(product: {
    name: string;
    category: string;
    price: number;
}) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
        const prompt = `
Sen professional ecommerce copywriter va Uzum Market product card specialistisan.

Mahsulot:
Nomi: ${product.name}
Kategoriya: ${product.category}
Narx: ${product.price}

Digi World maishiy texnika do‘koni uchun mahsulot kartochkasini tayyorla.

JSON formatda qaytar:
{
  "name_uz": "...",
  "name_ru": "...",
  "category": "...",
  "short_uz": "...",
  "short_ru": "...",
  "description_uz": "...",
  "description_ru": "...",
  "seo_uz": "...",
  "seo_ru": "..."
}

Qoidalar:
- Faqat JSON qaytar
- Juda uzun yozma
- Yolg‘on texnik xarakteristika qo‘shma
- Oddiy mijoz tushunadigan tilda yoz
- Uzbek va rus matnlar sotuvga yo‘naltirilgan bo‘lsin
- SEO Uzum Market uchun mos bo‘lsin
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        const data = await response.json();
        if (!response.ok) return null;

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch {
        return null;
    }
}

export async function GET() {
    try {
        const token = process.env.MOYSKLAD_TOKEN;
        const usdRate = Number(process.env.MOYSKLAD_USD_RATE || 12900);

        if (!token) {
            return NextResponse.json(
                { success: false, error: "MOYSKLAD_TOKEN topilmadi" },
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
        let aiGenerated = 0;
        let imagesFound = 0;
        const failed: any[] = [];

        for (const row of rows) {
            try {
                const baseName = row.name || "No name";
                const baseCategory = "MoySklad";
                const usdPrice = getPrice(row);
                const price = Math.round(usdPrice * usdRate);
                const image = await getProductImage(row, token);

                if (image) imagesFound++;

                const ai = await generateAiCard({
                    name: baseName,
                    category: baseCategory,
                    price,
                });

                if (ai) aiGenerated++;

                const product = {
                    name: ai?.name_uz || baseName,
                    slug: createSlug(baseName || row.id),
                    price,
                    old_price: price > 0 ? Math.round(price * 1.15) : null,
                    image:
                        `https://source.unsplash.com/featured/600x600/?${encodeURIComponent(baseName)}`, category: ai?.category || baseCategory,
                    description:
                        ai?.description_uz ||
                        row.description ||
                        `${baseName} — Digi World katalogidagi mahsulot.`,
                    description_uz:
                        ai?.description_uz ||
                        row.description ||
                        `${baseName} — Digi World katalogidagi mahsulot.`,
                    description_ru:
                        ai?.description_ru ||
                        `${baseName} — товар из каталога Digi World.`,
                    short_uz:
                        ai?.short_uz ||
                        `${baseName} — Digi World’dan sifatli mahsulot.`,
                    short_ru:
                        ai?.short_ru ||
                        `${baseName} — качественный товар от Digi World.`,
                    seo_uz: ai?.seo_uz || `${baseName}, Digi World, texnika`,
                    seo_ru: ai?.seo_ru || `${baseName}, Digi World, техника`,
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

                    if (error) failed.push({ name: baseName, step: "update", error });
                    else insertedOrUpdated++;
                } else {
                    const { error } = await supabase.from("products").insert(product);

                    if (error) failed.push({ name: baseName, step: "insert", error });
                    else insertedOrUpdated++;
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
            moysklad_count: rows.length,
            attempted: rows.length,
            inserted_or_updated: insertedOrUpdated,
            ai_generated: aiGenerated,
            images_found: imagesFound,
            failed_count: failed.length,
            failed: failed.slice(0, 10),
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, step: "catch", error: error.message || String(error) },
            { status: 500 }
        );
    }
}