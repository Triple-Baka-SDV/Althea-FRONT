import type { MetaFunction } from "@remix-run/node";
import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { FixedTextSection } from "@/components/fixed-text-section";
import { CategoriesGrid } from "@/components/categories-grid";
import { TopProducts } from "@/components/top-products";
import { Footer } from "@/components/footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Athlea Systems - Votre pharmacie en ligne" },
    {
      name: "description",
      content:
        "Achetez vos produits medicaux en ligne. Large choix, livraison rapide et prix competitifs.",
    },
  ];
};

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroCarousel />
        <FixedTextSection />
        <CategoriesGrid />
        <TopProducts />
      </main>
      <Footer />
    </div>
  );
}
