import { useState } from "react";
import { Link, useParams } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { ChevronRight, Minus, Plus, ShoppingCart, CheckCircle, AlertCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/context/cart-context";
import data from "@/data/data.json";

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => [
  { title: loaderData ? `${(loaderData as any).name} – Athlea Systems` : "Produit – Athlea Systems" },
];

export function loader({ params }: { params: { id: string } }) {
  const product = data.products.find((p) => p.id === Number(params.id));
  if (!product) throw new Response("Not Found", { status: 404 });
  return product;
}

export default function ProduitDetail() {
  const params = useParams();
  const product = data.products.find((p) => p.id === Number(params.id));
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <AlertCircle className="size-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold text-med-nav">Produit introuvable</h1>
        <p className="text-muted-foreground mt-2">Ce produit n'existe pas ou a été retiré du catalogue.</p>
        <Link to="/products">
          <Button className="mt-6 bg-med-cta hover:bg-med-hover text-primary-foreground">
            Retour au catalogue
          </Button>
        </Link>
      </div>
    );
  }

  const category = data.categories.find((c) => c.id === product.category);
  const inCart = items.find((i) => i.productId === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        reference: product.reference,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const relatedProducts = data.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <Link to="/" className="hover:text-med-cta">Accueil</Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <Link to="/products" className="hover:text-med-cta">Catalogue</Link>
        <ChevronRight className="size-3.5 shrink-0" />
        {category && (
          <>
            <Link to={`/products?cat=${category.id}`} className="hover:text-med-cta">
              {category.name}
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
          </>
        )}
        <span className="text-med-nav font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image placeholder */}
        <div className="relative aspect-square w-full max-w-lg rounded-2xl bg-secondary overflow-hidden">
          <div className="flex size-full items-center justify-center text-med-cta/20">
            <svg className="size-32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {product.badge && (
            <Badge className="absolute top-4 left-4 bg-med-cta text-primary-foreground hover:bg-med-cta">
              {product.badge}
            </Badge>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Réf. {product.reference}</p>
            {category && (
              <Link
                to={`/products?cat=${category.id}`}
                className="text-xs text-med-cta hover:underline mb-2 inline-block"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-2xl font-semibold text-med-nav leading-tight mt-1">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-med-nav">
              {product.price.toFixed(2).replace(".", ",")} €
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {product.originalPrice.toFixed(2).replace(".", ",")} €
              </span>
            )}
            <span className="text-sm text-muted-foreground">HT + TVA {product.tva}%</span>
          </div>

          {/* TTC price */}
          <p className="text-sm text-muted-foreground -mt-3">
            Soit{" "}
            <strong className="text-med-nav">
              {(product.price * (1 + product.tva / 100)).toFixed(2).replace(".", ",")} € TTC
            </strong>
          </p>

          {/* Availability */}
          <div className="flex items-center gap-2">
            {product.available ? (
              <>
                <div className="size-2.5 rounded-full bg-med-available" />
                <span className="text-sm text-med-available font-medium">
                  En stock ({product.stock} unité{product.stock > 1 ? "s" : ""})
                </span>
              </>
            ) : (
              <>
                <div className="size-2.5 rounded-full bg-destructive" />
                <span className="text-sm text-destructive font-medium">Rupture de stock</span>
              </>
            )}
          </div>

          {product.minOrderQty > 1 && (
            <p className="text-xs text-muted-foreground -mt-2">
              Quantité minimale de commande : {product.minOrderQty} {product.unit}
            </p>
          )}

          <Separator />

          {/* Quantity + Add to cart */}
          {product.available && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-med-nav">Quantité</p>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQty((q) => Math.max(product.minOrderQty, q - 1))}
                    className="flex size-9 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-l-lg"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-med-nav">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="flex size-9 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-r-lg"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">/ {product.unit}</span>
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

          {/* Description accordion */}
          <Accordion type="multiple" defaultValue={["description", "features"]} className="mt-2">
            <AccordionItem value="description">
              <AccordionTrigger className="text-sm font-medium text-med-nav">
                Description
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="features">
              <AccordionTrigger className="text-sm font-medium text-med-nav">
                Caractéristiques
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-1.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="size-4 text-med-available shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specs">
              <AccordionTrigger className="text-sm font-medium text-med-nav">
                Spécifications techniques
              </AccordionTrigger>
              <AccordionContent>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b border-border last:border-0">
                        <td className="py-2 pr-4 font-medium text-med-nav w-40">{key}</td>
                        <td className="py-2 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>

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

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-med-nav">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-med-cta hover:shadow-md"
              >
                <div className="aspect-square bg-secondary flex items-center justify-center text-med-cta/20">
                  <svg className="size-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <h3 className="text-xs font-medium text-med-nav line-clamp-2">{p.name}</h3>
                  <span className="text-sm font-semibold text-med-nav">
                    {p.price.toFixed(2).replace(".", ",")} €
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
