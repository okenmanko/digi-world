export const STORAGE_KEY = "digi_world_admin_products";

export type AdminProductSpec = {
  label: string;
  value: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  emoji: string;
  image?: string;
  stock: boolean;
  descriptionUz?: string;
  descriptionRu?: string;
  specs?: AdminProductSpec[];
};

export function getAdminProducts(): AdminProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAdminProducts(products: AdminProduct[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}