export type CartItem = {
  slug: string;
  qty: number;
};

const CART_KEY = "digi_world_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(slug: string) {
  const cart = getCart();
  const existing = cart.find((item) => item.slug === slug);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ slug, qty: 1 });
  }

  saveCart(cart);
}

export function decreaseCartItem(slug: string) {
  const cart = getCart();
  const existing = cart.find((item) => item.slug === slug);

  if (!existing) return;

  existing.qty -= 1;

  const updated = cart.filter((item) => item.qty > 0);
  saveCart(updated);
}

export function removeFromCart(slug: string) {
  const cart = getCart().filter((item) => item.slug !== slug);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}