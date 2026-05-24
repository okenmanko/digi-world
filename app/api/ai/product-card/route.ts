import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY .env.local ichida yo‘q" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const name = body.name || "";
    const category = body.category || "";
    const price = body.price || "";

    const prompt = `
Sen professional ecommerce copywriter va Uzum Market product card specialistisan.

Mahsulot:
Nomi: ${name}
Kategoriya: ${category}
Narx: ${price}

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
- Yolg‘on texnik xarakteristika qo‘shma
- Uzbek va rus matnlar sotuvga yo‘naltirilgan bo‘lsin
- SEO Uzum Market uchun mos bo‘lsin
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data },
        { status: response.status }
      );
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { raw: cleaned };
    }

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Gemini error" },
      { status: 500 }
    );
  }
}