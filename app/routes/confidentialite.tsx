import type { MetaFunction } from "@remix-run/node";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const meta: MetaFunction = () => [
  { title: "Politique de confidentialité – Althea Systems" },
  {
    name: "description",
    content:
      "Politique de confidentialité d'Althea Systems : traitement des données personnelles, droits RGPD et sécurité.",
  },
];

export default function Confidentialite() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1
            className="mb-8 text-3xl font-semibold text-med-nav"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Politique de confidentialité
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Dernière mise à jour : 4 juin 2026
          </p>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              1. Responsable du traitement
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Le responsable du traitement de vos données personnelles est
              Althea Systems SAS, 12 rue de la Pharmacie, 75001 Paris. Pour
              toute question relative à vos données, vous pouvez nous contacter
              à l'adresse <strong>dpo@altheasystems.fr</strong>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              2. Données collectées
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              Dans le cadre de l'utilisation de nos services, nous collectons
              les catégories de données suivantes :
            </p>
            <ul className="list-disc space-y-1 pl-6 text-sm text-foreground/80">
              <li>Données d'identification (nom, prénom, e-mail, téléphone)</li>
              <li>Données de connexion (identifiants, mot de passe chiffré)</li>
              <li>Données de facturation et de livraison (adresses, SIRET, TVA)</li>
              <li>Données professionnelles (numéro RPPS, spécialité)</li>
              <li>Historique des commandes et des factures</li>
              <li>Données techniques (adresse IP, navigateur, cookies)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              3. Finalités du traitement
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              Vos données sont traitées pour les finalités suivantes :
            </p>
            <ul className="list-disc space-y-1 pl-6 text-sm text-foreground/80">
              <li>Gestion de votre compte et de vos commandes</li>
              <li>Traitement des paiements et de la facturation</li>
              <li>Livraison de vos commandes</li>
              <li>Service après-vente et gestion des remboursements</li>
              <li>Respect des obligations légales et comptables</li>
              <li>Amélioration de nos services et de notre site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              4. Base légale
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Les traitements sont fondés sur l'exécution du contrat
              (commandes), le respect d'obligations légales (facturation,
              comptabilité) et, le cas échéant, votre consentement (cookies non
              essentiels, communications commerciales).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              5. Durée de conservation
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Vos données sont conservées le temps nécessaire à la fourniture
              du service, puis archivées conformément aux obligations légales :
              10 ans pour les factures, 3 ans pour les données de prospection à
              compter du dernier contact, et jusqu'à la suppression du compte
              pour les données de compte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              6. Destinataires des données
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Vos données sont destinées aux services internes d'Althea
              Systems. Elles peuvent être communiquées à nos prestataires
              (hébergeur, prestataire de paiement, transporteur) dans le cadre
              strict de l'exécution de leurs missions, ou aux autorités
              compétentes en cas d'obligation légale.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              7. Vos droits (RGPD)
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              Conformément au Règlement Général sur la Protection des Données,
              vous disposez des droits suivants :
            </p>
            <ul className="list-disc space-y-1 pl-6 text-sm text-foreground/80">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement (« droit à l'oubli »)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d'opposition</li>
              <li>Droit de définir des directives post-mortem</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              Pour exercer ces droits, contactez-nous à{" "}
              <strong>dpo@altheasystems.fr</strong>. Vous disposez également du
              droit d'introduire une réclamation auprès de la CNIL
              (www.cnil.fr).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              8. Sécurité
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Althea Systems met en œuvre les mesures techniques et
              organisationnelles appropriées pour garantir la sécurité de vos
              données : chiffrement des mots de passe, communications HTTPS,
              accès restreint aux données, sauvegardes régulières.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
