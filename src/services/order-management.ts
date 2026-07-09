import { apiClient } from "@/services/api-client";
import type { Order, Product, User } from "@/types";

type BackendUser = Omit<User, "id"> & { id: string | number };
type BackendProduct = Omit<Product, "id"> & { id: string | number };
type BackendOrder = Omit<Order, "id"> & { id: string | number };

async function requestData<T>(request: Promise<{ data: T }>): Promise<T> {
  const response = await request;
  return response.data;
}

function normalizeUser(user: BackendUser): User {
  return { ...user, id: String(user.id) };
}

function normalizeProduct(product: BackendProduct): Product {
  return { ...product, id: String(product.id) };
}

function normalizeOrder(order: BackendOrder): Order {
  return { ...order, id: String(order.id) };
}

function toProductPayload(payload: Omit<Product, "id" | "image" | "stockStatus">) {
  return {
    ...payload,
    quantity_available: payload.inventory,
  };
}

export const userService = {
  list: () => requestData(apiClient.get<BackendUser[]>("/users")).then((data) => data.map(normalizeUser)),
  create: (payload: Omit<User, "id" | "joinedAt">) => apiClient.post<BackendUser>("/users", payload).then((response) => normalizeUser(response.data)),
  update: (id: string, payload: Partial<User>) => apiClient.put<BackendUser>(`/users/${id}`, payload).then((response) => normalizeUser(response.data)),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
};

export const productService = {
  list: () => requestData(apiClient.get<BackendProduct[]>("/products")).then((data) => data.map(normalizeProduct)),
  create: (payload: Omit<Product, "id" | "image" | "stockStatus">) => apiClient.post<BackendProduct>("/products", toProductPayload(payload)).then((response) => normalizeProduct(response.data)),
  update: (id: string, payload: Partial<Product>) => {
    const body: Record<string, unknown> = { ...payload };
    if (payload.inventory !== undefined) {
      body.quantity_available = payload.inventory;
      delete body.inventory;
    }
    return apiClient.put<BackendProduct>(`/products/${id}`, body).then((response) => normalizeProduct(response.data));
  },
  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

export const orderService = {
  list: () => requestData(apiClient.get<BackendOrder[]>("/orders")).then((data) => data.map(normalizeOrder)),
  updateStatus: (id: string, status: Order["status"]) => apiClient.patch<BackendOrder>(`/orders/${id}/status`, { status }).then((response) => normalizeOrder(response.data)),
  cancel: (id: string) => apiClient.patch<BackendOrder>(`/orders/${id}/cancel`).then((response) => normalizeOrder(response.data)),
  create: (payload: { user_id: number; product_id: number; quantity?: number }) => apiClient.post<BackendOrder>("/orders", payload).then((response) => normalizeOrder(response.data)),
};
