import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, Bell, Boxes, Home, LogOut, PackageCheck, Search, Settings, ShoppingCart, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/utils/helpers";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/users", label: "Users", icon: Users },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Users",
  "/products": "Products",
  "/orders": "Orders",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function DashboardLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-card/85 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col p-5">
          <Link to="/" className="mb-8 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft"><PackageCheck className="size-5" /></div>
            <div><p className="text-base font-bold">Admin Dashboard</p><p className="text-xs text-muted-foreground">Order Control</p></div>
          </Link>
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", isActive && "bg-accent text-primary")}>
                <item.icon className="size-4" /> {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><PackageCheck className="size-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">E-commerce OMS</p>
              <h1 className="truncate text-lg font-bold">{titles[location.pathname] ?? "Dashboard"}</h1>
            </div>
            <div className="relative hidden w-full max-w-md md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search orders, users, products..." />
            </div>
            <Button variant="outline" size="icon" aria-label="Notifications"><Bell /></Button>
            <ThemeToggle />
            <div className="hidden items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 sm:flex">
              <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">C</div>
              <div className="leading-tight"><p className="text-sm font-semibold">Charan</p><p className="text-xs text-muted-foreground">Admin</p></div>
            </div>
            <Button variant="ghost" size="icon" aria-label="Logout"><LogOut /></Button>
          </div>
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}
