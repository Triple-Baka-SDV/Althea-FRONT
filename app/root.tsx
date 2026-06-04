import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";

export const meta: MetaFunction = () => {
  return [
    { title: "Althea Systems - Votre pharmacie en ligne" },
    { name: "description", content: "Althea Systems - Achetez vos produits medicaux en ligne. Large choix de produits de sante, livraison rapide et service de qualite." },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export default function App() {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans antialiased">
        <CartProvider>
          <Outlet />
        </CartProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
