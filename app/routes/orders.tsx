import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import {
  ChevronRight, Package, Truck, CheckCircle2, Clock, XCircle, FileText, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { fetchOrdersByClient, type ApiOrder } from "@/lib/api";

export const meta: MetaFunction = () => [
  { title: "Historique des commandes – Athlea Systems" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  en_attente: { label: "En attente",    color: "bg-med-alert/10 text-med-alert border-med-alert/30",               icon: Clock        },
  en_cours:   { label: "En préparation",color: "bg-blue-50 text-blue-700 border-blue-200",                          icon: Package      },
  expediee:   { label: "Expédiée",      color: "bg-purple-50 text-purple-700 border-purple-200",                    icon: Truck        },
  livree:     { label: "Livrée",        color: "bg-med-available/10 text-med-available border-med-available/30",    icon: CheckCircle2 },
  annulee:    { label: "Annulée",       color: "bg-destructive/10 text-destructive border-destructive/30",           icon: XCircle      },
};

// One order group = one checkout session (shared commandeRef)
interface OrderGroup {
  ref: string;               // commandeRef or "solo-{id}" for legacy single-item orders
  displayRef: string;        // short label shown to user
  items: ApiOrder[];
  status: string;
  createdAt: string;
  totalHT: number;
  totalTTC: number;
  address: string | null;
}

function groupOrders(flat: ApiOrder[]): OrderGroup[] {
  const map = new Map<string, ApiOrder[]>();

  for (const order of flat) {
    const key = order.orders.commandeRef ?? `solo-${order.orders.id}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(order);
  }

  return Array.from(map.entries())
    .map(([key, items]) => {
      const first = items[0].orders;
      const totalHT = items.reduce(
        (sum, o) => sum + parseFloat(o.orders.unitaryPrice ?? "0") * (o.orders.quantity ?? 1),
        0
      );
      const totalTTC = items.reduce((sum, o) => {
        const ht = parseFloat(o.orders.unitaryPrice ?? "0") * (o.orders.quantity ?? 1);
        return sum + ht * (1 + parseFloat(o.orders.taxRate ?? "0") / 100);
      }, 0);
      const adresses = items[0].adresses;
      const address = adresses
        ? [adresses.adress, adresses.city, adresses.country].filter(Boolean).join(", ")
        : first.adress ?? null;

      const isSolo = key.startsWith("solo-");
      const displayRef = isSolo
        ? `#${first.id}`
        : `#${key.slice(0, 8).toUpperCase()}`;

      return {
        ref: key,
        displayRef,
        items,
        status: first.status ?? "en_attente",
        createdAt: first.createdAt,
        totalHT,
        totalTTC,
        address,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: Package };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

function GroupCard({ group }: { group: OrderGroup }) {
  const isLivree = group.status === "livree";

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-semibold text-med-nav">{group.displayRef}</span>
            <StatusBadge status={group.status} />
            <span className="text-xs text-muted-foreground">
              {group.items.length} article{group.items.length > 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Commandé le{" "}
            {new Date(group.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-right">
            <p className="text-sm font-bold text-med-nav">
              {group.totalTTC.toFixed(2).replace(".", ",")} € TTC
            </p>
            <p className="text-xs text-muted-foreground">
              {group.totalHT.toFixed(2).replace(".", ",")} € HT
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/invoices">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <FileText className="size-3.5" /> Facture
              </Button>
            </Link>
            {isLivree && (
              <Link to="/refunds">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <RotateCcw className="size-3.5" /> Retour
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="border-t border-border px-5 py-4 flex flex-col gap-3">
        {group.items.map((order) => {
          const o = order.orders;
          const price = parseFloat(o.unitaryPrice ?? "0");
          const qty = o.quantity ?? 1;
          const name = o.productName ?? order.products?.names ?? "Produit";

          return (
            <div key={o.id} className="flex items-center gap-3 text-sm">
              <div className="size-9 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-med-cta/30">
                <Package className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to={order.products ? `/products/${order.products.id}` : "#"}
                  className="text-med-nav hover:text-med-cta font-medium line-clamp-1"
                >
                  {name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  Qté : {qty} · {price.toFixed(2).replace(".", ",")} € / unité
                </p>
              </div>
              <span className="font-medium text-med-nav shrink-0">
                {(price * qty).toFixed(2).replace(".", ",")} € HT
              </span>
            </div>
          );
        })}

        {group.address && (
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground mt-1">
            <p className="font-medium text-med-nav mb-0.5">Adresse de livraison</p>
            <p>{group.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommandesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [groups, setGroups] = useState<OrderGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    fetchOrdersByClient(user.id)
      .then((data) => setGroups(groupOrders(data)))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const totalOrders = groups.length;
  const statusCounts = groups.reduce<Record<string, number>>((acc, g) => {
    acc[g.status] = (acc[g.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-8">
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

          {loading || authLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">Chargement…</p>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">Connectez-vous pour voir vos commandes.</p>
              <Link to="/login" className="mt-4">
                <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground">Se connecter</Button>
              </Link>
            </div>
          ) : (
            <>
              {totalOrders > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const count = statusCounts[key] ?? 0;
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
              )}

              {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Package className="size-14 text-muted-foreground/40 mb-4" />
                  <h2 className="text-lg font-medium text-med-nav">Aucune commande</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous n'avez pas encore passé de commande.
                  </p>
                  <Link to="/products" className="mt-5">
                    <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground">
                      Parcourir le catalogue
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {groups.map((group) => (
                    <GroupCard key={group.ref} group={group} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
