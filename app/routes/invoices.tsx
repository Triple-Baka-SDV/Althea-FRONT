import { useState, useEffect } from "react";
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
  Building2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchInvoicesByUser,
  fetchOrdersByClient,
  processPayment,
  type ApiFacture,
  type ApiOrder,
  type ApiPaiement,
} from "@/lib/api";
import { generateInvoicePDF } from "@/lib/invoice-pdf";
import {
  cardNumber as vCardNumber,
  cardExpiry as vCardExpiry,
  cardCvv as vCardCvv,
  cardHolder as vCardHolder,
  iban as vIban,
  required as vRequired,
  validate,
  hasErrors,
  type FieldErrors,
} from "@/lib/validators";

export const meta: MetaFunction = () => [
  { title: "Mes factures – Althea Systems" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  en_attente: { label: "À payer", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  a_payer: { label: "À payer", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  payée: { label: "Payée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  payee: { label: "Payée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  en_retard: { label: "En retard", color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertCircle },
  remboursee: { label: "Remboursée", color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", icon: RotateCcw },
  remboursée: { label: "Remboursée", color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", icon: RotateCcw },
};

function isPaid(statut: string | null) {
  return statut === "payée" || statut === "payee";
}

function isRefunded(statut: string | null) {
  return statut === "remboursee" || statut === "remboursée";
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "en_attente";
  const cfg = STATUS_CONFIG[s] ?? { label: s, color: "bg-muted text-muted-foreground border-border", icon: FileText };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

// Card UI helpers
function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

type Methode = "cb" | "virement" | "cheque";
type PayField = "cardNumber" | "cardHolder" | "expiry" | "cvv" | "bankingInfos";

function PaymentModal({
  invoice,
  onClose,
  onPaid,
}: {
  invoice: ApiFacture;
  onClose: () => void;
  onPaid: (id: number, paiement: ApiPaiement) => void;
}) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [methode, setMethode] = useState<Methode>("cb");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bankingInfos, setBankingInfos] = useState("");
  const [errors, setErrors] = useState<FieldErrors<PayField>>({});
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const montant = parseFloat(invoice.factures.montant ?? "0");

  const validateLocal = (): FieldErrors<PayField> => {
    if (methode === "cb") {
      return validate<PayField>({
        cardNumber: () => vCardNumber(cardNumber),
        cardHolder: () => vCardHolder(cardHolder),
        expiry: () => vCardExpiry(expiry),
        cvv: () => vCardCvv(cvv),
      });
    }
    if (methode === "virement") {
      return validate<PayField>({
        bankingInfos: () => vIban(bankingInfos),
      });
    }
    return validate<PayField>({
      bankingInfos: () => vRequired("La référence du chèque")(bankingInfos),
    });
  };

  const clear = (field: PayField) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  // Reset field-specific errors when payment method changes.
  useEffect(() => {
    setErrors({});
    setError(null);
  }, [methode]);

  const handlePay = async () => {
    setError(null);
    const next = validateLocal();
    setErrors(next);
    if (hasErrors(next)) return;
    setIsProcessing(true);
    try {
      const result = await processPayment({
        factureId: invoice.factures.id,
        methode,
        cardNumber: methode === "cb" ? cardNumber : undefined,
        cardHolder: methode === "cb" ? cardHolder : undefined,
        expiry: methode === "cb" ? expiry : undefined,
        cvv: methode === "cb" ? cvv : undefined,
        bankingInfos: methode !== "cb" ? bankingInfos : undefined,
      });
      setTransactionId(result.transactionId);
      onPaid(invoice.factures.id, result.paiement);
      setStep("success");
    } catch (e: any) {
      setError(e?.message ?? "Échec du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-med-nav">Payer la facture #{invoice.factures.id}</DialogTitle>
              <DialogDescription>
                Montant à régler : <strong>{montant.toFixed(2).replace(".", ",")} € TTC</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commande</span>
                  <span className="text-med-nav font-medium">
                    {invoice.factures.commandeRef
                      ? `#${invoice.factures.commandeRef.slice(0, 8)}`
                      : `#${invoice.factures.commandeId}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-med-nav">Total TTC</span>
                  <span className="text-med-nav">{montant.toFixed(2).replace(".", ",")} €</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs">Mode de paiement</Label>
                <RadioGroup
                  value={methode}
                  onValueChange={(v) => setMethode(v as Methode)}
                  className="grid grid-cols-3 gap-2"
                >
                  {[
                    { id: "cb", label: "Carte", icon: CreditCard },
                    { id: "virement", label: "Virement", icon: Building2 },
                    { id: "cheque", label: "Chèque", icon: FileText },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-xs ${
                          methode === m.id ? "border-med-cta bg-secondary/50" : "border-border"
                        }`}
                        onClick={() => setMethode(m.id as Methode)}
                      >
                        <RadioGroupItem value={m.id} id={`pm-${m.id}`} className="sr-only" />
                        <Icon className="size-3.5 text-med-cta" />
                        <Label htmlFor={`pm-${m.id}`} className="cursor-pointer flex-1">{m.label}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {methode === "cb" ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Numéro de carte</Label>
                    <Input
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(formatCardNumber(e.target.value));
                        clear("cardNumber");
                      }}
                      onBlur={() =>
                        setErrors((p) => ({ ...p, cardNumber: vCardNumber(cardNumber) ?? undefined }))
                      }
                      aria-invalid={!!errors.cardNumber}
                      inputMode="numeric"
                      autoComplete="cc-number"
                    />
                    {errors.cardNumber && (
                      <p className="text-xs text-destructive">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Titulaire</Label>
                    <Input
                      placeholder="Dr. Marie Dupont"
                      value={cardHolder}
                      onChange={(e) => {
                        setCardHolder(e.target.value);
                        clear("cardHolder");
                      }}
                      onBlur={() =>
                        setErrors((p) => ({ ...p, cardHolder: vCardHolder(cardHolder) ?? undefined }))
                      }
                      aria-invalid={!!errors.cardHolder}
                      autoComplete="cc-name"
                    />
                    {errors.cardHolder && (
                      <p className="text-xs text-destructive">{errors.cardHolder}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs">Expiration</Label>
                      <Input
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => {
                          setExpiry(formatExpiry(e.target.value));
                          clear("expiry");
                        }}
                        onBlur={() =>
                          setErrors((p) => ({ ...p, expiry: vCardExpiry(expiry) ?? undefined }))
                        }
                        aria-invalid={!!errors.expiry}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                      />
                      {errors.expiry && <p className="text-xs text-destructive">{errors.expiry}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs">CVV</Label>
                      <Input
                        placeholder="000"
                        type="password"
                        value={cvv}
                        onChange={(e) => {
                          setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                          clear("cvv");
                        }}
                        onBlur={() =>
                          setErrors((p) => ({ ...p, cvv: vCardCvv(cvv) ?? undefined }))
                        }
                        aria-invalid={!!errors.cvv}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                      />
                      {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              ) : methode === "virement" ? (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">IBAN</Label>
                  <Input
                    placeholder="FR76 0000 0000 0000 0000 0000 000"
                    value={bankingInfos}
                    onChange={(e) => {
                      setBankingInfos(e.target.value.toUpperCase());
                      clear("bankingInfos");
                    }}
                    onBlur={() =>
                      setErrors((p) => ({ ...p, bankingInfos: vIban(bankingInfos) ?? undefined }))
                    }
                    aria-invalid={!!errors.bankingInfos}
                  />
                  {errors.bankingInfos ? (
                    <p className="text-xs text-destructive">{errors.bankingInfos}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Délai de traitement : 1–2 jours ouvrés.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Référence du chèque</Label>
                  <Input
                    placeholder="N° de chèque"
                    value={bankingInfos}
                    onChange={(e) => {
                      setBankingInfos(e.target.value);
                      clear("bankingInfos");
                    }}
                    aria-invalid={!!errors.bankingInfos}
                  />
                  {errors.bankingInfos ? (
                    <p className="text-xs text-destructive">{errors.bankingInfos}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      À libeller à l'ordre de <strong>Althea Systems</strong>.
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
                  <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Paiement sécurisé SSL
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Annuler
              </Button>
              <Button
                className="bg-med-cta hover:bg-med-hover text-primary-foreground gap-2"
                onClick={handlePay}
                disabled={isProcessing}
              >
                <CreditCard className="size-4" />
                {isProcessing ? "Traitement…" : `Payer ${montant.toFixed(2).replace(".", ",")} €`}
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
                Votre paiement de <strong>{montant.toFixed(2).replace(".", ",")} €</strong> pour la facture{" "}
                <strong>#{invoice.factures.id}</strong> a bien été enregistré.
              </p>
              {transactionId && (
                <p className="text-xs text-muted-foreground font-mono break-all">
                  Transaction : {transactionId}
                </p>
              )}
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
  const { user, isLoading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState<ApiFacture[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState<ApiFacture | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetchInvoicesByUser(user.id).catch(() => []),
      fetchOrdersByClient(user.id).catch(() => []),
    ])
      .then(([invs, ords]) => {
        setInvoices(
          invs.sort(
            (a, b) =>
              new Date(b.factures.dateCreation).getTime() -
              new Date(a.factures.dateCreation).getTime()
          )
        );
        setOrders(ords);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleDownload = async (inv: ApiFacture) => {
    setDownloadingId(inv.factures.id);
    try {
      const ref = inv.factures.commandeRef;
      const lineItems = ref
        ? orders.filter((o) => o.orders.commandeRef === ref)
        : inv.factures.commandeId
        ? orders.filter((o) => o.orders.id === inv.factures.commandeId)
        : [];
      await generateInvoicePDF(inv, lineItems, user?.email);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePaid = (id: number, paiement: ApiPaiement) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.factures.id === id
          ? {
              ...inv,
              factures: { ...inv.factures, statut: "payée", paiementId: paiement.id },
              paiements: paiement,
            }
          : inv
      )
    );
  };

  const pending = invoices.filter(
    (i) => !isPaid(i.factures.statut) && !isRefunded(i.factures.statut),
  );
  const paid = invoices.filter((i) => isPaid(i.factures.statut));
  const refunded = invoices.filter((i) => isRefunded(i.factures.statut));
  const totalPending = pending.reduce((acc, i) => acc + parseFloat(i.factures.montant ?? "0"), 0);

  const InvoiceRow = ({ inv }: { inv: ApiFacture }) => {
    const statut = inv.factures.statut;
    const montant = parseFloat(inv.factures.montant ?? "0");
    const paye = isPaid(statut);
    const rembourse = isRefunded(statut);
    return (
      <div className="flex flex-wrap items-center gap-3 py-4 border-b border-border last:border-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <FileText className="size-5 text-med-cta" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-med-nav">#{inv.factures.id}</p>
              <StatusBadge status={statut} />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
              {inv.factures.commandeRef ? (
                <span>Commande : #{inv.factures.commandeRef.slice(0, 8)}</span>
              ) : inv.factures.commandeId ? (
                <span>Commande : #{inv.factures.commandeId}</span>
              ) : null}
              <span>·</span>
              <span>
                Émise le{" "}
                {new Date(inv.factures.dateCreation).toLocaleDateString("fr-FR")}
              </span>
              {paye && inv.paiements?.methode && (
                <>
                  <span>·</span>
                  <span className="capitalize">
                    {inv.paiements.methode === "cb"
                      ? `CB •••• ${inv.paiements.cardLast4 ?? ""}`
                      : inv.paiements.methode}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm font-bold text-med-nav">
              {montant.toFixed(2).replace(".", ",")} € TTC
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => handleDownload(inv)}
              disabled={downloadingId === inv.factures.id}
            >
              <Download className="size-3.5" />
              {downloadingId === inv.factures.id ? "..." : "PDF"}
            </Button>
            {!paye && !rembourse && (
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
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-med-cta">Accueil</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-med-nav font-medium">Mes factures</span>
          </nav>

          <h1 className="text-2xl font-semibold text-med-nav mb-8">Gestion des factures</h1>

          {loading || authLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">Chargement…</p>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">Connectez-vous pour voir vos factures.</p>
              <Link to="/login" className="mt-4">
                <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground">Se connecter</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="rounded-xl border border-border bg-background p-5">
                  <p className="text-sm text-muted-foreground mb-1">Total à régler</p>
                  <p className="text-2xl font-bold text-destructive">
                    {totalPending.toFixed(2).replace(".", ",")} € TTC
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pending.length} facture{pending.length !== 1 ? "s" : ""} en attente
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-5">
                  <p className="text-sm text-muted-foreground mb-1">Factures payées</p>
                  <p className="text-2xl font-bold text-med-available">{paid.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paid.reduce((acc, i) => acc + parseFloat(i.factures.montant ?? "0"), 0).toFixed(2).replace(".", ",")} € TTC réglé
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-5">
                  <p className="text-sm text-muted-foreground mb-1">En retard</p>
                  <p className="text-2xl font-bold text-med-alert">
                    {invoices.filter((i) => i.factures.statut === "en_retard").length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Nécessite une action immédiate</p>
                </div>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Toutes ({invoices.length})</TabsTrigger>
                  <TabsTrigger value="pending">À payer ({pending.length})</TabsTrigger>
                  <TabsTrigger value="paid">Payées ({paid.length})</TabsTrigger>
                  <TabsTrigger value="refunded">Remboursées ({refunded.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {invoices.length === 0 ? (
                    <p className="text-center py-16 text-muted-foreground">Aucune facture</p>
                  ) : (
                    <div className="rounded-xl border border-border bg-background px-5">
                      {invoices.map((inv) => <InvoiceRow key={inv.factures.id} inv={inv} />)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pending">
                  {pending.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <CheckCircle2 className="size-12 text-med-available mb-3" />
                      <p className="font-medium text-med-nav">Toutes vos factures sont réglées !</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border bg-background px-5">
                      {pending.map((inv) => <InvoiceRow key={inv.factures.id} inv={inv} />)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="paid">
                  {paid.length === 0 ? (
                    <p className="text-center py-16 text-muted-foreground">Aucune facture payée</p>
                  ) : (
                    <div className="rounded-xl border border-border bg-background px-5">
                      {paid.map((inv) => <InvoiceRow key={inv.factures.id} inv={inv} />)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="refunded">
                  {refunded.length === 0 ? (
                    <p className="text-center py-16 text-muted-foreground">Aucune facture remboursée</p>
                  ) : (
                    <div className="rounded-xl border border-border bg-background px-5">
                      {refunded.map((inv) => <InvoiceRow key={inv.factures.id} inv={inv} />)}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />

      {payingInvoice && (
        <PaymentModal
          invoice={payingInvoice}
          onClose={() => setPayingInvoice(null)}
          onPaid={(id, paiement) => {
            handlePaid(id, paiement);
            setPayingInvoice(null);
          }}
        />
      )}
    </div>
  );
}
