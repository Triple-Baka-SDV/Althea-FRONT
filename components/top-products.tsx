import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, type ApiProduct } from "@/lib/api";

export function TopProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        const active = data.filter((p) => p.products.active !== false);
        setProducts(active.slice(0, 8));
      })
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-muted px-6 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2
            className="mb-3 text-2xl font-semibold text-med-nav md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Les Top Produits du moment
          </h2>
          <p className="text-base text-muted-foreground">
            Notre selection de produits incontournables
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map(({ products: p, stocks }) => {
            const price = parseFloat(p.unitaryPrice ?? "0");
            const available = (p.active ?? false) && (stocks?.quantity ?? 0) > 0;
            return (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-med-cta hover:shadow-md"
              >
                <div className="relative aspect-square w-full bg-secondary">
                  {p.linkPix ? (
                    <img src={p.linkPix} alt={p.names} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-med-cta/30">
                      <svg
                        className="size-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
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
                  <h3 className="line-clamp-2 text-sm font-medium text-med-nav">
                    {p.names}
                  </h3>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="text-lg font-semibold text-med-nav" style={{ fontFamily: "var(--font-heading)" }}>
                      {price.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  {available && (
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-med-available" />
                      <span className="text-xs text-med-available">En stock</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link to="/products">
            <Button
              size="lg"
              className="bg-med-cta text-primary-foreground hover:bg-med-hover"
            >
              Voir tous les produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
