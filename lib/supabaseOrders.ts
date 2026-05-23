import { supabase } from "./supabase";

export async function createSupabaseOrder(order: {
  customer_name: string;
  customer_phone: string;
  items: any[];
  total: number;
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      ...order,
      status: "yangi",
    })
    .select();

  if (error) return { success: false, error };
  return { success: true, data };
}

export async function getSupabaseOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function updateSupabaseOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function deleteSupabaseOrder(id: string) {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}