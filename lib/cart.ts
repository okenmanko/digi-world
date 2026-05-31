export type CartItem = {
  slug: string;
  quantity: number;
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
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(slug: string) {
  const cart = getCart();
  const existing = cart.find((item) => item.slug === slug);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ slug, quantity: 1 });
  }

  saveCart(cart);
}

export function removeFromCart(slug: string) {
  const cart = getCart().filter((item) => item.slug !== slug);
  saveCart(cart);
}

export function updateQuantity(slug: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(slug);
    return;
  }

  const cart = getCart().map((item) =>
    item.slug === slug ? { ...item, quantity } : item
  );

  saveCart(cart);
}

export function updateCartQuantity(slug: string, quantity: number) {
  updateQuantity(slug, quantity);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}