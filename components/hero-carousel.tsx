import { useCallback, useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCarrousels, fetchCarrouselWithItems, type ApiCarrouselItem } from "@/lib/api";

interface Slide {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  imageUrl?: string | null;
}

const STATIC_SLIDES: Slide[] = [
  {
    id: 1,
    title: "Offre speciale : -20% sur les equipements medicaux",
    description: "Profitez de notre promotion exceptionnelle sur une large selection d'equipements medicaux professionnels. Offre limitee.",
    ctaText: "Decouvrir l'offre",
    ctaLink: "/products",
    bgColor: "bg-med-nav",
  },
  {
    id: 2,
    title: "Nouveautes : Gamme de soins dermatologiques",
    description: "Decouvrez notre nouvelle gamme de produits dermatologiques recommandes par les professionnels de sante.",
    ctaText: "Voir la gamme",
    ctaLink: "/products",
    bgColor: "bg-med-cta",
  },
  {
    id: 3,
    title: "Livraison gratuite des 49 euros d'achat",
    description: "Commandez vos produits de sante en toute serenite. Livraison offerte partout en France metropolitaine.",
    ctaText: "Commander maintenant",
    ctaLink: "/products",
    bgColor: "bg-med-nav",
  },
];

function itemToSlide(item: ApiCarrouselItem, index: number): Slide {
  return {
    id: item.id,
    title: item.title ?? `Slide ${index + 1}`,
    description: item.subtitle ?? "",
    ctaText: "Découvrir",
    ctaLink: "/products",
    bgColor: index % 2 === 0 ? "bg-med-nav" : "bg-med-cta",
    imageUrl: item.imageId,
  };
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(STATIC_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchCarrousels()
      .then(async (carrousels) => {
        const active = carrousels.filter((c) => c.active !== false);
        if (active.length === 0) return;
        const first = active[0];
        const withItems = await fetchCarrouselWithItems(first.id).catch(() => null);
        if (withItems && withItems.items && withItems.items.length > 0) {
          const sorted = [...withItems.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setSlides(sorted.map((item, i) => itemToSlide(item, i)));
        }
      })
      .catch(() => {});
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative overflow-hidden" aria-label="Promotions">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`flex min-w-full flex-col items-center justify-center px-6 py-20 text-primary-foreground md:py-28 lg:py-36 ${slide.bgColor} relative`}
          >
            {slide.imageUrl && (
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="absolute inset-0 size-full object-cover opacity-20"
              />
            )}
            <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <h2
                className="text-2xl leading-tight font-semibold text-balance md:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {slide.title}
              </h2>
              {slide.description && (
                <p className="max-w-xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">
                  {slide.description}
                </p>
              )}
              <Link to={slide.ctaLink}>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-med-nav hover:bg-primary-foreground/90"
                >
                  {slide.ctaText}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/30 hover:text-primary-foreground"
        onClick={prevSlide}
        aria-label="Diapositive precedente"
      >
        <ChevronLeft className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/30 hover:text-primary-foreground"
        onClick={nextSlide}
        aria-label="Diapositive suivante"
      >
        <ChevronRight className="size-5" />
      </Button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-primary-foreground"
                : "w-2.5 bg-primary-foreground/50"
            }`}
            aria-label={`Aller a la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
