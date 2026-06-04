import type { MetaFunction } from "@remix-run/node";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const meta: MetaFunction = () => [
  { title: "Politique de cookies – Althea Systems" },
  {
    name: "description",
    content:
      "Politique de cookies d'Althea Systems : types de cookies utilisés, finalités et gestion des préférences.",
  },
];

const cookieTable = [
  {
    name: "session",
    purpose: "Maintien de la session utilisateur connecté",
    type: "Essentiel",
    duration: "Session",
  },
  {
    name: "cart",
    purpose: "Conservation du panier entre les visites",
    type: "Essentiel",
    duration: "30 jours",
  },
  {
    name: "theme",
    purpose: "Mémorisation du thème (clair / sombre)",
    type: "Préférence",
    duration: "12 mois",
  },
  {
    name: "auth-token",
    purpose: "Authentification sécurisée (Better Auth)",
    type: "Essentiel",
    duration: "7 jours",
  },
  {
    name: "_ga",
    purpose: "Mesure d'audience anonyme",
    type: "Statistique",
    duration: "13 mois",
  },
];

export default function Cookies() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1
            className="mb-8 text-3xl font-semibold text-med-nav"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Politique de cookies
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Dernière mise à jour : 4 juin 2026
          </p>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              1. Qu'est-ce qu'un cookie ?
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Un cookie est un petit fichier texte déposé sur votre terminal
              (ordinateur, smartphone, tablette) lors de la consultation d'un
              site web. Il permet au site de mémoriser des informations sur
              votre visite, comme votre langue préférée ou votre statut de
              connexion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              2. Types de cookies utilisés
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-foreground/80">
              <li>
                <strong>Cookies essentiels :</strong> indispensables au
                fonctionnement du site (panier, authentification, sécurité).
                Ils ne nécessitent pas votre consentement.
              </li>
              <li>
                <strong>Cookies de préférence :</strong> mémorisent vos choix
                (thème, langue) pour améliorer votre expérience.
              </li>
              <li>
                <strong>Cookies statistiques :</strong> mesurent l'audience du
                site de façon anonymisée. Soumis à votre consentement.
              </li>
              <li>
                <strong>Cookies marketing :</strong> non utilisés sur Althea
                Systems.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              3. Liste des cookies déposés
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold text-med-nav">Nom</th>
                    <th className="px-4 py-2 font-semibold text-med-nav">
                      Finalité
                    </th>
                    <th className="px-4 py-2 font-semibold text-med-nav">Type</th>
                    <th className="px-4 py-2 font-semibold text-med-nav">
                      Durée
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTable.map((c) => (
                    <tr key={c.name} className="border-t border-border">
                      <td className="px-4 py-2 font-mono text-xs text-foreground/80">
                        {c.name}
                      </td>
                      <td className="px-4 py-2 text-foreground/80">
                        {c.purpose}
                      </td>
                      <td className="px-4 py-2 text-foreground/80">{c.type}</td>
                      <td className="px-4 py-2 text-foreground/80">
                        {c.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              4. Gérer vos préférences
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Vous pouvez à tout moment configurer vos préférences depuis le
              bandeau cookies présent en bas de la page d'accueil. Vous pouvez
              également supprimer ou bloquer les cookies depuis les paramètres
              de votre navigateur :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-foreground/80">
              <li>Chrome : Paramètres → Confidentialité et sécurité → Cookies</li>
              <li>Firefox : Préférences → Vie privée et sécurité</li>
              <li>Safari : Préférences → Confidentialité</li>
              <li>Edge : Paramètres → Cookies et autorisations de site</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-med-nav">
              5. En savoir plus
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Pour plus d'informations sur les cookies, vous pouvez consulter le
              site de la CNIL à l'adresse{" "}
              <a
                href="https://www.cnil.fr/fr/cookies-et-autres-traceurs"
                target="_blank"
                rel="noreferrer"
                className="text-med-cta underline hover:text-med-hover"
              >
                www.cnil.fr
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
