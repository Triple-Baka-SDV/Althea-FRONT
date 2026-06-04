import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { ShoppingCart, Trash2, Minus, Plus, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/context/cart-context";

export const meta: MetaFunction = () => [
  { title: "Mon panier – Althea Systems" },
];

export default function PanierPage() {
  const { items, count, total, removeItem, updateQty, clearCart } = useCart();

  const tva = total * 0.2;
  const totalTTC = total * 1.2;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-med-cta">Accueil</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-med-nav font-medium">Mon panier</span>
          </nav>

          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl font-semibold text-med-nav">Mon panier</h1>
            {count > 0 && (
              <Badge className="bg-med-cta text-primary-foreground hover:bg-med-cta">
                {count} article{count > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag className="size-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-medium text-med-nav">Votre panier est vide</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                Parcourez notre catalogue et ajoutez des produits à votre panier.
              </p>
              <Link to="/products" className="mt-6">
                <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground gap-2">
                  <ShoppingCart className="size-4" />
                  Continuer mes achats
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Cart items */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-muted-foreground">{count} article{count > 1 ? "s" : ""}</p>
                  <button
                    onClick={clearCart}
                    className="text-sm text-destructive hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5" />
                    Vider le panier
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 rounded-xl border border-border bg-background p-4"
                  >
                    {/* Image placeholder */}
                    <div className="size-20 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-med-cta/30">
                      <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{item.reference}</p>
                          <Link
                            to={`/products/${item.productId}`}
                            className="text-sm font-medium text-med-nav hover:text-med-cta leading-tight line-clamp-2"
                          >
                            {item.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        {/* Quantity control */}
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            onClick={() => updateQty(item.productId, item.qty - 1)}
                            className="flex size-8 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-l-lg"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-med-nav">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.productId, item.qty + 1)}
                            className="flex size-8 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-r-lg"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right">
                          <p className="text-sm font-semibold text-med-nav">
                            {(item.price * item.qty).toFixed(2).replace(".", ",")} € HT
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.price.toFixed(2).replace(".", ",")} € / unité
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Link to="/products" className="mt-2">
                  <Button variant="outline" className="gap-2">
                    <ChevronRight className="size-4 rotate-180" />
                    Continuer mes achats
                  </Button>
                </Link>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-border bg-background p-6 flex flex-col gap-4">
                  <h2 className="text-base font-semibold text-med-nav">Récapitulatif</h2>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total HT</span>
                      <span className="font-medium text-med-nav">{total.toFixed(2).replace(".", ",")} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TVA (20%)</span>
                      <span className="font-medium text-med-nav">{tva.toFixed(2).replace(".", ",")} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-med-available font-medium">Offerte</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold text-med-nav">Total TTC</span>
                    <span className="text-xl font-bold text-med-nav">{totalTTC.toFixed(2).replace(".", ",")} €</span>
                  </div>

                  <Link to="/commande">
                    <Button className="w-full bg-med-cta hover:bg-med-hover text-primary-foreground" size="lg">
                      Passer la commande
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground">
                    Paiement sécurisé · Livraison 24–48h
                  </p>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <Link to="/orders" className="text-xs text-med-cta hover:underline text-center">
                      Historique des commandes
                    </Link>
                    <Link to="/invoices" className="text-xs text-med-cta hover:underline text-center">
                      Gérer mes factures
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
