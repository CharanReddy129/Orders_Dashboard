import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Search, Trash2, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/PaginationControls";
import { useAsyncData } from "@/hooks/useAsyncData";
import { userService } from "@/services/order-management";
import { usePagination } from "@/hooks/usePagination";
import type { User } from "@/types";

const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["Admin", "Manager", "Customer"]),
  status: z.enum(["Active", "Invited", "Suspended"]),
});

type UserForm = z.infer<typeof userSchema>;

export function UsersPage() {
  const { data: remoteUsers, loading, error } = useAsyncData(userService.list, [] as User[]);
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUsers(Array.isArray(remoteUsers) ? remoteUsers : []);
  }, [remoteUsers]);

  const filtered = useMemo(
    () => users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase())),
    [users, query],
  );

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 5);

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", role: "Customer", status: "Active" },
  });

  function openForm(user?: User) {
    setEditing(user ?? null);
    form.reset(user ? { name: user.name, email: user.email, role: user.role, status: user.status } : { name: "", email: "", role: "Customer", status: "Active" });
    setOpen(true);
  }

  async function onSubmit(values: UserForm) {
    if (submitting) return;
    setSubmitting(true);

    const optimisticUser: User = editing
      ? { ...editing, ...values, joinedAt: editing.joinedAt }
      : {
          id: `pending-${Date.now()}`,
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status,
          joinedAt: "Just now",
        };

    setUsers((current) => (editing ? current.map((user) => (user.id === editing.id ? optimisticUser : user)) : [optimisticUser, ...current]));
    setOpen(false);
    form.reset({ name: "", email: "", role: "Customer", status: "Active" });
    setEditing(null);

    try {
      const response = editing ? await userService.update(editing.id, values) : await userService.create(values);
      setUsers((current) => current.map((user) => (user.id === optimisticUser.id ? response : user)));
      toast.success(editing ? "User updated successfully" : "User added successfully");
      await userService.list().then((data) => setUsers(Array.isArray(data) ? data : []));
    } catch (err) {
      setUsers((current) => (editing ? current.map((user) => (user.id === editing.id ? editing : user)) : current.filter((user) => user.id !== optimisticUser.id)));
      toast.error("Unable to save user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user?")) return;
    try {
      await userService.delete(id);
      setUsers((current) => current.filter((user) => user.id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Unable to delete user.");
    }
  }

  return (
    <div className="page-shell animate-fade-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage customers, managers, and admins.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openForm()}>
              <Plus /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit user" : "Add user"}</DialogTitle>
              <DialogDescription>Validated with React Hook Form and Zod.</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <Field>
                <Label>Name</Label>
                <Input {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
              <Field>
                <Label>Email</Label>
                <Input {...form.register("email")} aria-invalid={!!form.formState.errors.email} />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <Label>Role</Label>
                  <select className="focus-ring h-10 rounded-xl border border-input bg-background px-3 text-sm" {...form.register("role")}>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Customer</option>
                  </select>
                </Field>
                <Field>
                  <Label>Status</Label>
                  <select className="focus-ring h-10 rounded-xl border border-input bg-background px-3 text-sm" {...form.register("status")}>
                    <option>Active</option>
                    <option>Invited</option>
                    <option>Suspended</option>
                  </select>
                </Field>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={submitting || form.formState.isSubmitting}>{submitting ? "Saving..." : "Save user"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>User table</CardTitle>
              <p className="text-sm text-muted-foreground">{loading ? "Loading users..." : `${users.length} users available`}</p>
            </div>
            <div className="relative md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search users..." value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <EmptyState title="Unable to load users" description="Please check your backend or try again later." />
          ) : pageItems.length ? (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-secondary text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((user) => (
                    <tr key={user.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-3">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3"><Badge>{user.status}</Badge></td>
                      <td className="p-3 text-muted-foreground">{user.joinedAt}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openForm(user)}><Edit /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}><Trash2 /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No users found" description="Try another search or add a new user." />
          )}
        </CardContent>
        <div className="p-4"><PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} /></div>
      </Card>
    </div>
  );
}
