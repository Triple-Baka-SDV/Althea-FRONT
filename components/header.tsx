import { Link } from "@remix-run/react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { UserMenu } from "@/components/user-menu";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Produits", href: "/produits" },
  { label: "Contact", href: "/contact" },
  { label: "ChatBot", href: "/chatbot" },
];

const footerLinks = [
  { label: "Mentions legales", href: "/mentions-legales" },
  { label: "CGU", href: "/cgu" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Top bar */}
      <div className="hidden bg-med-nav text-primary-foreground lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5" />
              01 23 45 67 89
            </span>
          </div>
          <div className="flex items-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="transition-colors hover:text-med-bg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-med-cta">
            <span className="text-lg font-semibold text-primary-foreground">AT</span>
          </div>
          <span className="text-xl font-semibold text-med-nav" style={{ fontFamily: "var(--font-heading)" }}>
            Athlea Systems
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" aria-label="Rechercher" className="text-med-nav hover:bg-secondary hover:text-med-cta">
            <Search className="size-5" />
          </Button>
          <Link to="/basket">
            <Button variant="ghost" size="icon" aria-label="Panier" className="relative text-med-nav hover:bg-secondary hover:text-med-cta">
              <ShoppingCart className="size-5" />
              <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-med-cta text-[10px] font-semibold text-primary-foreground">
                0
              </span>
            </Button>
          </Link>
          {!isLoading && <UserMenu />}
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/basket">
            <Button variant="ghost" size="icon" aria-label="Panier" className="relative text-med-nav">
              <ShoppingCart className="size-5" />
              <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-med-cta text-[10px] font-semibold text-primary-foreground">
                0
              </span>
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="text-med-nav">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background">
              <SheetHeader>
                <SheetTitle className="text-med-nav" style={{ fontFamily: "var(--font-heading)" }}>
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta"
                    >
                      <User className="size-4" />
                      Mon profil
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta"
                  >
                    <User className="size-4" />
                    Se connecter
                  </Link>
                )}
                <Link
                  to="/search"
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta"
                >
                  <Search className="size-4" />
                  Rechercher
                </Link>
                <div className="my-3 h-px bg-border" />
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-med-cta"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
