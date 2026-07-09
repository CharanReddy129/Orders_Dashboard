import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { growthData, hourlyOrders, ordersPerDay, products, statusData } from "@/data/mock-data";

const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export function AnalyticsPage() {
  const topProducts = products.map((product) => ({ name: product.name.split(" ").slice(0,2).join(" "), sales: Math.round(product.price * (product.inventory / 8 + 4)) }));
  const inventory = products.map((product) => ({ name: product.category, value: product.inventory }));
  return <div className="page-shell animate-fade-up"><div><h2 className="text-2xl font-bold">Analytics</h2><p className="text-muted-foreground">Professional Recharts views for operational decisions.</p></div><section className="grid gap-4 xl:grid-cols-2"><ChartCard title="Orders per hour" description="Intraday order velocity."><BarChart data={hourlyOrders}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" /><YAxis /><Tooltip /><Bar dataKey="orders" fill="#4f46e5" radius={[8,8,0,0]} /></BarChart></ChartCard><ChartCard title="Revenue by day" description="Daily revenue performance."><AreaChart data={ordersPerDay}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="revenue" stroke="#10b981" fill="#10b98133" strokeWidth={3} /></AreaChart></ChartCard><ChartCard title="Top selling products" description="Best performers by generated revenue."><BarChart data={topProducts} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={90} /><Tooltip /><Bar dataKey="sales" fill="#8b5cf6" radius={[0,8,8,0]} /></BarChart></ChartCard><ChartCard title="Inventory distribution" description="Inventory grouped by category."><PieChart><Pie data={inventory} dataKey="value" outerRadius={105} label>{inventory.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart></ChartCard><ChartCard title="Monthly growth" description="Month-over-month growth trend."><LineChart data={growthData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="growth" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} /></LineChart></ChartCard><ChartCard title="Success vs failed orders" description="Operational reliability ratio."><PieChart><Pie data={statusData} dataKey="value" innerRadius={55} outerRadius={105}>{statusData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart></ChartCard></section></div>;
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactElement }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent className="h-80"><ResponsiveContainer>{children}</ResponsiveContainer></CardContent></Card>;
}

