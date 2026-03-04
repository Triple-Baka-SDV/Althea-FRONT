import { Link } from "@remix-run/react";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerNav = {
  boutique: [
    { label: "Accueil", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "Produits", href: "/produits" },
    { label: "Top Produits", href: "/produits?top=true" },
  ],
  aide: [
    { label: "Contact", href: "/contact" },
    { label: "ChatBot", href: "/chatbot" },
    { label: "FAQ", href: "/faq" },
    { label: "Suivi de commande", href: "/compte/commandes" },
  ],
  legal: [
    { label: "Mentions legales", href: "/mentions-legales" },
    { label: "Conditions generales d'utilisation", href: "/cgu" },
    { label: "Politique de confidentialite", href: "/confidentialite" },
    { label: "Politique de cookies", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: <Facebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <Instagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <Twitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <Youtube className="size-5" />, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="hidden bg-med-nav text-primary-foreground lg:block">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-med-cta">
                <span className="text-base font-semibold text-primary-foreground">M</span>
              </div>
              <span
                className="text-lg font-semibold text-primary-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                MediShop
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Votre pharmacie en ligne de confiance. Produits medicaux de qualite, livraison rapide
              et conseils professionnels.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <Phone className="size-4" />
                01 23 45 67 89
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4" />
                contact@medishop.fr
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4" />
                Paris, France
              </span>
            </div>
          </div>

          {/* Boutique links */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Boutique
            </h3>
            <ul className="flex flex-col gap-2">
              {footerNav.boutique.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-med-cta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide links */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Aide
            </h3>
            <ul className="flex flex-col gap-2">
              {footerNav.aide.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-med-cta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Informations legales
            </h3>
            <ul className="flex flex-col gap-2">
              {footerNav.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-med-cta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex items-center justify-between border-t border-primary-foreground/10 pt-6">
          <p className="text-sm text-primary-foreground/50">
            {"2026 MediShop. Tous droits reserves."}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/70 transition-colors hover:border-med-cta hover:text-med-cta"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
