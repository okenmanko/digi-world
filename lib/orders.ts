export type OrderStatus = "new" | "processing" | "delivered" | "cancelled";

export type OrderItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  comment: string;
  delivery: string;
  payment: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};

const ORDERS_KEY = "digi_world_orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("orders-updated"));
}

export function createOrder(order: Omit<Order, "id" | "createdAt" | "status">) {
  const orders = getOrders();

  const newOrder: Order = {
    ...order,
    id: `DW-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  saveOrders([newOrder, ...orders]);

  return newOrder;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = getOrders().map((order) =>
    order.id === id ? { ...order, status } : order
  );

  saveOrders(orders);
}

export function deleteOrder(id: string) {
  saveOrders(getOrders().filter((order) => order.id !== id));
}