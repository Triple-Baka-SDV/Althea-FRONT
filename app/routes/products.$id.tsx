import { useState } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { ChevronRight, Minus, Plus, ShoppingCart, CheckCircle, AlertCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/context/cart-context";
import { fetchProductById, filterProducts, type ApiProduct } from "@/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  if (isNaN(id)) throw new Response("Not Found", { status: 404 });

  const product = await fetchProductById(id).catch(() => null);
  if (!product) throw new Response("Not Found", { status: 404 });

  const related: ApiProduct[] = product.products.categoryId
    ? await filterProducts({ categoryId: product.products.categoryId }).catch(() => [])
    : [];

  return {
    product,
    related: related.filter((r) => r.products.id !== id).slice(0, 4),
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `${data.product.products.names} – Althea Systems` : "Produit – Althea Systems" },
];

export default function ProduitDetail() {
  const { product, related } = useLoaderData<typeof loader>();
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const p = product.products;
  const price = parseFloat(p.unitaryPrice ?? "0");
  const stock = product.stocks?.quantity ?? 0;
  const available = (p.active ?? false) && stock > 0;
  const tva = parseFloat(product.taxes?.taux ?? "0");
  const categoryName = product.categories?.nom ?? null;
  const categoryId = p.categoryId;
  const inCart = items.find((i) => i.productId === p.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: p.id,
        name: p.names,
        price,
        reference: `REF-${p.id}`,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <Link to="/" className="hover:text-med-cta">Accueil</Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <Link to="/products" className="hover:text-med-cta">Catalogue</Link>
        <ChevronRight className="size-3.5 shrink-0" />
        {categoryName && categoryId && (
          <>
            <Link to={`/categories/${categoryId}`} className="hover:text-med-cta">
              {categoryName}
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
          </>
        )}
        <span className="text-med-nav font-medium truncate">{p.names}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square w-full max-w-lg rounded-2xl bg-secondary overflow-hidden">
          {p.linkPix ? (
            <img src={p.linkPix} alt={p.names} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-med-cta/20">
              <svg className="size-32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Réf. {p.id}</p>
            {categoryName && categoryId && (
              <Link
                to={`/categories/${categoryId}`}
                className="text-xs text-med-cta hover:underline mb-2 inline-block"
              >
                {categoryName}
              </Link>
            )}
            <h1 className="text-2xl font-semibold text-med-nav leading-tight mt-1">
              {p.names}
            </h1>
            {p.title && p.title !== p.names && (
              <p className="text-sm text-muted-foreground mt-1">{p.title}</p>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-med-nav">
              {price.toFixed(2).replace(".", ",")} €
            </span>
            {tva > 0 && (
              <span className="text-sm text-muted-foreground">HT + TVA {tva}%</span>
            )}
          </div>

          {tva > 0 && (
            <p className="text-sm text-muted-foreground -mt-3">
              Soit{" "}
              <strong className="text-med-nav">
                {(price * (1 + tva / 100)).toFixed(2).replace(".", ",")} € TTC
              </strong>
            </p>
          )}

          <div className="flex items-center gap-2">
            {available ? (
              <>
                <div className="size-2.5 rounded-full bg-med-available" />
                <span className="text-sm text-med-available font-medium">
                  En stock ({stock} unité{stock > 1 ? "s" : ""})
                </span>
              </>
            ) : (
              <>
                <div className="size-2.5 rounded-full bg-destructive" />
                <span className="text-sm text-destructive font-medium">Rupture de stock</span>
              </>
            )}
          </div>

          <Separator />

          {available && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-med-nav">Quantité</p>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex size-9 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-l-lg"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-med-nav">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    className="flex size-9 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-r-lg"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full gap-2 bg-med-cta hover:bg-med-hover text-primary-foreground"
                size="lg"
              >
                {added ? (
                  <>
                    <CheckCircle className="size-5" />
                    Ajouté au panier !
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-5" />
                    Ajouter au panier
                    {inCart && ` (${inCart.qty} déjà)`}
                  </>
                )}
              </Button>

              {added && (
                <Link to="/panier">
                  <Button variant="outline" className="w-full">
                    Voir le panier
                  </Button>
                </Link>
              )}
            </div>
          )}

          <Accordion type="multiple" defaultValue={["description", "features"]} className="mt-2">
            {p.description && (
              <AccordionItem value="description">
                <AccordionTrigger className="text-sm font-medium text-med-nav">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </AccordionContent>
              </AccordionItem>
            )}

            {p.characteristics && (
              <AccordionItem value="features">
                <AccordionTrigger className="text-sm font-medium text-med-nav">
                  Caractéristiques
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {p.characteristics}
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="delivery">
              <AccordionTrigger className="text-sm font-medium text-med-nav">
                Livraison & retours
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <Package className="size-4 shrink-0 mt-0.5 text-med-cta" />
                  <p>Livraison express 24–48h pour les commandes passées avant 14h. Transport adapté aux dispositifs médicaux.</p>
                </div>
                <p>Retours acceptés dans les 30 jours suivant la réception pour les produits non ouverts.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-med-nav">Produits similaires</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.products.id}
                to={`/products/${r.products.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-med-cta hover:shadow-md"
              >
                <div className="aspect-square bg-secondary flex items-center justify-center text-med-cta/20">
                  {r.products.linkPix ? (
                    <img src={r.products.linkPix} alt={r.products.names} className="size-full object-cover" />
                  ) : (
                    <svg className="size-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <h3 className="text-xs font-medium text-med-nav line-clamp-2">{r.products.names}</h3>
                  <span className="text-sm font-semibold text-med-nav">
                    {parseFloat(r.products.unitaryPrice ?? "0").toFixed(2).replace(".", ",")} €
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
