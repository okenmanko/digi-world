import { supabase } from "./supabase";

export async function uploadProductImage(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file);

  if (error) {
    console.error(error);
    return null;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return data.publicUrl;
}