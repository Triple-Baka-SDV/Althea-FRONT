import { useState, useMemo } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Search, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { fetchProducts, fetchCategories, type ApiProduct, type ApiCategory } from "@/lib/api";

export const meta: MetaFunction = () => [
  { title: "Catalogue produits – Althea Systems" },
];

export async function loader(_: LoaderFunctionArgs) {
  const [products, categories] = await Promise.all([
    fetchProducts().catch(() => [] as ApiProduct[]),
    fetchCategories().catch(() => [] as ApiCategory[]),
  ]);
  return { products, categories };
}

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nom A–Z" },
  { value: "name_desc", label: "Nom Z–A" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

function ProductCard({ product }: { product: ApiProduct }) {
  const p = product.products;
  const price = parseFloat(p.unitaryPrice ?? "0");
  const available = (p.active ?? false) && (product.stocks?.quantity ?? 0) > 0;
  const hasPromo = product.stocks?.quantity != null;

  return (
    <Link
      to={`/products/${p.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-med-cta hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-secondary">
        {p.linkPix ? (
          <img src={p.linkPix} alt={p.names} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-med-cta/30">
            <svg className="size-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Badge className="bg-muted-foreground text-primary-foreground hover:bg-muted-foreground">
              Indisponible
            </Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.categories?.nom && (
          <p className="text-xs text-muted-foreground">{product.categories.nom}</p>
        )}
        <h3 className="line-clamp-2 text-sm font-medium text-med-nav leading-snug">
          {p.names}
        </h3>
        <div className="mt-auto flex items-end gap-2">
          <span className="text-base font-semibold text-med-nav">
            {price.toFixed(2).replace(".", ",")} €
          </span>
        </div>
        {available ? (
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-med-available" />
            <span className="text-xs text-med-available">En stock</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Rupture de stock</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function CategoryFilters({
  categories,
  selected,
  onToggle,
  onClear,
}: {
  categories: ApiCategory[];
  selected: number[];
  onToggle: (id: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-med-nav">Catégories</p>
        {selected.length > 0 && (
          <button onClick={onClear} className="text-xs text-med-cta hover:underline">
            Effacer
          </button>
        )}
      </div>
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center gap-2.5 py-1.5">
          <Checkbox
            id={`cat-${cat.id}`}
            checked={selected.includes(cat.id)}
            onCheckedChange={() => onToggle(cat.id)}
          />
          <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer flex-1">
            {cat.nom ?? `Catégorie ${cat.id}`}
          </Label>
        </div>
      ))}
    </div>
  );
}

export default function ProduitsIndex() {
  const { products, categories } = useLoaderData<typeof loader>();

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sort, setSort] = useState("name_asc");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const clearCategories = () => setSelectedCategories([]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.products.names.toLowerCase().includes(q) ||
          (p.products.description ?? "").toLowerCase().includes(q) ||
          (p.products.title ?? "").toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      list = list.filter(
        (p) => p.products.categoryId != null && selectedCategories.includes(p.products.categoryId)
      );
    }

    if (onlyAvailable) {
      list = list.filter(
        (p) => (p.products.active ?? false) && (p.stocks?.quantity ?? 0) > 0
      );
    }

    switch (sort) {
      case "name_asc":
        list.sort((a, b) => a.products.names.localeCompare(b.products.names, "fr"));
        break;
      case "name_desc":
        list.sort((a, b) => b.products.names.localeCompare(a.products.names, "fr"));
        break;
      case "price_asc":
        list.sort((a, b) => parseFloat(a.products.unitaryPrice ?? "0") - parseFloat(b.products.unitaryPrice ?? "0"));
        break;
      case "price_desc":
        list.sort((a, b) => parseFloat(b.products.unitaryPrice ?? "0") - parseFloat(a.products.unitaryPrice ?? "0"));
        break;
    }

    return list;
  }, [query, selectedCategories, sort, onlyAvailable, products]);

  const activeFiltersCount = selectedCategories.length + (onlyAvailable ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-med-cta">Accueil</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-med-nav font-medium">Catalogue</span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-med-nav">Catalogue produits</h1>
        <span className="text-sm text-muted-foreground">{filtered.length} produit{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Rechercher un produit…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden gap-2">
              <SlidersHorizontal className="size-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <Badge className="bg-med-cta text-primary-foreground hover:bg-med-cta text-xs px-1.5 min-w-5 h-5">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <div className="px-1 pt-6 flex flex-col gap-6">
              <CategoryFilters
                categories={categories}
                selected={selectedCategories}
                onToggle={toggleCategory}
                onClear={clearCategories}
              />
              <Separator />
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="available-mobile"
                  checked={onlyAvailable}
                  onCheckedChange={(v) => setOnlyAvailable(!!v)}
                />
                <Label htmlFor="available-mobile" className="text-sm cursor-pointer">
                  En stock uniquement
                </Label>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 rounded-xl border border-border bg-background p-5 flex flex-col gap-5">
            <CategoryFilters
              categories={categories}
              selected={selectedCategories}
              onToggle={toggleCategory}
              onClear={clearCategories}
            />
            <Separator />
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="available-desktop"
                checked={onlyAvailable}
                onCheckedChange={(v) => setOnlyAvailable(!!v)}
              />
              <Label htmlFor="available-desktop" className="text-sm cursor-pointer">
                En stock uniquement
              </Label>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {selectedCategories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return (
                  <Badge
                    key={catId}
                    variant="secondary"
                    className="gap-1.5 pr-1 cursor-pointer"
                    onClick={() => toggleCategory(catId)}
                  >
                    {cat?.nom ?? `Catégorie ${catId}`}
                    <X className="size-3" />
                  </Badge>
                );
              })}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground text-lg">Aucun produit trouvé</p>
              <p className="text-sm text-muted-foreground mt-1">
                Modifiez vos filtres ou votre recherche
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setQuery("");
                  setSelectedCategories([]);
                  setOnlyAvailable(false);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.products.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
