import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, Edit, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { StockStatusBadge } from "@/components/StatusBadge";
import { PaginationControls } from "@/components/PaginationControls";
import { useAsyncData } from "@/hooks/useAsyncData";
import { productService } from "@/services/order-management";
import { usePagination } from "@/hooks/usePagination";
import type { Product } from "@/types";
import { formatCurrency } from "@/utils/helpers";

const productSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  price: z.number().positive(),
  inventory: z.number().min(0),
});

type ProductForm = z.infer<typeof productSchema>;
const stock = (inventory: number) => (inventory === 0 ? "Out of Stock" : inventory < 25 ? "Low Stock" : "In Stock");

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(250);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await productService.list();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) &&
          (category === "All" || product.category === category) &&
          product.price <= maxPrice,
      ),
    [products, query, category, maxPrice],
  );

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 5);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", category: "Apparel", price: 99, inventory: 20 },
  });

  function openForm(product?: Product) {
    setEditing(product ?? null);
    form.reset(
      product
        ? { name: product.name, category: product.category, price: product.price, inventory: product.inventory }
        : { name: "", category: "Apparel", price: 99, inventory: 20 },
    );
    setOpen(true);
  }

  async function onSubmit(values: ProductForm) {
    if (submitting) return;
    setSubmitting(true);

    const optimisticProduct: Product = editing
      ? {
          ...editing,
          ...values,
          stockStatus: stock(values.inventory) as Product["stockStatus"],
        }
      : {
          id: `pending-${Date.now()}`,
          name: values.name,
          category: values.category,
          price: values.price,
          inventory: values.inventory,
          stockStatus: stock(values.inventory) as Product["stockStatus"],
          image: "",
        };

    setProducts((current) => (editing ? current.map((product) => (product.id === editing.id ? optimisticProduct : product)) : [optimisticProduct, ...current]));
    setOpen(false);
    form.reset({ name: "", category: "Apparel", price: 99, inventory: 20 });
    setEditing(null);

    try {
      const response = editing ? await productService.update(editing.id, values) : await productService.create(values);
      setProducts((current) => {
        if (editing) {
          return current.map((product) => (product.id === editing.id ? response : product));
        }
        return [response, ...current.filter((product) => product.id !== optimisticProduct.id)];
      });
      setPage(1);
      toast.success(editing ? "Product updated successfully" : "Product created successfully");
      await loadProducts();
    } catch {
      setProducts((current) => (editing ? current.map((product) => (product.id === editing.id ? editing : product)) : current.filter((product) => product.id !== optimisticProduct.id)));
      toast.error("Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await productService.delete(id);
      await loadProducts();
      toast.success("Product deleted");
    } catch {
      toast.error("Unable to delete product.");
    }
  }

  return (
    <div className="page-shell animate-fade-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage catalog, pricing, and inventory health.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openForm()}>
              <Plus /> Create Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Update product" : "Create product"}</DialogTitle>
              <DialogDescription>Inventory updates automatically map to stock badges.</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <Field>
                <Label>Name</Label>
                <Input {...form.register("name")} />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
              <Field>
                <Label>Category</Label>
                <Input {...form.register("category")} />
                <FieldError>{form.formState.errors.category?.message}</FieldError>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <Label>Price</Label>
                  <Input type="number" {...form.register("price", { valueAsNumber: true })} />
                  <FieldError>{form.formState.errors.price?.message}</FieldError>
                </Field>
                <Field>
                  <Label>Inventory</Label>
                  <Input type="number" {...form.register("inventory", { valueAsNumber: true })} />
                  <FieldError>{form.formState.errors.inventory?.message}</FieldError>
                </Field>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={submitting || form.formState.isSubmitting}>{submitting ? "Saving..." : "Save product"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Product catalog</CardTitle>
              <p className="text-sm text-muted-foreground">{loading ? "Loading products..." : `${products.length} products available`}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search products..." value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <div className="flex gap-2">
                <button className="focus-ring h-10 rounded-xl border border-input bg-background px-3 text-sm" onClick={() => setCategory("All")}>All</button>
                <select className="focus-ring h-10 rounded-xl border border-input bg-background px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <EmptyState title="Unable to load products" description="Please check your backend or try again later." />
          ) : pageItems.length ? (
            <div className="grid gap-4">
              {pageItems.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatCurrency(product.price)}</span>
                      <StockStatusBadge status={product.stockStatus} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Inventory</div>
                      <div className="text-lg font-semibold">{product.inventory}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openForm(product)}><Edit /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}><Trash2 /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No products found" description="Try another search or add a new product." />
          )}
        </CardContent>
        <div className="p-4"><PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} /></div>
      </Card>
    </div>
  );
}
