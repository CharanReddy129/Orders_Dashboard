import { Calendar, Eye, Search, ShoppingCart, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/PaginationControls";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { orderService } from "@/services/order-management";
import { useAsyncData } from "@/hooks/useAsyncData";
import { usePagination } from "@/hooks/usePagination";
import type { Order, OrderStatus } from "@/types";
import { formatCurrency } from "@/utils/helpers";

const statuses: Array<"All" | OrderStatus> = ["All", "Pending", "Completed", "Cancelled", "Failed"];

export function OrdersPage() {
  const { data: remoteOrders, loading, error } = useAsyncData(orderService.list, [] as Order[]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | OrderStatus>("All");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(Array.isArray(remoteOrders) ? remoteOrders : []);
  }, [remoteOrders]);

  const filtered = useMemo(
    () =>
      orders.filter(
        (order) =>
          `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(query.toLowerCase()) &&
          (status === "All" || order.status === status) &&
          (!date || order.createdAt === date),
      ),
    [orders, query, status, date],
  );

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 6);

  async function cancelOrder(id: string) {
    if (!confirm("Cancel this order?")) return;
    if (cancellingId === id) return;

    const previousOrder = orders.find((order) => order.id === id);
    const optimisticOrder = previousOrder ? { ...previousOrder, status: "Cancelled" as OrderStatus } : null;

    if (optimisticOrder) {
      setOrders((current) => current.map((order) => (order.id === id ? optimisticOrder : order)));
    }

    setCancellingId(id);

    try {
      const response = await orderService.cancel(id);
      setOrders((current) => current.map((order) => (order.id === id ? response : order)));
      toast.success("Order cancelled");
      await orderService.list().then((data) => setOrders(Array.isArray(data) ? data : []));
    } catch {
      if (previousOrder) {
        setOrders((current) => current.map((order) => (order.id === id ? previousOrder : order)));
      }
      toast.error("Unable to cancel order.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="page-shell animate-fade-up">
      <div>
        <h2 className="text-2xl font-bold">Orders</h2>
        <p className="text-muted-foreground">Search, filter, inspect, and cancel orders.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle>Orders table</CardTitle>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9 md:w-72" placeholder="Search orders..." value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <select className="focus-ring h-10 rounded-xl border border-input bg-background px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value as "All" | OrderStatus)}>
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <EmptyState title="Unable to load orders" description="Please check your backend or try again later." />
          ) : pageItems.length ? (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-secondary text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Order</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((order) => (
                    <tr key={order.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-3 font-semibold">{order.id}</td>
                      <td className="p-3">
                        <div>{order.customer}</div>
                        <div className="text-xs text-muted-foreground">{order.email}</div>
                      </td>
                      <td className="p-3">{order.product}</td>
                      <td className="p-3 text-muted-foreground">{order.createdAt}</td>
                      <td className="p-3 font-semibold">{formatCurrency(order.total)}</td>
                      <td className="p-3"><OrderStatusBadge status={order.status} /></td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelected(order)}><Eye /></Button>
                          <Button variant="ghost" size="icon" disabled={order.status === "Cancelled" || cancellingId === order.id} onClick={() => cancelOrder(order.id)}><XCircle /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title={loading ? "Loading orders..." : "No orders found"} description="Try changing your search, status, or date filters." />
          )}
        </CardContent>
        <div className="p-4"><PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} /></div>
      </Card>
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order details</DialogTitle>
            <DialogDescription>Review the selected transaction snapshot.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div><strong>Order</strong><div>{selected.id}</div></div>
              <div><strong>Customer</strong><div>{selected.customer}</div></div>
              <div><strong>Email</strong><div>{selected.email}</div></div>
              <div><strong>Product</strong><div>{selected.product}</div></div>
              <div><strong>Total</strong><div>{formatCurrency(selected.total)}</div></div>
              <div><strong>Status</strong><div>{selected.status}</div></div>
              <div><strong>Date</strong><div>{selected.createdAt}</div></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
