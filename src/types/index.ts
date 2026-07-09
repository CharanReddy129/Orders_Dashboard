export type OrderStatus = "Pending" | "Completed" | "Cancelled" | "Failed";
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Customer";
  status: "Active" | "Invited" | "Suspended";
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inventory: number;
  stockStatus: StockStatus;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface KpiMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface ApiState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}
