import { supabase } from "./supabase";

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

export async function createSupabaseProduct(product: {
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: boolean;
}) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function updateSupabaseProduct(
  id: string,
  product: {
    name: string;
    slug: string;
    price: number;
    image: string;
    category: string;
    description: string;
    stock: boolean;
  }
) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function deleteSupabaseProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}