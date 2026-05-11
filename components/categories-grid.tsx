import { Link } from "@remix-run/react";
import {
  Stethoscope,
  Shield,
  Bandage,
  Armchair,
  AlertCircle,
  Bone,
  Microscope,
  Package,
} from "lucide-react";
import data from "@/data/data.json";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
}

const iconMap: Record<string, React.ReactNode> = {
  diagnostic: <Stethoscope className="size-8" />,
  protection: <Shield className="size-8" />,
  soins: <Bandage className="size-8" />,
  mobilier: <Armchair className="size-8" />,
  urgences: <AlertCircle className="size-8" />,
  orthopedie: <Bone className="size-8" />,
  imagerie: <Microscope className="size-8" />,
  consommables: <Package className="size-8" />,
};

export function CategoriesGrid() {
  const categories: Category[] = data.categories;

  return (
    <section className="px-6 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2
            className="mb-3 text-2xl font-semibold text-med-nav md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Nos categories
          </h2>
          <p className="text-base text-muted-foreground">
            Parcourez notre selection de produits medicaux par categorie
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center transition-all hover:border-med-cta hover:shadow-md"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-med-cta transition-colors group-hover:bg-med-cta group-hover:text-primary-foreground">
                {iconMap[category.id as keyof typeof iconMap] || <Package className="size-8" />}
              </div>
              <div>
                <h3
                  className="text-sm font-semibold text-med-nav md:text-base"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {category.productCount} produits
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
