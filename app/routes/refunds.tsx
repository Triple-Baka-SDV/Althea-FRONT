import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import {
  fetchAvoirsByClient,
  fetchOrdersByClient,
  requestRefundForInvoice,
  fetchInvoicesByUser,
  type ApiAvoir,
  type ApiOrder,
  type ApiFacture,
} from "@/lib/api";
import {
  required as vRequired,
  minLength as vMinLength,
  maxLength as vMaxLength,
  runAll,
  validate,
  hasErrors,
  type FieldErrors,
} from "@/lib/validators";
import { AlertCircle } from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Remboursements – Althea Systems" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  en_cours_de_remboursement: { label: "En attente", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  remboursé: { label: "Approuvée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  refusé: { label: "Refusée", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
};

const REFUND_REASONS = [
  { value: "produit_defectueux", label: "Produit défectueux" },
  { value: "produit_non_conforme", label: "Produit non conforme à la description" },
  { value: "erreur_commande", label: "Erreur de commande" },
  { value: "produit_endommage", label: "Produit endommagé à la livraison" },
  { value: "delai_depasse", label: "Délai de livraison dépassé" },
  { value: "autre", label: "Autre motif" },
];

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "en_cours_de_remboursement";
  const cfg = STATUS_CONFIG[s] ?? { label: s, color: "bg-muted text-muted-foreground border-border", icon: RotateCcw };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

type RefundField = "invoiceId" | "reason" | "description";

function NewRefundModal({
  invoices,
  onClose,
  onSubmit,
}: {
  invoices: ApiFacture[];
  onClose: () => void;
  onSubmit: (avoir: ApiAvoir) => void;
}) {
  const [invoiceId, setInvoiceId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FieldErrors<RefundField>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): FieldErrors<RefundField> =>
    validate<RefundField>({
      invoiceId: () => vRequired("La facture")(invoiceId),
      reason: () => vRequired("Le motif")(reason),
      description: () =>
        runAll(
          vRequired("La description")(description),
          vMinLength(20, "La description")(description),
          vMaxLength(1000, "La description")(description),
        ),
    });

  const handleSubmit = async () => {
    setServerError(null);
    const next = validateForm();
    setErrors(next);
    if (hasErrors(next)) return;
    setIsSubmitting(true);
    try {
      const avoir = await requestRefundForInvoice(Number(invoiceId), {
        motif: reason,
        description: description.trim(),
      });
      setSubmitted(true);
      onSubmit(avoir);
    } catch (e: any) {
      setServerError(e?.message ?? "Échec de la demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clear = (field: RefundField) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
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
              {serverError && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
                  <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Facture concernée *</Label>
                {invoices.length === 0 ? (
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    Aucune facture éligible. Toutes vos factures ont déjà fait l'objet d'une demande de remboursement.
                  </div>
                ) : (
                  <Select
                    value={invoiceId}
                    onValueChange={(v) => {
                      setInvoiceId(v);
                      clear("invoiceId");
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.invoiceId}>
                      <SelectValue placeholder="Sélectionnez une facture" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoices.map((inv) => (
                        <SelectItem key={inv.factures.id} value={String(inv.factures.id)}>
                          #{inv.factures.id} —{" "}
                          {new Date(inv.factures.dateCreation).toLocaleDateString("fr-FR")} (
                          {parseFloat(inv.factures.montant ?? "0").toFixed(2).replace(".", ",")} € TTC)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.invoiceId && (
                  <p className="text-xs text-destructive">{errors.invoiceId}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Motif de remboursement *</Label>
                <Select
                  value={reason}
                  onValueChange={(v) => {
                    setReason(v);
                    clear("reason");
                  }}
                >
                  <SelectTrigger aria-invalid={!!errors.reason}>
                    <SelectValue placeholder="Choisissez un motif" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFUND_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Description détaillée *</Label>
                <Textarea
                  placeholder="Décrivez précisément le problème rencontré (minimum 20 caractères)…"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    clear("description");
                  }}
                  className="min-h-28 resize-none"
                  maxLength={1000}
                  aria-invalid={!!errors.description}
                />
                <div className="flex justify-between items-center">
                  {errors.description ? (
                    <p className="text-xs text-destructive">{errors.description}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Minimum 20 caractères.</p>
                  )}
                  <p className="text-xs text-muted-foreground">{description.length} / 1000</p>
                </div>
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
                disabled={isSubmitting || invoices.length === 0}
              >
                {isSubmitting ? "Envoi…" : "Soumettre la demande"}
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

function parseDescription(infos: string | null): string | null {
  if (!infos) return null;
  try {
    const parsed = JSON.parse(infos);
    return typeof parsed?.description === "string" && parsed.description.length > 0
      ? parsed.description
      : null;
  } catch {
    return null;
  }
}

function RefundCard({ avoir }: { avoir: ApiAvoir }) {
  const montant = parseFloat(avoir.montant ?? "0");
  const reason = REFUND_REASONS.find((r) => avoir.motif?.includes(r.value))?.label ?? avoir.motif ?? "Demande d'avoir";
  const description = parseDescription(avoir.infosSupprimees);

  return (
    <div className="rounded-xl border border-border bg-background p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <span className="text-sm font-semibold text-med-nav">#{avoir.id}</span>
            <StatusBadge status={avoir.statut} />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {avoir.idSupprime && <span>Facture #{avoir.idSupprime}</span>}
            <span>·</span>
            <span>
              Demandé le{" "}
              {new Date(avoir.dateCreation).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-med-nav">
            {montant.toFixed(2).replace(".", ",")} €
          </p>
          <p className="text-xs text-muted-foreground">Montant demandé</p>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Motif</p>
        <p className="text-sm text-med-nav">{reason}</p>
      </div>

      {description && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Description</p>
          <p className="text-sm text-med-nav whitespace-pre-line">{description}</p>
        </div>
      )}

      {avoir.statut === "remboursé" && (
        <div className="rounded-lg border border-med-available/30 bg-med-available/5 p-3 text-sm text-med-available">
          <p className="font-medium">Remboursement approuvé</p>
          <p className="text-xs mt-0.5">
            Le remboursement de {montant.toFixed(2).replace(".", ",")} € sera traité sous 5–10 jours ouvrés.
          </p>
        </div>
      )}
      {avoir.statut === "refusé" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <p className="font-medium">Demande refusée</p>
          <p className="text-xs mt-0.5">
            Votre demande n'a pas pu être acceptée. Contactez notre service client pour plus d'informations.
          </p>
        </div>
      )}
    </div>
  );
}

export default function RemboursementsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [avoirs, setAvoirs] = useState<ApiAvoir[]>([]);
  const [invoices, setInvoices] = useState<ApiFacture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetchAvoirsByClient(user.id).catch(() => [] as ApiAvoir[]),
      fetchInvoicesByUser(user.id).catch(() => [] as ApiFacture[]),
    ])
      .then(([avoirsData, invoicesData]) => {
        setAvoirs(avoirsData);
        setInvoices(invoicesData);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleNewRefund = (avoir: ApiAvoir) => {
    setAvoirs((prev) => [avoir, ...prev]);
    setShowModal(false);
  };

  const pending = avoirs.filter((a) => a.statut === "en_cours_de_remboursement");
  const resolved = avoirs.filter((a) => a.statut !== "en_cours_de_remboursement");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-med-cta">Accueil</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-med-nav font-medium">Remboursements</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-med-nav">Remboursements & retours</h1>
            {user && (
              <Button
                className="bg-med-cta hover:bg-med-hover text-primary-foreground gap-2"
                onClick={() => setShowModal(true)}
              >
                <Plus className="size-4" />
                Nouvelle demande
              </Button>
            )}
          </div>

          <div className="mb-6 rounded-xl border border-border bg-background p-5 flex gap-4">
            <div className="size-10 shrink-0 rounded-full bg-secondary flex items-center justify-center text-med-cta">
              <RotateCcw className="size-5" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-med-nav mb-1">Politique de retour Althea Systems</p>
              <p className="text-muted-foreground leading-relaxed">
                Vous disposez de <strong>30 jours</strong> après réception pour retourner un produit non ouvert.
                Les produits défectueux ou non conformes sont remboursés sous <strong>5–10 jours ouvrés</strong> après validation.
              </p>
            </div>
          </div>

          {loading || authLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">Chargement…</p>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">Connectez-vous pour voir vos remboursements.</p>
              <Link to="/login" className="mt-4">
                <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground">Se connecter</Button>
              </Link>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Tous ({avoirs.length})</TabsTrigger>
                <TabsTrigger value="pending">
                  En attente
                  {pending.length > 0 && (
                    <Badge className="ml-1.5 bg-med-alert text-primary-foreground hover:bg-med-alert text-xs px-1.5 py-0 h-4">
                      {pending.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="resolved">Traités ({resolved.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {avoirs.length === 0 ? (
                  <EmptyState onNew={() => setShowModal(true)} />
                ) : (
                  <div className="flex flex-col gap-4">
                    {avoirs.map((a) => <RefundCard key={a.id} avoir={a} />)}
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
                    {pending.map((a) => <RefundCard key={a.id} avoir={a} />)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resolved">
                <div className="flex flex-col gap-4">
                  {resolved.map((a) => <RefundCard key={a.id} avoir={a} />)}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />

      {showModal && user && (
        <NewRefundModal
          invoices={invoices.filter(
            (inv) => !avoirs.some((a) => a.idSupprime === inv.factures.id),
          )}
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
