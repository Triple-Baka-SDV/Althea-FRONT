import type { MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import data from "@/data/data.json";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useState } from "react";

export const meta: MetaFunction = ({ params }) => {
  const category = data.categories.find((c) => c.slug === params.slug);
  return [
    { title: `${category?.name || "Catégorie"} - Athlea Systems` },
    {
      name: "description",
      content: category?.description || "Parcourez nos produits médicaux par catégorie",
    },
  ];
};

export default function CategoryPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});

  const category = data.categories.find((c) => c.slug === slug);
  const products = data.products.filter((p) => p.category === slug);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <h1 className="text-2xl font-semibold text-med-nav">Catégorie introuvable</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: "", // Add image if available
    });
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-med-nav to-med-cta py-12 text-primary-foreground">
          <div className="mx-auto max-w-7xl px-6">
            <h1
              className="mb-2 text-3xl font-semibold md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {category.name}
            </h1>
            <p className="text-sm md:text-base opacity-90">{category.description}</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Aucun produit dans cette catégorie</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col rounded-lg border border-border bg-background p-4 transition-shadow hover:shadow-md"
                >
                  {/* Badge */}
                  {product.badge && (
                    <div className="mb-3 flex items-start justify-between">
                      <span className="inline-block rounded-full bg-med-cta px-3 py-1 text-xs font-semibold text-primary-foreground">
                        {product.badge}
                      </span>
                      {!product.available && (
                        <span className="text-xs font-medium text-red-600">Indisponible</span>
                      )}
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="mb-4 flex-1">
                    <h3 className="mb-2 font-semibold text-med-nav line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    {/* Stock info */}
                    <div className="mb-3 text-xs">
                      {product.available ? (
                        <span className="text-green-600 font-medium">En stock ({product.stock})</span>
                      ) : (
                        <span className="text-red-600 font-medium">Rupture de stock</span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-med-cta">{product.price.toFixed(2)} €</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice.toFixed(2)} €
                      </span>
                    )}
                  </div>

                  {/* Add to cart button */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.available}
                    className={`w-full ${
                      addedItems[product.id]
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-med-cta hover:bg-med-nav"
                    }`}
                  >
                    <ShoppingCart className="mr-2 size-4" />
                    {addedItems[product.id] ? "Ajouté ✓" : "Ajouter au panier"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
