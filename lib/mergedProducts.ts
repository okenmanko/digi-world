import { products as staticProducts } from "./products";
import { getSupabaseProducts } from "./supabaseProducts";

export type MergedProduct = {
  id?: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image?: string;
  emoji?: string;
  categoryUz?: string;
  categoryRu?: string;
  shortUz?: string;
  shortRu?: string;
  descriptionUz?: string;
  descriptionRu?: string;
  rating: number;
  inStock: boolean;
};

export async function getFullMergedProducts(): Promise<MergedProduct[]> {
  const supabaseProducts = await getSupabaseProducts();

  const mappedSupabaseProducts: MergedProduct[] = (supabaseProducts || []).map(
    (p: any) => {
      const price = Number(p.price || 0);
      const oldPrice = p.old_price ? Number(p.old_price) : null;

      return {
        id: p.id,
        name: p.name || "No name",
        slug: p.slug,
        price,
        oldPrice,
        image: p.image || "",
        emoji: "📦",
        categoryUz: p.category || "Boshqa",
        categoryRu: p.category || "Другое",
        shortUz:
          p.short_uz ||
          p.description ||
          `${p.name || "Mahsulot"} — Digi World katalogidagi mahsulot.`,
        shortRu:
          p.short_ru ||
          p.description_ru ||
          `${p.name || "Товар"} — товар из каталога Digi World.`,
        descriptionUz:
          p.description_uz ||
          p.description ||
          `${p.name || "Mahsulot"} — Digi World katalogidagi mahsulot.`,
        descriptionRu:
          p.description_ru ||
          p.description ||
          `${p.name || "Товар"} — товар из каталога Digi World.`,
        rating: Number(p.rating || 5),
        inStock: p.stock !== false,
      };
    }
  );

  const mappedStaticProducts: MergedProduct[] = staticProducts.map((p: any) => ({
    id: p.id,
    name: p.name || "No name",
    slug: p.slug,
    price: Number(p.price || 0),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    image: p.image || "",
    emoji: p.emoji || "📦",
    categoryUz: p.categoryUz || p.category || "Boshqa",
    categoryRu: p.categoryRu || p.category || "Другое",
    shortUz: p.shortUz || p.descriptionUz || "",
    shortRu: p.shortRu || p.descriptionRu || "",
    descriptionUz: p.descriptionUz || p.description || "",
    descriptionRu: p.descriptionRu || p.description || "",
    rating: Number(p.rating || 5),
    inStock: p.inStock !== false,
  }));

  const map = new Map<string, MergedProduct>();

  for (const product of mappedStaticProducts) {
    map.set(product.slug, product);
  }

  for (const product of mappedSupabaseProducts) {
    map.set(product.slug, product);
  }

  return Array.from(map.values());
}