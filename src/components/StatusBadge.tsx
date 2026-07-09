import { Badge } from "@/components/ui/badge";
import type { OrderStatus, StockStatus } from "@/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variant = status === "Completed" ? "success" : status === "Pending" ? "warning" : "danger";
  return <Badge variant={variant}>{status}</Badge>;
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
  const variant = status === "In Stock" ? "success" : status === "Low Stock" ? "warning" : "danger";
  return <Badge variant={variant}>{status}</Badge>;
}
