import type { MetaFunction } from "@remix-run/node";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const meta: MetaFunction = () => [
  { title: "Conditions générales d'utilisation – Althea Systems" },
  {
    name: "description",
    content:
      "Conditions générales d'utilisation et de vente du site Althea Systems.",
  },
];

export default function CGU() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1
            className="mb-8 text-3xl font-semibold text-med-nav"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Conditions générales d'utilisation
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Dernière mise à jour : 4 juin 2026
          </p>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 1 — Objet
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Les présentes Conditions Générales d'Utilisation (CGU) ont pour
              objet de définir les modalités et conditions dans lesquelles
              Althea Systems met à disposition de ses utilisateurs son site
              internet, ainsi que les règles d'usage du service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 2 — Acceptation des conditions
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              L'utilisation du site implique l'acceptation pleine et entière des
              présentes CGU. Ces conditions sont applicables à tout utilisateur
              du site. Althea Systems se réserve le droit de modifier à tout
              moment les présentes CGU. Les conditions applicables sont celles
              en vigueur à la date de la commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 3 — Accès au service
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Le site est accessible gratuitement à tout utilisateur disposant
              d'un accès à Internet. La création d'un compte est nécessaire pour
              passer commande. L'utilisateur s'engage à fournir des informations
              exactes et à les tenir à jour. Tous les frais (matériel,
              logiciel, connexion) sont à la charge de l'utilisateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 4 — Commandes et produits
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Les produits proposés sont décrits avec la plus grande précision
              possible. Les photographies sont communiquées à titre indicatif.
              Althea Systems se réserve le droit de modifier l'offre de
              produits à tout moment. Les prix sont indiqués en euros toutes
              taxes comprises (TTC) hors frais de livraison.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 5 — Paiement
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Le règlement des achats s'effectue par carte bancaire, virement
              bancaire ou chèque. La commande est validée une fois le paiement
              encaissé. Les transactions sont sécurisées et les données
              bancaires ne sont jamais conservées sur nos serveurs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 6 — Livraison
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Les produits sont livrés à l'adresse indiquée par l'utilisateur
              lors de la commande. Les délais de livraison sont donnés à titre
              indicatif. En cas de retard, l'utilisateur sera informé par
              courriel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 7 — Droit de rétractation et remboursement
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Conformément aux dispositions du Code de la consommation,
              l'utilisateur dispose d'un délai de 14 jours à compter de la
              réception de sa commande pour exercer son droit de rétractation.
              Certains produits (notamment les médicaments et les produits
              d'hygiène descellés) ne sont pas concernés par ce droit pour des
              raisons sanitaires.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 8 — Responsabilité
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Althea Systems ne saurait être tenue responsable des dommages
              résultant d'une mauvaise utilisation du service ou de tout
              événement extérieur (panne, intrusion, virus). L'utilisateur
              reconnaît avoir pris connaissance des présentes conditions et
              s'engage à les respecter.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              Article 9 — Droit applicable
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Les présentes CGU sont régies par le droit français. En cas de
              litige, et après tentative de recherche d'une solution amiable,
              compétence expresse est attribuée aux tribunaux français.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
