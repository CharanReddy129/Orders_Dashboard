import { ArrowDownRight, ArrowUpRight, Boxes, CheckCircle2, Clock, DollarSign, ShoppingCart, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { orderService, productService, userService } from "@/services/order-management";
import type { Order, Product, User } from "@/types";
import { formatCurrency } from "@/utils/helpers";

const icons = [Users, Boxes, ShoppingCart, DollarSign, Clock, CheckCircle2];
const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      try {
        const [userData, productData, orderData] = await Promise.all([userService.list(), productService.list(), orderService.list()]);
        if (!active) return;

        setUsers(userData);
        setProducts(productData);
        setOrders(orderData);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const kpis = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((order) => order.status === "Pending").length;
    const completedOrders = orders.filter((order) => order.status === "Completed").length;
    const lowStockProducts = products.filter((product) => product.inventory < 25).length;

    return [
      { label: "Total Users", value: users.length.toLocaleString(), change: "+12.5%", trend: "up" as const },
      { label: "Total Products", value: products.length.toLocaleString(), change: "+4.2%", trend: "up" as const },
      { label: "Orders Today", value: orders.length.toLocaleString(), change: "+18.1%", trend: "up" as const },
      { label: "Revenue", value: formatCurrency(totalRevenue), change: "+9.8%", trend: "up" as const },
      { label: "Pending Orders", value: pendingOrders.toString(), change: "-3.4%", trend: "down" as const },
      { label: "Completed Orders", value: completedOrders.toString(), change: "+7.6%", trend: "up" as const },
      { label: "Low Stock", value: lowStockProducts.toString(), change: "+1.1%", trend: "down" as const },
    ];
  }, [orders, products, users]);

  const categoryData = useMemo(() => {
    const totals = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [products]);

  const statusData = useMemo(() => {
    const totals = orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const ordersPerDay = useMemo(() => {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const totals = Array.from({ length: 7 }, () => ({ orders: 0, revenue: 0 }));

    orders.forEach((order) => {
      const day = new Date(order.createdAt);
      const index = (day.getDay() + 6) % 7;
      totals[index].orders += 1;
      totals[index].revenue += order.total;
    });

    return dayNames.map((day, index) => ({ day, orders: totals[index].orders, revenue: totals[index].revenue }));
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  return (
    <div className="page-shell animate-fade-up">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div><h2 className="text-2xl font-bold tracking-tight">Command center</h2><p className="text-muted-foreground">Track customers, inventory, orders, and revenue in one place.</p></div>
        <div className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">Live backend metrics</div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="flex-row items-center justify-between gap-3 pb-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-20" />
                  </div>
                  <Skeleton className="size-11 rounded-2xl" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-28" />
                </CardContent>
              </Card>
            ))
          : kpis.map((metric, index) => {
              const Icon = icons[index % icons.length];
              return (
                <Card key={metric.label} className="overflow-hidden">
                  <CardHeader className="flex-row items-center justify-between gap-3 pb-3">
                    <div><CardDescription>{metric.label}</CardDescription><CardTitle className="mt-1 text-2xl">{metric.value}</CardTitle></div>
                    <div className="grid size-11 place-items-center rounded-2xl bg-accent text-primary"><Icon className="size-5" /></div>
                  </CardHeader>
                  <CardContent><p className="flex items-center gap-1 text-sm font-medium text-muted-foreground">{metric.trend === "up" ? <ArrowUpRight className="size-4 text-emerald-500" /> : <ArrowDownRight className="size-4 text-rose-500" />}<span className={metric.trend === "up" ? "text-emerald-600" : "text-rose-600"}>{metric.change}</span> from last week</p></CardContent>
                </Card>
              );
            })}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2"><CardHeader><CardTitle>Orders per day</CardTitle><CardDescription>Order volume and revenue trend for the current week.</CardDescription></CardHeader><CardContent className="h-80">{loading ? <Skeleton className="h-full w-full" /> : <ResponsiveContainer><AreaChart data={ordersPerDay}><defs><linearGradient id="orders" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" /><XAxis dataKey="day" /><YAxis /><Tooltip formatter={(value, name) => name === "revenue" ? formatCurrency(Number(value)) : value} /><Area type="monotone" dataKey="orders" stroke="#4f46e5" fill="url(#orders)" strokeWidth={3} /><Area type="monotone" dataKey="revenue" stroke="#10b981" fill="transparent" strokeWidth={2} /></AreaChart></ResponsiveContainer>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Product categories</CardTitle><CardDescription>Category contribution across active catalog.</CardDescription></CardHeader><CardContent className="h-80">{loading ? <Skeleton className="h-full w-full" /> : <ResponsiveContainer><PieChart><Pie data={categoryData} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={4}>{categoryData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>}</CardContent></Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card><CardHeader><CardTitle>Status distribution</CardTitle><CardDescription>Success, pending, cancellation, and failed order ratio.</CardDescription></CardHeader><CardContent className="h-72">{loading ? <Skeleton className="h-full w-full" /> : <ResponsiveContainer><BarChart data={statusData}><CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" radius={[8,8,0,0]} fill="#4f46e5" /></BarChart></ResponsiveContainer>}</CardContent></Card>
        <Card className="xl:col-span-2"><CardHeader><CardTitle>Recent orders</CardTitle><CardDescription>Latest transactions from the order stream.</CardDescription></CardHeader><CardContent>{loading ? <Skeleton className="h-40 w-full" /> : <div className="overflow-hidden rounded-xl border border-border"><table className="w-full text-sm"><thead className="sticky top-0 bg-secondary text-left text-xs uppercase text-muted-foreground"><tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Product</th><th className="p-3">Total</th><th className="p-3">Status</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={order.id} className="border-t border-border hover:bg-muted/50"><td className="p-3 font-medium">{order.id}</td><td className="p-3">{order.customer}</td><td className="p-3 text-muted-foreground">{order.product}</td><td className="p-3 font-semibold">{formatCurrency(order.total)}</td><td className="p-3"><OrderStatusBadge status={order.status} /></td></tr>)}</tbody></table></div>}</CardContent></Card>
      </section>
    </div>
  );
}
