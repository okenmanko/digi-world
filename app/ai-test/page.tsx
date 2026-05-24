"use client";

import { useState } from "react";

export default function AiTestPage() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  async function generate() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/ai/product-card",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: "Samsung Smart TV 55",
            category: "TV",
            price: 6500000,
          }),
        }
      );

      const data =
        await response.json();

      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error:
          error.message ||
          "AI error",
      });
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-5xl font-black">
          AI Product Card Test
        </h1>

        <button
          onClick={generate}
          disabled={loading}
          className="mt-8 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-7 py-5 text-xl font-black text-white disabled:opacity-60"
        >
          {loading
            ? "Generating..."
            : "Generate AI Card"}
        </button>

        {result && (
          <pre className="mt-10 overflow-auto rounded-3xl border border-white/10 bg-zinc-900 p-6 text-sm leading-7 text-zinc-200">
            {JSON.stringify(
              result,
              null,
              2
            )}
          </pre>
        )}
      </div>
    </main>
  );
}