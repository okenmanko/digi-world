import { supabase } from "./supabase";

export type SupabaseProductPayload = {
  name: string;
  slug: string;
  price: number;
  old_price?: number | null;
  image: string;
  category: string;
  description: string;
  stock: boolean;
};

export async function getSupabaseProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function createSupabaseProduct(product: SupabaseProductPayload) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      slug: product.slug,
      price: product.price,
      old_price: product.old_price || null,
      image: product.image,
      category: product.category,
      description: product.description,
      stock: product.stock,
    })
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function updateSupabaseProduct(
  id: string,
  product: SupabaseProductPayload
) {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: product.name,
      slug: product.slug,
      price: product.price,
      old_price: product.old_price || null,
      image: product.image,
      category: product.category,
      description: product.description,
      stock: product.stock,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function deleteSupabaseProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}