export type CartItem = {
  slug: string;
  qty: number;
};

const CART_KEY = "digi_world_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
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

export function updateCartQty(slug: string, qty: number) {
  const cart = getCart();

  const updated = cart
    .map((item) => (item.slug === slug ? { ...item, qty } : item))
    .filter((item) => item.qty > 0);

  saveCart(updated);
}

export function removeFromCart(slug: string) {
  const updated = getCart().filter((item) => item.slug !== slug);
  saveCart(updated);
}

export function clearCart() {
  saveCart([]);
}