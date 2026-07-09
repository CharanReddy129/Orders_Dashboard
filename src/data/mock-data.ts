import type { KpiMetric, Order, Product, User } from "@/types";

export const users: User[] = [
  { id: "usr_1001", name: "Ava Thompson", email: "ava@example.com", role: "Admin", status: "Active", joinedAt: "2026-06-01" },
  { id: "usr_1002", name: "Noah Patel", email: "noah@example.com", role: "Manager", status: "Active", joinedAt: "2026-06-03" },
  { id: "usr_1003", name: "Mia Chen", email: "mia@example.com", role: "Customer", status: "Invited", joinedAt: "2026-06-08" },
  { id: "usr_1004", name: "Liam Brooks", email: "liam@example.com", role: "Customer", status: "Active", joinedAt: "2026-06-10" },
  { id: "usr_1005", name: "Sophia Khan", email: "sophia@example.com", role: "Manager", status: "Suspended", joinedAt: "2026-06-12" },
  { id: "usr_1006", name: "Ethan Wright", email: "ethan@example.com", role: "Customer", status: "Active", joinedAt: "2026-06-14" },
  { id: "usr_1007", name: "Isabella Rossi", email: "isabella@example.com", role: "Customer", status: "Active", joinedAt: "2026-06-16" },
  { id: "usr_1008", name: "Lucas Silva", email: "lucas@example.com", role: "Customer", status: "Invited", joinedAt: "2026-06-18" },
];

export const products: Product[] = [
  { id: "prd_2001", name: "Aero Knit Hoodie", category: "Apparel", price: 89, inventory: 128, stockStatus: "In Stock", image: "AH" },
  { id: "prd_2002", name: "Orbit Desk Lamp", category: "Home", price: 142, inventory: 21, stockStatus: "Low Stock", image: "OL" },
  { id: "prd_2003", name: "Pulse Fitness Band", category: "Electronics", price: 129, inventory: 0, stockStatus: "Out of Stock", image: "PF" },
  { id: "prd_2004", name: "Ceramic Pour Set", category: "Kitchen", price: 74, inventory: 58, stockStatus: "In Stock", image: "CP" },
  { id: "prd_2005", name: "Nomad Travel Pack", category: "Bags", price: 189, inventory: 14, stockStatus: "Low Stock", image: "NP" },
  { id: "prd_2006", name: "Studio Monitor Stand", category: "Office", price: 99, inventory: 92, stockStatus: "In Stock", image: "SS" },
];

export const orders: Order[] = [
  { id: "ord_3001", customer: "Ava Thompson", email: "ava@example.com", product: "Aero Knit Hoodie", total: 178, status: "Completed", createdAt: "2026-06-29" },
  { id: "ord_3002", customer: "Noah Patel", email: "noah@example.com", product: "Orbit Desk Lamp", total: 142, status: "Pending", createdAt: "2026-06-29" },
  { id: "ord_3003", customer: "Mia Chen", email: "mia@example.com", product: "Pulse Fitness Band", total: 129, status: "Failed", createdAt: "2026-06-28" },
  { id: "ord_3004", customer: "Liam Brooks", email: "liam@example.com", product: "Ceramic Pour Set", total: 222, status: "Completed", createdAt: "2026-06-28" },
  { id: "ord_3005", customer: "Sophia Khan", email: "sophia@example.com", product: "Nomad Travel Pack", total: 189, status: "Cancelled", createdAt: "2026-06-27" },
  { id: "ord_3006", customer: "Ethan Wright", email: "ethan@example.com", product: "Studio Monitor Stand", total: 99, status: "Completed", createdAt: "2026-06-27" },
  { id: "ord_3007", customer: "Isabella Rossi", email: "isabella@example.com", product: "Aero Knit Hoodie", total: 89, status: "Pending", createdAt: "2026-06-26" },
  { id: "ord_3008", customer: "Lucas Silva", email: "lucas@example.com", product: "Orbit Desk Lamp", total: 284, status: "Completed", createdAt: "2026-06-26" },
];

export const kpis: KpiMetric[] = [
  { label: "Total Users", value: "18,420", change: "+12.5%", trend: "up" },
  { label: "Total Products", value: "1,284", change: "+4.2%", trend: "up" },
  { label: "Orders Today", value: "342", change: "+18.1%", trend: "up" },
  { label: "Revenue", value: "$86,420", change: "+9.8%", trend: "up" },
  { label: "Pending Orders", value: "47", change: "-3.4%", trend: "down" },
  { label: "Completed Orders", value: "12,902", change: "+7.6%", trend: "up" },
];

export const ordersPerDay = [
  { day: "Mon", orders: 120, revenue: 18400 }, { day: "Tue", orders: 180, revenue: 24200 }, { day: "Wed", orders: 160, revenue: 22900 },
  { day: "Thu", orders: 240, revenue: 33600 }, { day: "Fri", orders: 310, revenue: 48100 }, { day: "Sat", orders: 280, revenue: 42900 }, { day: "Sun", orders: 342, revenue: 53200 },
];

export const categoryData = [
  { name: "Apparel", value: 34 }, { name: "Electronics", value: 24 }, { name: "Home", value: 18 }, { name: "Kitchen", value: 14 }, { name: "Bags", value: 10 },
];

export const statusData = [
  { name: "Completed", value: 72 }, { name: "Pending", value: 16 }, { name: "Cancelled", value: 7 }, { name: "Failed", value: 5 },
];

export const hourlyOrders = Array.from({ length: 12 }, (_, index) => ({ hour: `${index + 8}:00`, orders: Math.floor(24 + Math.random() * 70) }));
export const growthData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({ month, growth: 8 + index * 4 + Math.round(Math.random() * 6) }));
