import { useState } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import {
  ChevronRight,
  FileText,
  Download,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import data from "@/data/data.json";

export const meta: MetaFunction = () => [
  { title: "Mes factures – Athlea Systems" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  a_payer: { label: "À payer", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  payee: { label: "Payée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  en_retard: { label: "En retard", color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertCircle },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: FileText };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

function PaymentModal({ invoice, onClose, onPaid }: {
  invoice: (typeof data.invoices)[0];
  onClose: () => void;
  onPaid: (id: string) => void;
}) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);
    setStep("success");
    onPaid(invoice.id);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-med-nav">Payer la facture {invoice.id}</DialogTitle>
              <DialogDescription>
                Montant à régler : <strong>{invoice.total.toFixed(2).replace(".", ",")} € TTC</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commande</span>
                  <span className="text-med-nav font-medium">{invoice.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant HT</span>
                  <span className="text-med-nav">{invoice.subtotal.toFixed(2).replace(".", ",")} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA</span>
                  <span className="text-med-nav">{invoice.tva.toFixed(2).replace(".", ",")} €</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-med-nav">Total TTC</span>
                  <span className="text-med-nav">{invoice.total.toFixed(2).replace(".", ",")} €</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Numéro de carte</Label>
                    <Input placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Titulaire</Label>
                    <Input placeholder="Dr. Marie Dupont" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Expiration</Label>
                    <Input placeholder="MM / AA" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">CVV</Label>
                    <Input placeholder="000" type="password" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                🔒 Paiement sécurisé SSL · Données non transmises
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button
                className="bg-med-cta hover:bg-med-hover text-primary-foreground gap-2"
                onClick={handlePay}
                disabled={isProcessing}
              >
                <CreditCard className="size-4" />
                {isProcessing ? "Traitement…" : `Payer ${invoice.total.toFixed(2).replace(".", ",")} €`}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-med-nav">Paiement confirmé</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-6 gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-med-available/10">
                <CheckCircle2 className="size-8 text-med-available" />
              </div>
              <p className="text-sm text-muted-foreground">
                Votre paiement de <strong>{invoice.total.toFixed(2).replace(".", ",")} € TTC</strong> pour la facture{" "}
                <strong>{invoice.id}</strong> a bien été enregistré.
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

export default function FacturesPage() {
  const [payingInvoice, setPayingInvoice] = useState<(typeof data.invoices)[0] | null>(null);
  const [paidIds, setPaidIds] = useState<string[]>([]);

  const getStatus = (invoice: (typeof data.invoices)[0]) => {
    if (paidIds.includes(invoice.id)) return "payee";
    return invoice.status;
  };

  const invoices = [...data.invoices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const pending = invoices.filter((i) => getStatus(i) !== "payee");
  const paid = invoices.filter((i) => getStatus(i) === "payee");

  const totalPending = pending.reduce((acc, i) => acc + i.total, 0);

  const InvoiceRow = ({ inv }: { inv: (typeof data.invoices)[0] }) => {
    const status = getStatus(inv);
    const isPaid = status === "payee";
    return (
      <div className="flex flex-wrap items-center gap-3 py-4 border-b border-border last:border-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <FileText className="size-5 text-med-cta" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-med-nav">{inv.id}</p>
              <StatusBadge status={status} />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
              <span>Commande : {inv.orderId}</span>
              <span>·</span>
              <span>Émise le {new Date(inv.date).toLocaleDateString("fr-FR")}</span>
              {!isPaid && <><span>·</span><span>Échéance : {new Date(inv.dueDate).toLocaleDateString("fr-FR")}</span></>}
              {isPaid && inv.paidAt && <><span>·</span><span>Payée le {new Date(inv.paidAt).toLocaleDateString("fr-FR")}</span></>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm font-bold text-med-nav">{inv.total.toFixed(2).replace(".", ",")} € TTC</p>
            <p className="text-xs text-muted-foreground">{inv.subtotal.toFixed(2).replace(".", ",")} € HT</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Download className="size-3.5" />
              PDF
            </Button>
            {!isPaid && (
              <Button
                size="sm"
                className="bg-med-cta hover:bg-med-hover text-primary-foreground gap-1.5 text-xs"
                onClick={() => setPayingInvoice(inv)}
              >
                <CreditCard className="size-3.5" />
                Payer
              </Button>
            )}
          </div>
        </div>
      </div>
    );
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
            <span className="text-med-nav font-medium">Mes factures</span>
          </nav>

          <h1 className="text-2xl font-semibold text-med-nav mb-8">Gestion des factures</h1>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground mb-1">Total à régler</p>
              <p className="text-2xl font-bold text-destructive">
                {totalPending.toFixed(2).replace(".", ",")} € TTC
              </p>
              <p className="text-xs text-muted-foreground mt-1">{pending.length} facture{pending.length !== 1 ? "s" : ""} en attente</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground mb-1">Factures payées</p>
              <p className="text-2xl font-bold text-med-available">{paid.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {paid.reduce((acc, i) => acc + i.total, 0).toFixed(2).replace(".", ",")} € TTC réglé
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground mb-1">En retard</p>
              <p className="text-2xl font-bold text-med-alert">
                {invoices.filter((i) => getStatus(i) === "en_retard").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Nécessite une action immédiate</p>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Toutes ({invoices.length})</TabsTrigger>
              <TabsTrigger value="pending">À payer ({pending.length})</TabsTrigger>
              <TabsTrigger value="paid">Payées ({paid.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-xl border border-border bg-background px-5">
                {invoices.map((inv) => <InvoiceRow key={inv.id} inv={inv} />)}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="size-12 text-med-available mb-3" />
                  <p className="font-medium text-med-nav">Toutes vos factures sont réglées !</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-background px-5">
                  {pending.map((inv) => <InvoiceRow key={inv.id} inv={inv} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="paid">
              <div className="rounded-xl border border-border bg-background px-5">
                {paid.map((inv) => <InvoiceRow key={inv.id} inv={inv} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {payingInvoice && (
        <PaymentModal
          invoice={payingInvoice}
          onClose={() => setPayingInvoice(null)}
          onPaid={(id) => {
            setPaidIds((prev) => [...prev, id]);
            setPayingInvoice(null);
          }}
        />
      )}
    </div>
  );
}
