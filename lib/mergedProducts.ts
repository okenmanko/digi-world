import { products } from "./products";
import { getSupabaseProducts } from "./supabaseProducts";

export type MergedProduct = {
  id: string | number;
  slug: string;
  name: string;
  categoryUz: string;
  categoryRu: string;
  price: number;
  oldPrice?: number;
  emoji: string;
  image?: string;
  shortUz: string;
  shortRu: string;
  descriptionUz: string;
  descriptionRu: string;
  inStock: boolean;
  rating: number;
};

export function getLocalMergedProducts(): MergedProduct[] {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryUz: p.categoryUz,
    categoryRu: p.categoryRu,
    price: p.price,
    oldPrice: p.oldPrice,
    emoji: p.emoji,
    image: "",
    shortUz: p.shortUz,
    shortRu: p.shortRu,
    descriptionUz: p.descriptionUz,
    descriptionRu: p.descriptionRu,
    inStock: p.inStock,
    rating: p.rating,
  }));
}

export async function getFullMergedProducts(): Promise<MergedProduct[]> {
  const supabaseProducts = await getSupabaseProducts();

  const mappedSupabaseProducts: MergedProduct[] = supabaseProducts.map(
    (p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      categoryUz: p.category,
      categoryRu: p.category,
      price: Number(p.price || 0),
      oldPrice: undefined,
      emoji: "📦",
      image: p.image || "",
      shortUz: p.description || "Supabase orqali qo‘shilgan mahsulot.",
      shortRu: p.description || "Товар добавлен через Supabase.",
      descriptionUz: p.description || "Supabase orqali qo‘shilgan mahsulot.",
      descriptionRu: p.description || "Товар добавлен через Supabase.",
      inStock: Boolean(p.stock),
      rating: 5,
    })
  );

  return [...mappedSupabaseProducts, ...getLocalMergedProducts()];
}