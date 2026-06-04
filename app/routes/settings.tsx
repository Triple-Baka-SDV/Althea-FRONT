import { useState, useEffect, useRef } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import {
  User,
  MapPin,
  Building2,
  Bell,
  Shield,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Stethoscope,
  IdCard,
  Save,
  X,
  Monitor,
  Smartphone,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth-client";
import {
  fetchAddressesByUser,
  createAdresse,
  updateAdresse,
  deleteAdresse,
  updateUserName,
  changeUserPassword,
  type ApiAdresse,
} from "@/lib/api";
import {
  name as vName,
  required as vRequired,
  phoneFR as vPhoneFR,
  rpps as vRpps,
  postalCodeFR as vPostalCodeFR,
  siret as vSiret,
  tvaIntraFR as vTvaIntraFR,
  password as vPassword,
  matches as vMatches,
  validate,
  hasErrors,
  type FieldErrors,
} from "@/lib/validators";

export const meta: MetaFunction = () => [
  { title: "Paramètres – Althea Systems" },
];

// ─── Shared UI helpers ───────────────────────────────────────────────────────

function Alert({ kind, message }: { kind: "success" | "error"; message: string }) {
  const isOk = kind === "success";
  const Icon = isOk ? CheckCircle2 : AlertCircle;
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
        isOk
          ? "border-med-available/30 bg-med-available/10 text-med-available"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      }`}
    >
      <Icon className="size-4 mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <CardHeader>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="size-9 shrink-0 rounded-lg bg-secondary text-med-cta flex items-center justify-center">
            <Icon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-base text-med-nav">{title}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
        </div>
        {action}
      </div>
    </CardHeader>
  );
}

function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-med-nav">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function PrimaryButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={`bg-med-cta hover:bg-med-hover text-primary-foreground gap-2 ${props.className ?? ""}`}
    />
  );
}

// ─── Profile tab ─────────────────────────────────────────────────────────────

interface LocalProfile {
  phone: string;
  rpps: string;
  specialty: string;
}

type ProfileField = "name" | "phone" | "rpps";

function ProfileTab() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [local, setLocal] = useState<LocalProfile>({ phone: "", rpps: "", specialty: "" });
  const [errors, setErrors] = useState<FieldErrors<ProfileField>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    const stored = typeof window !== "undefined" ? localStorage.getItem(`profile:${user.id}`) : null;
    if (stored) {
      try {
        setLocal(JSON.parse(stored));
      } catch {}
    }
  }, [user]);

  const validateForm = (): FieldErrors<ProfileField> =>
    validate<ProfileField>({
      name: () => vName(name),
      phone: () => vPhoneFR(local.phone),
      rpps: () => vRpps(local.rpps),
    });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const next = validateForm();
    setErrors(next);
    if (hasErrors(next)) return;
    setStatus(null);
    setSaving(true);
    try {
      if (name.trim() && name.trim() !== user.name) {
        await updateUserName(name.trim());
      }
      localStorage.setItem(`profile:${user.id}`, JSON.stringify(local));
      setStatus({ kind: "success", message: "Profil mis à jour avec succès" });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Impossible de mettre à jour le profil",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <Card>
        <SectionHeader
          icon={User}
          title="Informations personnelles"
          description="Affichées sur vos commandes et factures."
        />
        <CardContent className="flex flex-col gap-5">
          {status && <Alert kind={status.kind} message={status.message} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="name" label="Nom et prénom" error={errors.name}>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                onBlur={() => setErrors((p) => ({ ...p, name: vName(name) ?? undefined }))}
                aria-invalid={!!errors.name}
                placeholder="Dr. Marie Curie"
              />
            </FormField>
            <FormField id="email" label="Adresse e-mail" hint="Contactez le support pour modifier votre e-mail.">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="pl-9 cursor-not-allowed"
                />
              </div>
            </FormField>
            <FormField id="phone" label="Téléphone" error={errors.phone}>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-9"
                  value={local.phone}
                  onChange={(e) => {
                    setLocal((p) => ({ ...p, phone: e.target.value }));
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  onBlur={() =>
                    setErrors((p) => ({ ...p, phone: vPhoneFR(local.phone) ?? undefined }))
                  }
                  aria-invalid={!!errors.phone}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </FormField>
            <FormField id="specialty" label="Spécialité médicale">
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="specialty"
                  className="pl-9"
                  value={local.specialty}
                  onChange={(e) => setLocal((p) => ({ ...p, specialty: e.target.value }))}
                  placeholder="Cardiologie"
                  maxLength={80}
                />
              </div>
            </FormField>
          </div>

          <FormField
            id="rpps"
            label="Numéro RPPS"
            hint="Répertoire Partagé des Professionnels intervenant dans le système de Santé"
            error={errors.rpps}
          >
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="rpps"
                className="pl-9"
                value={local.rpps}
                onChange={(e) => {
                  setLocal((p) => ({ ...p, rpps: e.target.value.replace(/\D/g, "") }));
                  if (errors.rpps) setErrors((p) => ({ ...p, rpps: undefined }));
                }}
                onBlur={() => setErrors((p) => ({ ...p, rpps: vRpps(local.rpps) ?? undefined }))}
                aria-invalid={!!errors.rpps}
                placeholder="11 chiffres"
                maxLength={11}
                inputMode="numeric"
              />
            </div>
          </FormField>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Le nom est synchronisé avec votre compte ; les autres champs restent sur cet appareil.
            </p>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Enregistrer
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Addresses tab ───────────────────────────────────────────────────────────

const emptyAddr = { name: "", adress: "", complementary: "", city: "", country: "" };
type AddrField = "adress" | "city" | "country";

function AddressesTab() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<ApiAdresse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyAddr);
  const [errors, setErrors] = useState<FieldErrors<AddrField>>({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchAddressesByUser(user.id)
      .then((all) => setAddresses(all.filter((a) => a.origin !== "billing")))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [user]);

  const announce = (kind: "success" | "error", message: string) => {
    setStatus({ kind, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const startEdit = (a: ApiAdresse) => {
    setForm({
      name: a.name ?? "",
      adress: a.adress ?? "",
      complementary: a.complementary ?? "",
      city: a.city ?? "",
      country: a.country ?? "",
    });
    setErrors({});
    setEditing(a.id);
  };

  const startNew = () => {
    setForm(emptyAddr);
    setErrors({});
    setEditing("new");
  };

  const cancel = () => {
    setEditing(null);
    setErrors({});
    setForm(emptyAddr);
  };

  const validateAddress = (): FieldErrors<AddrField> =>
    validate<AddrField>({
      adress: () => vRequired("L'adresse")(form.adress),
      city: () => vRequired("La ville")(form.city),
      country: () => vRequired("Le pays")(form.country),
    });

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette adresse ?")) return;
    try {
      await deleteAdresse(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      announce("success", "Adresse supprimée");
    } catch {
      announce("error", "Impossible de supprimer l'adresse");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const next = validateAddress();
    setErrors(next);
    if (hasErrors(next)) return;
    setBusy(true);
    try {
      if (editing === "new") {
        const created = await createAdresse({
          ...form,
          userId: user.id,
          origin: "shipping",
          region: null,
        });
        setAddresses((prev) => [...prev, created]);
        announce("success", "Adresse ajoutée");
      } else if (typeof editing === "number") {
        const updated = await updateAdresse(editing, form);
        setAddresses((prev) => prev.map((a) => (a.id === editing ? updated : a)));
        announce("success", "Adresse mise à jour");
      }
      cancel();
    } catch {
      announce("error", "Échec de l'enregistrement");
    } finally {
      setBusy(false);
    }
  };

  const setField = (key: keyof typeof emptyAddr, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (key in errors && errors[key as AddrField]) {
      setErrors((p) => ({ ...p, [key]: undefined }));
    }
  };

  const AddressForm = (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-med-cta/30 bg-secondary/30 p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-med-nav">
          {editing === "new" ? "Nouvelle adresse" : "Modifier l'adresse"}
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={cancel} className="size-7 p-0">
          <X className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Libellé">
          <Input
            placeholder="Cabinet principal"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            maxLength={80}
          />
        </FormField>
        <FormField label="Adresse *" error={errors.adress}>
          <Input
            placeholder="12 rue de la Paix"
            value={form.adress}
            onChange={(e) => setField("adress", e.target.value)}
            aria-invalid={!!errors.adress}
            maxLength={200}
          />
        </FormField>
        <FormField label="Complément">
          <Input
            placeholder="Bâtiment B, 2e étage"
            value={form.complementary}
            onChange={(e) => setField("complementary", e.target.value)}
            maxLength={200}
          />
        </FormField>
        <FormField label="Ville *" error={errors.city}>
          <Input
            placeholder="Paris"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            aria-invalid={!!errors.city}
            maxLength={80}
          />
        </FormField>
        <FormField label="Pays *" error={errors.country}>
          <Input
            placeholder="France"
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
            aria-invalid={!!errors.country}
            maxLength={80}
          />
        </FormField>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={cancel}>
          Annuler
        </Button>
        <PrimaryButton type="submit" size="sm" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Enregistrer
        </PrimaryButton>
      </div>
    </form>
  );

  return (
    <Card>
      <SectionHeader
        icon={MapPin}
        title="Adresses de livraison"
        description="Gérez les adresses utilisées lors de la commande."
        action={
          editing === null && (
            <PrimaryButton size="sm" onClick={startNew}>
              <Plus className="size-4" />
              Ajouter
            </PrimaryButton>
          )
        }
      />
      <CardContent className="flex flex-col gap-3">
        {status && <Alert kind={status.kind} message={status.message} />}

        {editing !== null && AddressForm}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="size-4 animate-spin" />
            Chargement des adresses…
          </div>
        ) : addresses.length === 0 && editing === null ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="size-12 rounded-full bg-secondary text-med-cta flex items-center justify-center">
              <MapPin className="size-5" />
            </div>
            <p className="text-sm font-medium text-med-nav">Aucune adresse enregistrée</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Ajoutez une adresse pour accélérer le règlement de vos commandes.
            </p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-med-cta/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="size-9 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-med-cta">
                  <MapPin className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-med-nav">
                    {addr.name?.trim() || `Adresse ${addr.id}`}
                  </p>
                  {addr.adress && <p className="text-sm text-muted-foreground">{addr.adress}</p>}
                  {addr.complementary && (
                    <p className="text-sm text-muted-foreground">{addr.complementary}</p>
                  )}
                  {(addr.city || addr.country) && (
                    <p className="text-sm text-muted-foreground">
                      {[addr.city, addr.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => startEdit(addr)}>
                  <Pencil className="size-3.5" />
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(addr.id)}
                >
                  <Trash2 className="size-3.5" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// ─── Billing tab ─────────────────────────────────────────────────────────────

interface BillingLocal {
  companyName: string;
  siret: string;
  tvaIntra: string;
}

type BillingField = "siret" | "tvaIntra" | "billingAddress";

function BillingTab() {
  const { user } = useAuth();
  const [local, setLocal] = useState<BillingLocal>({ companyName: "", siret: "", tvaIntra: "" });
  const [billingAddrId, setBillingAddrId] = useState<number | null>(null);
  const [addressText, setAddressText] = useState("");
  const [errors, setErrors] = useState<FieldErrors<BillingField>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const stored = typeof window !== "undefined" ? localStorage.getItem(`billing:${user.id}`) : null;
    if (stored) {
      try {
        setLocal(JSON.parse(stored));
      } catch {}
    }
    fetchAddressesByUser(user.id)
      .then((all) => {
        const billing = all.find((a) => a.origin === "billing");
        if (billing) {
          setBillingAddrId(billing.id);
          setAddressText(
            [billing.adress, billing.complementary, billing.city, billing.country]
              .filter(Boolean)
              .join("\n")
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const announce = (kind: "success" | "error", message: string) => {
    setStatus({ kind, message });
    setTimeout(() => setStatus(null), 4000);
  };

  const validateBilling = (): FieldErrors<BillingField> => {
    const firstLine = addressText.split("\n").map((l) => l.trim())[0] ?? "";
    return validate<BillingField>({
      siret: () => vSiret(local.siret),
      tvaIntra: () => vTvaIntraFR(local.tvaIntra),
      billingAddress: () =>
        addressText.trim() && !firstLine ? "La première ligne (rue) ne peut pas être vide" : null,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const next = validateBilling();
    setErrors(next);
    if (hasErrors(next)) return;
    setSaving(true);
    try {
      localStorage.setItem(`billing:${user.id}`, JSON.stringify(local));
      const [adress = "", complementary = "", city = "", country = ""] = addressText
        .split("\n")
        .map((l) => l.trim());
      const payload = {
        name: local.companyName || "Facturation",
        adress,
        complementary,
        city,
        country,
        origin: "billing" as const,
        region: null,
      };
      if (billingAddrId) {
        await updateAdresse(billingAddrId, payload);
      } else if (adress) {
        const created = await createAdresse({ ...payload, userId: user.id });
        setBillingAddrId(created.id);
      }
      announce("success", "Informations de facturation enregistrées");
    } catch {
      announce("error", "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <Card>
        <SectionHeader
          icon={Building2}
          title="Informations de facturation"
          description="Apparaissent sur toutes vos factures Althea Systems."
        />
        <CardContent className="flex flex-col gap-5">
          {status && <Alert kind={status.kind} message={status.message} />}
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Chargement…
            </div>
          ) : (
            <>
              <FormField id="companyName" label="Raison sociale / Cabinet">
                <Input
                  id="companyName"
                  value={local.companyName}
                  onChange={(e) => setLocal((p) => ({ ...p, companyName: e.target.value }))}
                  placeholder="Cabinet du Dr. Curie"
                  maxLength={120}
                />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="siret"
                  label="SIRET"
                  error={errors.siret}
                  hint="14 chiffres, validés par la clé de Luhn."
                >
                  <Input
                    id="siret"
                    value={local.siret}
                    onChange={(e) => {
                      setLocal((p) => ({ ...p, siret: e.target.value.replace(/\D/g, "") }));
                      if (errors.siret) setErrors((p) => ({ ...p, siret: undefined }));
                    }}
                    onBlur={() =>
                      setErrors((p) => ({ ...p, siret: vSiret(local.siret) ?? undefined }))
                    }
                    aria-invalid={!!errors.siret}
                    placeholder="00000000000000"
                    inputMode="numeric"
                    maxLength={14}
                  />
                </FormField>
                <FormField
                  id="tvaIntra"
                  label="N° TVA intracommunautaire"
                  error={errors.tvaIntra}
                  hint="Format : FR + 2 caractères + 9 chiffres."
                >
                  <Input
                    id="tvaIntra"
                    value={local.tvaIntra}
                    onChange={(e) => {
                      setLocal((p) => ({ ...p, tvaIntra: e.target.value.toUpperCase() }));
                      if (errors.tvaIntra) setErrors((p) => ({ ...p, tvaIntra: undefined }));
                    }}
                    onBlur={() =>
                      setErrors((p) => ({
                        ...p,
                        tvaIntra: vTvaIntraFR(local.tvaIntra) ?? undefined,
                      }))
                    }
                    aria-invalid={!!errors.tvaIntra}
                    placeholder="FR00000000000"
                    maxLength={13}
                  />
                </FormField>
              </div>
              <FormField
                id="billingAddress"
                label="Adresse de facturation"
                hint="Une ligne par champ : adresse, complément, ville, pays."
                error={errors.billingAddress}
              >
                <Textarea
                  id="billingAddress"
                  value={addressText}
                  onChange={(e) => {
                    setAddressText(e.target.value);
                    if (errors.billingAddress)
                      setErrors((p) => ({ ...p, billingAddress: undefined }));
                  }}
                  aria-invalid={!!errors.billingAddress}
                  className="resize-none"
                  rows={4}
                  placeholder={"12 rue de la Paix\nBâtiment B\n75002 Paris\nFrance"}
                />
              </FormField>
              <div className="flex justify-end">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Enregistrer
                </PrimaryButton>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <SectionHeader
          icon={IdCard}
          title="Documents fiscaux"
          description="Récapitulatifs comptables annuels."
        />
        <CardContent className="flex flex-col gap-3">
          {["2025", "2024"].map((year) => (
            <div
              key={year}
              className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-med-cta/40 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-med-nav">Récapitulatif achats {year}</p>
                <p className="text-xs text-muted-foreground">Toutes commandes et factures {year}</p>
              </div>
              <Button variant="outline" size="sm" type="button">
                Télécharger PDF
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Notifications tab ───────────────────────────────────────────────────────

type NotifKey =
  | "orderConfirmed"
  | "orderShipped"
  | "orderDelivered"
  | "invoiceDue"
  | "invoiceOverdue"
  | "refundUpdated"
  | "newProducts"
  | "promotions"
  | "newsletter";

const NOTIF_DEFAULTS: Record<NotifKey, boolean> = {
  orderConfirmed: true,
  orderShipped: true,
  orderDelivered: true,
  invoiceDue: true,
  invoiceOverdue: true,
  refundUpdated: true,
  newProducts: false,
  promotions: false,
  newsletter: false,
};

function NotificationsTab() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Record<NotifKey, boolean>>(NOTIF_DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const dirty = useRef(false);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`notifs:${user.id}`);
    if (stored) {
      try {
        setPrefs({ ...NOTIF_DEFAULTS, ...JSON.parse(stored) });
      } catch {}
    }
  }, [user]);

  const toggle = (key: NotifKey) => {
    dirty.current = true;
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    try {
      localStorage.setItem(`notifs:${user.id}`, JSON.stringify(prefs));
      setStatus({ kind: "success", message: "Préférences enregistrées" });
      dirty.current = false;
    } catch {
      setStatus({ kind: "error", message: "Erreur lors de l'enregistrement" });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const sections: { title: string; items: { key: NotifKey; label: string; desc: string }[] }[] = [
    {
      title: "Commandes",
      items: [
        { key: "orderConfirmed", label: "Confirmation de commande", desc: "À chaque nouvelle commande" },
        { key: "orderShipped", label: "Expédition", desc: "Lorsque votre commande est expédiée" },
        { key: "orderDelivered", label: "Livraison", desc: "Confirmation de livraison" },
      ],
    },
    {
      title: "Factures",
      items: [
        { key: "invoiceDue", label: "Rappel d'échéance", desc: "7 jours avant la date d'échéance" },
        { key: "invoiceOverdue", label: "Facture en retard", desc: "Alerte pour les factures dépassées" },
      ],
    },
    {
      title: "Remboursements",
      items: [
        { key: "refundUpdated", label: "Mise à jour remboursement", desc: "Approbation ou refus" },
      ],
    },
    {
      title: "Marketing",
      items: [
        { key: "newProducts", label: "Nouveaux produits", desc: "Nouvelles références du catalogue" },
        { key: "promotions", label: "Promotions", desc: "Offres et remises exclusives" },
        { key: "newsletter", label: "Newsletter mensuelle", desc: "Actualités médicales et produits" },
      ],
    },
  ];

  return (
    <Card>
      <SectionHeader
        icon={Bell}
        title="Préférences de notifications"
        description="Gérez les e-mails envoyés par Althea Systems."
      />
      <CardContent className="flex flex-col gap-6">
        {status && <Alert kind={status.kind} message={status.message} />}
        {sections.map((section, si) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {section.title}
            </p>
            <div className="flex flex-col gap-4">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-sm font-medium text-med-nav">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={prefs[item.key]} onCheckedChange={() => toggle(item.key)} />
                </div>
              ))}
            </div>
            {si < sections.length - 1 && <Separator className="mt-5" />}
          </div>
        ))}
        <div className="flex justify-end">
          <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Enregistrer les préférences
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Security tab ────────────────────────────────────────────────────────────

interface SessionRow {
  id: string;
  token: string;
  createdAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  current?: boolean;
}

function parseUserAgent(ua: string | null | undefined): { device: string; icon: React.ElementType } {
  if (!ua) return { device: "Appareil inconnu", icon: Monitor };
  const isMobile = /mobile|iphone|android/i.test(ua);
  const browser = /chrome/i.test(ua)
    ? "Chrome"
    : /safari/i.test(ua)
      ? "Safari"
      : /firefox/i.test(ua)
        ? "Firefox"
        : /edge/i.test(ua)
          ? "Edge"
          : "Navigateur";
  const os = /windows/i.test(ua)
    ? "Windows"
    : /mac/i.test(ua)
      ? "macOS"
      : /android/i.test(ua)
        ? "Android"
        : /iphone|ipad|ios/i.test(ua)
          ? "iOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Système";
  return { device: `${browser} · ${os}`, icon: isMobile ? Smartphone : Monitor };
}

type PwdField = "currentPwd" | "newPwd" | "confirmPwd";

function SecurityTab() {
  const { session } = useAuth();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdErrors, setPwdErrors] = useState<FieldErrors<PwdField>>({});
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdStatus, setPwdStatus] = useState<{ kind: "success" | "error"; message: string } | null>(
    null
  );

  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await (authClient as any).listSessions?.();
      const data: any[] = res?.data ?? res ?? [];
      setSessions(
        data.map((s: any) => ({
          id: s.id,
          token: s.token,
          createdAt: s.createdAt,
          ipAddress: s.ipAddress,
          userAgent: s.userAgent,
          current: session?.id === s.id,
        }))
      );
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  const validatePwd = (): FieldErrors<PwdField> =>
    validate<PwdField>({
      currentPwd: () => vRequired("Le mot de passe actuel")(currentPwd),
      newPwd: () => vPassword(newPwd),
      confirmPwd: () => vMatches(newPwd, "Les mots de passe")(confirmPwd),
    });

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus(null);
    const next = validatePwd();
    setPwdErrors(next);
    if (hasErrors(next)) return;
    setSavingPwd(true);
    try {
      await changeUserPassword(currentPwd, newPwd);
      setPwdStatus({ kind: "success", message: "Mot de passe mis à jour avec succès" });
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setPwdErrors({});
      loadSessions();
    } catch (err) {
      setPwdStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Impossible de modifier le mot de passe",
      });
    } finally {
      setSavingPwd(false);
      setTimeout(() => setPwdStatus(null), 5000);
    }
  };

  const handleRevoke = async (token: string) => {
    setRevoking(token);
    try {
      await (authClient as any).revokeSession?.({ token });
      setSessions((prev) => prev.filter((s) => s.token !== token));
    } catch {
      // ignore
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <SectionHeader
          icon={KeyRound}
          title="Changer le mot de passe"
          description="Utilisez un mot de passe fort d'au moins 8 caractères."
        />
        <CardContent>
          <form onSubmit={handlePasswordSave} noValidate className="flex flex-col gap-4">
            {pwdStatus && <Alert kind={pwdStatus.kind} message={pwdStatus.message} />}
            <FormField id="currentPwd" label="Mot de passe actuel" error={pwdErrors.currentPwd}>
              <Input
                id="currentPwd"
                type="password"
                value={currentPwd}
                onChange={(e) => {
                  setCurrentPwd(e.target.value);
                  if (pwdErrors.currentPwd) setPwdErrors((p) => ({ ...p, currentPwd: undefined }));
                }}
                aria-invalid={!!pwdErrors.currentPwd}
                autoComplete="current-password"
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="newPwd"
                label="Nouveau mot de passe"
                error={pwdErrors.newPwd}
                hint="8 caractères minimum, une lettre et un chiffre."
              >
                <Input
                  id="newPwd"
                  type="password"
                  value={newPwd}
                  onChange={(e) => {
                    setNewPwd(e.target.value);
                    if (pwdErrors.newPwd) setPwdErrors((p) => ({ ...p, newPwd: undefined }));
                    if (confirmPwd && pwdErrors.confirmPwd)
                      setPwdErrors((p) => ({ ...p, confirmPwd: undefined }));
                  }}
                  onBlur={() =>
                    setPwdErrors((p) => ({ ...p, newPwd: vPassword(newPwd) ?? undefined }))
                  }
                  aria-invalid={!!pwdErrors.newPwd}
                  autoComplete="new-password"
                />
              </FormField>
              <FormField id="confirmPwd" label="Confirmer" error={pwdErrors.confirmPwd}>
                <Input
                  id="confirmPwd"
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => {
                    setConfirmPwd(e.target.value);
                    if (pwdErrors.confirmPwd) setPwdErrors((p) => ({ ...p, confirmPwd: undefined }));
                  }}
                  onBlur={() =>
                    setPwdErrors((p) => ({
                      ...p,
                      confirmPwd: vMatches(newPwd, "Les mots de passe")(confirmPwd) ?? undefined,
                    }))
                  }
                  aria-invalid={!!pwdErrors.confirmPwd}
                  autoComplete="new-password"
                />
              </FormField>
            </div>
            <div className="flex justify-end">
              <PrimaryButton type="submit" disabled={savingPwd}>
                {savingPwd ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Mettre à jour
              </PrimaryButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <SectionHeader
          icon={Shield}
          title="Authentification à deux facteurs"
          description="Ajoutez une couche de sécurité supplémentaire."
        />
        <CardContent>
          <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="size-9 shrink-0 rounded-lg bg-secondary text-med-cta flex items-center justify-center">
                <Shield className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-med-nav">Application d'authentification</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Google Authenticator, Authy, 1Password…
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">Bientôt disponible</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <SectionHeader
          icon={Monitor}
          title="Sessions actives"
          description="Appareils actuellement connectés à votre compte."
        />
        <CardContent className="flex flex-col gap-3">
          {loadingSessions ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="size-4 animate-spin" />
              Chargement des sessions…
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune session active.</p>
          ) : (
            sessions.map((s) => {
              const { device, icon: Icon } = parseUserAgent(s.userAgent);
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 shrink-0 rounded-lg bg-secondary text-med-cta flex items-center justify-center">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-med-nav">{device}</p>
                        {s.current && (
                          <Badge className="bg-med-available text-primary-foreground hover:bg-med-available text-xs">
                            Session actuelle
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.ipAddress ?? "IP inconnue"} ·{" "}
                        {new Date(s.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {!s.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/40 hover:bg-destructive/10 text-xs gap-1.5"
                      onClick={() => handleRevoke(s.token)}
                      disabled={revoking === s.token}
                    >
                      {revoking === s.token ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                      Déconnecter
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const TABS = [
  { value: "profile", label: "Profil", icon: User },
  { value: "addresses", label: "Adresses", icon: MapPin },
  { value: "billing", label: "Facturation", icon: Building2 },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "security", label: "Sécurité", icon: Shield },
] as const;

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
          <nav className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-med-cta transition-colors">
              Accueil
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-med-nav font-medium">Paramètres</span>
          </nav>

          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-med-nav">
                Paramètres du compte
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gérez vos informations, vos adresses et vos préférences de sécurité.
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2">
                <div className="size-9 rounded-full bg-med-cta text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {user.name?.[0]?.toUpperCase() ?? user.email[0]?.toUpperCase()}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-med-nav">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Chargement de votre compte…
            </div>
          ) : !user ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <Shield className="size-8 text-muted-foreground" />
                <p className="text-sm font-medium text-med-nav">Connexion requise</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Vous devez être connecté pour accéder à vos paramètres.
                </p>
                <Button asChild className="bg-med-cta hover:bg-med-hover text-primary-foreground">
                  <Link to="/login">Se connecter</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="profile" className="flex flex-col lg:flex-row lg:items-start gap-6">
              <TabsList className="flex lg:flex-col h-auto w-full lg:w-56 shrink-0 lg:self-start justify-start bg-background border border-border rounded-xl p-1.5 gap-1 overflow-x-auto lg:overflow-visible">
                {TABS.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="justify-start gap-2.5 px-3 py-2.5 text-sm whitespace-nowrap h-auto lg:flex-none data-[state=active]:bg-secondary data-[state=active]:text-med-cta data-[state=active]:shadow-none lg:w-full"
                  >
                    <Icon className="size-4" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1 min-w-0">
                <TabsContent value="profile" className="mt-0">
                  <ProfileTab />
                </TabsContent>
                <TabsContent value="addresses" className="mt-0">
                  <AddressesTab />
                </TabsContent>
                <TabsContent value="billing" className="mt-0">
                  <BillingTab />
                </TabsContent>
                <TabsContent value="notifications" className="mt-0">
                  <NotificationsTab />
                </TabsContent>
                <TabsContent value="security" className="mt-0">
                  <SecurityTab />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
