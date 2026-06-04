import type { MetaFunction } from "@remix-run/node";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const meta: MetaFunction = () => [
  { title: "Mentions légales – Althea Systems" },
  {
    name: "description",
    content:
      "Mentions légales d'Althea Systems : éditeur du site, hébergeur, propriété intellectuelle et coordonnées.",
  },
];

export default function MentionsLegales() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1
            className="mb-8 text-3xl font-semibold text-med-nav"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Mentions légales
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Dernière mise à jour : 4 juin 2026
          </p>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              1. Éditeur du site
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Le site Althea Systems est édité par la société Althea Systems SAS,
              au capital social de 50 000 €, immatriculée au RCS de Paris sous
              le numéro 912 345 678, dont le siège social est situé au 12 rue de
              la Pharmacie, 75001 Paris, France.
            </p>
            <ul className="mt-3 list-none space-y-1 text-sm text-foreground/80">
              <li>
                <strong>Numéro de TVA intracommunautaire :</strong> FR 12 912345678
              </li>
              <li>
                <strong>Directeur de la publication :</strong> Dr. Claire Dupont
              </li>
              <li>
                <strong>Téléphone :</strong> 01 23 45 67 89
              </li>
              <li>
                <strong>E-mail :</strong> contact@altheasystems.fr
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              2. Hébergeur
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Le site est hébergé par OVH SAS, 2 rue Kellermann, 59100 Roubaix,
              France. Téléphone : 1007.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              3. Propriété intellectuelle
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              L'ensemble des contenus présents sur le site (textes, images,
              logos, vidéos, base de données) est protégé par le droit d'auteur
              et le droit des marques. Toute reproduction, représentation ou
              diffusion, totale ou partielle, sans autorisation écrite
              préalable d'Althea Systems est strictement interdite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              4. Responsabilité
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Althea Systems s'efforce d'assurer l'exactitude et la mise à jour
              des informations diffusées sur ce site. Toutefois, l'éditeur ne
              peut garantir l'exhaustivité des informations et ne saurait être
              tenu responsable des erreurs ou omissions, ni de l'utilisation qui
              pourrait en être faite par un tiers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              5. Données personnelles
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Le traitement de vos données personnelles est détaillé dans notre{" "}
              <a
                href="/confidentialite"
                className="text-med-cta underline hover:text-med-hover"
              >
                Politique de confidentialité
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              6. Contact
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Pour toute question relative à ces mentions, vous pouvez nous
              contacter via la{" "}
              <a
                href="/contact"
                className="text-med-cta underline hover:text-med-hover"
              >
                page contact
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
