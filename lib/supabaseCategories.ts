import { supabase } from "./supabase";

export type Category = {
  id: string;
  name_uz: string;
  name_ru: string;
  slug: string;
  created_at?: string;
};

export async function getSupabaseCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function createSupabaseCategory(category: {
  name_uz: string;
  name_ru: string;
  slug: string;
}) {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function updateSupabaseCategory(
  id: string,
  category: {
    name_uz: string;
    name_ru: string;
    slug: string;
  }
) {
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function deleteSupabaseCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}
