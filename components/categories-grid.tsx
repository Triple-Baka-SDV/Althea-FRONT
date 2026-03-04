import { Link } from "@remix-run/react";
import {
  Stethoscope,
  Pill,
  Heart,
  Baby,
  Eye,
  Bone,
  Droplets,
  Shield,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  href: string;
  productCount: number;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Equipements medicaux",
    icon: <Stethoscope className="size-8" />,
    href: "/categories/equipements-medicaux",
    productCount: 124,
  },
  {
    id: 2,
    name: "Medicaments",
    icon: <Pill className="size-8" />,
    href: "/categories/medicaments",
    productCount: 356,
  },
  {
    id: 3,
    name: "Soins cardiovasculaires",
    icon: <Heart className="size-8" />,
    href: "/categories/soins-cardiovasculaires",
    productCount: 89,
  },
  {
    id: 4,
    name: "Puericulture",
    icon: <Baby className="size-8" />,
    href: "/categories/puericulture",
    productCount: 203,
  },
  {
    id: 5,
    name: "Optique",
    icon: <Eye className="size-8" />,
    href: "/categories/optique",
    productCount: 67,
  },
  {
    id: 6,
    name: "Orthopedie",
    icon: <Bone className="size-8" />,
    href: "/categories/orthopedie",
    productCount: 145,
  },
  {
    id: 7,
    name: "Dermatologie",
    icon: <Droplets className="size-8" />,
    href: "/categories/dermatologie",
    productCount: 178,
  },
  {
    id: 8,
    name: "Hygiene & Prevention",
    icon: <Shield className="size-8" />,
    href: "/categories/hygiene-prevention",
    productCount: 234,
  },
];

export function CategoriesGrid() {
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
              to={category.href}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center transition-all hover:border-med-cta hover:shadow-md"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-med-cta transition-colors group-hover:bg-med-cta group-hover:text-primary-foreground">
                {category.icon}
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
