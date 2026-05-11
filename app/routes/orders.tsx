import { useState } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import data from "@/data/data.json";

export const meta: MetaFunction = () => [
  { title: "Historique des commandes – Athlea Systems" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  en_attente: { label: "En attente", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  en_cours: { label: "En préparation", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Package },
  expediee: { label: "Expédiée", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
  livree: { label: "Livrée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  annulee: { label: "Annulée", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
};

function OrderStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: Package };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

function OrderCard({ order }: { order: (typeof data.orders)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const hasInvoice = !!order.invoiceId;

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-semibold text-med-nav">{order.id}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>Commandé le {new Date(order.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
            {order.deliveryDate && (
              <span>
                Livré le {new Date(order.deliveryDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-right">
            <p className="text-sm font-bold text-med-nav">{order.total.toFixed(2).replace(".", ",")} € TTC</p>
            <p className="text-xs text-muted-foreground">{order.subtotal.toFixed(2).replace(".", ",")} € HT</p>
          </div>
          <div className="flex gap-2">
            {hasInvoice && (
              <Link to={`/invoices`}>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <FileText className="size-3.5" />
                  Facture
                </Button>
              </Link>
            )}
            {order.status === "livree" && (
              <Link to="/remboursements">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <RotateCcw className="size-3.5" />
                  Retour
                </Button>
              </Link>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-med-nav transition-colors"
          >
            {expanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
        </div>
      </div>

      {/* Expandable items */}
      {expanded && (
        <>
          <Separator />
          <div className="p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Articles commandés
            </p>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-med-cta/30">
                    <Package className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/products/${item.productId}`}
                      className="text-med-nav hover:text-med-cta line-clamp-1 font-medium text-sm"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">Qté : {item.qty}</p>
                  </div>
                </div>
                <span className="font-medium text-med-nav shrink-0">
                  {(item.unitPrice * item.qty).toFixed(2).replace(".", ",")} € HT
                </span>
              </div>
            ))}

            <Separator className="mt-1" />

            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total HT</span>
                <span className="text-med-nav">{order.subtotal.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA</span>
                <span className="text-med-nav">{order.tva.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-med-nav">Total TTC</span>
                <span className="text-med-nav">{order.total.toFixed(2).replace(".", ",")} €</span>
              </div>
            </div>

            <div className="mt-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-med-nav mb-0.5">Adresse de livraison</p>
              <p>{order.address.name} – {order.address.street}, {order.address.zip} {order.address.city}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CommandesPage() {
  const orders = [...data.orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-med-cta">Accueil</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-med-nav font-medium">Mes commandes</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-med-nav">Historique des commandes</h1>
            <Link to="/products">
              <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground" size="sm">
                Nouvelle commande
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = data.orders.filter((o) => o.status === key).length;
              if (count === 0) return null;
              const Icon = cfg.icon;
              return (
                <div key={key} className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
                  <div className={`size-9 rounded-full flex items-center justify-center ${cfg.color}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-med-nav">{count}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="size-14 text-muted-foreground/40 mb-4" />
              <h2 className="text-lg font-medium text-med-nav">Aucune commande</h2>
              <p className="text-sm text-muted-foreground mt-2">Vous n'avez pas encore passé de commande.</p>
              <Link to="/products" className="mt-5">
                <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground">
                  Parcourir le catalogue
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
