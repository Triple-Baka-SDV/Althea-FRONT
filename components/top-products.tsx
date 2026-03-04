import { Link } from "@remix-run/react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  available: boolean;
}

const topProducts: Product[] = [
  {
    id: 1,
    name: "Tensiometre automatique bras",
    price: "49,90",
    originalPrice: "69,90",
    badge: "Promo",
    available: true,
  },
  {
    id: 2,
    name: "Oxymetre de pouls digital",
    price: "29,90",
    available: true,
  },
  {
    id: 3,
    name: "Thermometre infrarouge sans contact",
    price: "34,50",
    badge: "Top vente",
    available: true,
  },
  {
    id: 4,
    name: "Kit premiers secours complet",
    price: "24,90",
    available: true,
  },
  {
    id: 5,
    name: "Masques chirurgicaux (boite de 50)",
    price: "12,90",
    available: true,
  },
  {
    id: 6,
    name: "Gel hydroalcoolique 500ml",
    price: "8,90",
    originalPrice: "11,90",
    badge: "Promo",
    available: true,
  },
  {
    id: 7,
    name: "Bande de contention elastique",
    price: "15,50",
    available: false,
  },
  {
    id: 8,
    name: "Stethoscope professionnel",
    price: "89,90",
    badge: "Nouveau",
    available: true,
  },
];

export function TopProducts() {
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
          {topProducts.map((product) => (
            <Link
              key={product.id}
              to={`/produits/${product.id}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-med-cta hover:shadow-md"
            >
              {/* Image placeholder */}
              <div className="relative aspect-square w-full bg-secondary">
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
                {/* Badges */}
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-med-cta text-primary-foreground hover:bg-med-cta">
                    {product.badge}
                  </Badge>
                )}
                {!product.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                    <Badge className="bg-muted-foreground text-primary-foreground hover:bg-muted-foreground">
                      Indisponible
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-sm font-medium text-med-nav">
                  {product.name}
                </h3>
                <div className="mt-auto flex items-center gap-2">
                  <span className="text-lg font-semibold text-med-nav" style={{ fontFamily: "var(--font-heading)" }}>
                    {product.price} {"EUR"}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice} {"EUR"}
                    </span>
                  )}
                </div>
                {product.available && (
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-med-available" />
                    <span className="text-xs text-med-available">En stock</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/produits">
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
