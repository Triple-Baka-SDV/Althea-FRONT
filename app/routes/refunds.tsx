import { useState } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import {
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import data from "@/data/data.json";

export const meta: MetaFunction = () => [
  { title: "Remboursements – Athlea Systems" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  en_attente: { label: "En attente", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  approuvee: { label: "Approuvée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  refusee: { label: "Refusée", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
};

const REFUND_REASONS = [
  { value: "produit_defectueux", label: "Produit défectueux" },
  { value: "produit_non_conforme", label: "Produit non conforme à la description" },
  { value: "erreur_commande", label: "Erreur de commande" },
  { value: "produit_endommage", label: "Produit endommagé à la livraison" },
  { value: "delai_depasse", label: "Délai de livraison dépassé" },
  { value: "autre", label: "Autre motif" },
];

const DELIVERABLE_ORDERS = data.orders.filter((o) => o.status === "livree");

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: RotateCcw };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

function NewRefundModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: any) => void }) {
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedOrder = DELIVERABLE_ORDERS.find((o) => o.id === orderId);

  const handleSubmit = () => {
    if (!orderId || !reason || !description.trim()) return;
    setSubmitted(true);
    onSubmit({ orderId, reason, description });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-med-nav">Nouvelle demande de remboursement</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              {/* Order selector */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Commande concernée *</Label>
                <Select value={orderId} onValueChange={setOrderId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une commande livrée" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERABLE_ORDERS.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.id} — {new Date(o.date).toLocaleDateString("fr-FR")} ({o.total.toFixed(2).replace(".", ",")} € TTC)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected order items */}
              {selectedOrder && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="font-medium text-med-nav mb-2 text-xs uppercase tracking-wide">Produits de la commande</p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-muted-foreground py-1">
                      <span className="line-clamp-1 flex-1">{item.name}</span>
                      <span className="ml-2">×{item.qty}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reason */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Motif de remboursement *</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un motif" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFUND_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Description détaillée *</Label>
                <Textarea
                  placeholder="Décrivez précisément le problème rencontré : référence des articles, quantité concernée, nature du défaut…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-28 resize-none"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                * Champs obligatoires. Votre demande sera traitée sous 3–5 jours ouvrés.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button
                className="bg-med-cta hover:bg-med-hover text-primary-foreground"
                onClick={handleSubmit}
                disabled={!orderId || !reason || !description.trim()}
              >
                Soumettre la demande
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-med-nav">Demande envoyée</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-6 gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-med-available/10">
                <CheckCircle2 className="size-8 text-med-available" />
              </div>
              <p className="text-sm text-muted-foreground">
                Votre demande de remboursement a bien été enregistrée.
                Notre équipe vous contactera sous <strong>3–5 jours ouvrés</strong>.
              </p>
            </div>
            <DialogFooter>
              <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground" onClick={onClose}>
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RefundCard({ refund }: { refund: (typeof data.refunds)[0] }) {
  const reason = REFUND_REASONS.find((r) => r.value === refund.reason)?.label ?? refund.reason;

  return (
    <div className="rounded-xl border border-border bg-background p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <span className="text-sm font-semibold text-med-nav">{refund.id}</span>
            <StatusBadge status={refund.status} />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Commande {refund.orderId}</span>
            <span>·</span>
            <span>Demandé le {new Date(refund.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
            {refund.resolvedAt && (
              <>
                <span>·</span>
                <span>Traité le {new Date(refund.resolvedAt).toLocaleDateString("fr-FR")}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-med-nav">{refund.amount.toFixed(2).replace(".", ",")} € HT</p>
          <p className="text-xs text-muted-foreground">Montant demandé</p>
        </div>
      </div>

      <Separator />

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Motif</p>
          <p className="text-med-nav">{reason}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Produits concernés</p>
          <div className="flex flex-col gap-1">
            {refund.items.map((item, i) => (
              <p key={i} className="text-muted-foreground text-xs">
                {item.name} ×{item.qty}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Description</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{refund.description}</p>
      </div>

      {refund.status === "approuvee" && (
        <div className="rounded-lg border border-med-available/30 bg-med-available/5 p-3 text-sm text-med-available">
          <p className="font-medium">Remboursement approuvé</p>
          <p className="text-xs mt-0.5">Le remboursement de {refund.amount.toFixed(2).replace(".", ",")} € sera traité sous 5–10 jours ouvrés.</p>
        </div>
      )}
      {refund.status === "refusee" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <p className="font-medium">Demande refusée</p>
          <p className="text-xs mt-0.5">Votre demande n'a pas pu être acceptée. Contactez notre service client pour plus d'informations.</p>
        </div>
      )}
    </div>
  );
}

export default function RemboursementsPage() {
  const [showModal, setShowModal] = useState(false);
  const [extraRefunds, setExtraRefunds] = useState<any[]>([]);

  const allRefunds = [...extraRefunds.reverse(), ...data.refunds];
  const pending = allRefunds.filter((r) => r.status === "en_attente");
  const resolved = allRefunds.filter((r) => r.status !== "en_attente");

  const handleNewRefund = (refund: any) => {
    const newRefund = {
      id: `REM-2025-${String(Date.now()).slice(-4)}`,
      orderId: refund.orderId,
      date: new Date().toISOString().split("T")[0],
      status: "en_attente",
      statusLabel: "En attente",
      reason: refund.reason,
      reasonLabel: REFUND_REASONS.find((r) => r.value === refund.reason)?.label ?? refund.reason,
      items: [],
      amount: 0,
      description: refund.description,
      resolvedAt: null,
    };
    setExtraRefunds((prev) => [...prev, newRefund]);
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-med-cta">Accueil</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-med-nav font-medium">Remboursements</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-med-nav">Remboursements & retours</h1>
            <Button
              className="bg-med-cta hover:bg-med-hover text-primary-foreground gap-2"
              onClick={() => setShowModal(true)}
            >
              <Plus className="size-4" />
              Nouvelle demande
            </Button>
          </div>

          {/* Info box */}
          <div className="mb-6 rounded-xl border border-border bg-background p-5 flex gap-4">
            <div className="size-10 shrink-0 rounded-full bg-secondary flex items-center justify-center text-med-cta">
              <RotateCcw className="size-5" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-med-nav mb-1">Politique de retour Athlea Systems</p>
              <p className="text-muted-foreground leading-relaxed">
                Vous disposez de <strong>30 jours</strong> après réception pour retourner un produit non ouvert.
                Les produits défectueux ou non conformes sont remboursés sous <strong>5–10 jours ouvrés</strong> après validation.
                Pour les consommables médicaux, le retour n'est accepté que si l'emballage est intact.
              </p>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Toutes ({allRefunds.length})</TabsTrigger>
              <TabsTrigger value="pending">
                En attente
                {pending.length > 0 && (
                  <Badge className="ml-1.5 bg-med-alert text-primary-foreground hover:bg-med-alert text-xs px-1.5 py-0 h-4">
                    {pending.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="resolved">Traitées ({resolved.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {allRefunds.length === 0 ? (
                <EmptyState onNew={() => setShowModal(true)} />
              ) : (
                <div className="flex flex-col gap-4">
                  {allRefunds.map((r) => <RefundCard key={r.id} refund={r} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="size-12 text-med-available mb-3" />
                  <p className="font-medium text-med-nav">Aucune demande en attente</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pending.map((r) => <RefundCard key={r.id} refund={r} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="resolved">
              <div className="flex flex-col gap-4">
                {resolved.map((r) => <RefundCard key={r.id} refund={r} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {showModal && (
        <NewRefundModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewRefund}
        />
      )}
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Package className="size-14 text-muted-foreground/40 mb-4" />
      <h2 className="text-lg font-medium text-med-nav">Aucune demande de remboursement</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">
        Vous n'avez pas encore fait de demande de remboursement.
      </p>
      <Button className="mt-5 bg-med-cta hover:bg-med-hover text-primary-foreground gap-2" onClick={onNew}>
        <Plus className="size-4" />
        Faire une demande
      </Button>
    </div>
  );
}
