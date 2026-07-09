import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, CheckCircle2, Link2, Save, UserCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

const settingsSchema = z.object({ name: z.string().min(2), email: z.string().email(), apiUrl: z.string().url(), lowStockAlerts: z.boolean(), orderAlerts: z.boolean() });
type SettingsForm = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const form = useForm<SettingsForm>({ resolver: zodResolver(settingsSchema), defaultValues: { name: "Charan", email: "charan@example.com", apiUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api", lowStockAlerts: true, orderAlerts: true } });
  async function onSubmit() { await new Promise((resolve) => setTimeout(resolve, 500)); toast.success("Settings saved"); }
  return <div className="page-shell animate-fade-up"><div><h2 className="text-2xl font-bold">Settings</h2><p className="text-muted-foreground">Profile, theme, API URL, and notifications.</p></div><form className="grid gap-4 xl:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}><Card><CardHeader><div className="flex items-center gap-3"><UserCog className="size-5 text-primary" /><div><CardTitle>Profile</CardTitle><CardDescription>Update account information.</CardDescription></div></div></CardHeader><CardContent className="grid gap-4"><Field><Label>Name</Label><Input {...form.register("name")} /><FieldError>{form.formState.errors.name?.message}</FieldError></Field><Field><Label>Email</Label><Input {...form.register("email")} /><FieldError>{form.formState.errors.email?.message}</FieldError></Field></CardContent></Card><Card><CardHeader><div className="flex items-center gap-3"><Link2 className="size-5 text-primary" /><div><CardTitle>API URL</CardTitle><CardDescription>Point the dashboard at your backend service.</CardDescription></div></div></CardHeader><CardContent><Field><Label>Backend API URL</Label><Input {...form.register("apiUrl")} /><FieldError>{form.formState.errors.apiUrl?.message}</FieldError></Field></CardContent></Card><Card><CardHeader><CardTitle>Theme</CardTitle><CardDescription>Switch between light and dark mode.</CardDescription></CardHeader><CardContent><ThemeToggle /></CardContent></Card><Card><CardHeader><div className="flex items-center gap-3"><Bell className="size-5 text-primary" /><div><CardTitle>Notifications</CardTitle><CardDescription>Choose operational alerts.</CardDescription></div></div></CardHeader><CardContent className="grid gap-3"><label className="flex items-center justify-between rounded-xl border border-border p-3"><span>Low stock alerts</span><input type="checkbox" {...form.register("lowStockAlerts")} /></label><label className="flex items-center justify-between rounded-xl border border-border p-3"><span>New order alerts</span><input type="checkbox" {...form.register("orderAlerts")} /></label></CardContent></Card><div className="xl:col-span-2 flex justify-end"><Button disabled={form.formState.isSubmitting}><Save /> {form.formState.isSubmitting ? "Saving..." : "Save settings"}</Button></div></form></div>;
}
