import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { fetchCategoryById, filterProducts, type ApiProduct, type ApiCategory } from "@/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.slug);
  if (isNaN(id)) throw new Response("Not Found", { status: 404 });

  const [category, products] = await Promise.all([
    fetchCategoryById(id).catch(() => null as ApiCategory | null),
    filterProducts({ categoryId: id }).catch(() => [] as ApiProduct[]),
  ]);

  if (!category) throw new Response("Not Found", { status: 404 });

  return { category, products };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.category.nom ?? "Catégorie"} – Althea Systems` },
  { name: "description", content: `Parcourez nos produits de la catégorie ${data?.category.nom ?? ""}` },
];

export default function CategoryPage() {
  const { category, products } = useLoaderData<typeof loader>();
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});

  const handleAddToCart = (product: ApiProduct) => {
    const p = product.products;
    addItem({
      productId: p.id,
      name: p.names,
      price: parseFloat(p.unitaryPrice ?? "0"),
      reference: `REF-${p.id}`,
    });
    setAddedItems((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [p.id]: false }));
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-med-nav to-med-cta py-12 text-primary-foreground">
          <div className="mx-auto max-w-7xl px-6">
            <h1
              className="mb-2 text-3xl font-semibold md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {category.nom ?? `Catégorie ${category.id}`}
            </h1>
            <p className="text-sm md:text-base opacity-90">
              {products.length} produit{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12">
          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Aucun produit dans cette catégorie</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const p = product.products;
                const available = (p.active ?? false) && (product.stocks?.quantity ?? 0) > 0;
                const price = parseFloat(p.unitaryPrice ?? "0");
                return (
                  <div
                    key={p.id}
                    className="flex flex-col rounded-lg border border-border bg-background p-4 transition-shadow hover:shadow-md"
                  >
                    {p.linkPix ? (
                      <img
                        src={p.linkPix}
                        alt={p.names}
                        className="mb-3 aspect-video w-full rounded-md object-cover"
                      />
                    ) : null}

                    <div className="mb-4 flex-1">
                      <h3 className="mb-2 font-semibold text-med-nav line-clamp-2">{p.names}</h3>
                      {p.description && (
                        <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                      )}
                      <div className="mb-3 text-xs">
                        {available ? (
                          <span className="text-green-600 font-medium">
                            En stock ({product.stocks?.quantity})
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">Rupture de stock</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-med-cta">{price.toFixed(2)} €</span>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/products/${p.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-sm">Voir le produit</Button>
                      </Link>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!available}
                        className={`flex-1 ${addedItems[p.id] ? "bg-green-600 hover:bg-green-600" : "bg-med-cta hover:bg-med-nav"}`}
                      >
                        <ShoppingCart className="mr-2 size-4" />
                        {addedItems[p.id] ? "Ajouté ✓" : "Ajouter"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
