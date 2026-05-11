import { useState } from "react";
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
  CheckCircle,
  AlertCircle,
  Star,
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
import data from "@/data/data.json";

export const meta: MetaFunction = () => [
  { title: "Paramètres – Athlea Systems" },
];

function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}

// ── Profile tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const [name, setName] = useState(data.user.name);
  const [phone, setPhone] = useState(data.user.phone);
  const [rpps, setRpps] = useState(data.user.rpps);
  const [specialty, setSpecialty] = useState(data.user.specialty);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Vos informations professionnelles affichées sur les commandes et factures.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {saved && <SuccessAlert message="Profil mis à jour avec succès" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nom et prénom</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" value={data.user.email} disabled className="cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="specialty">Spécialité médicale</Label>
              <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rpps">Numéro RPPS</Label>
            <Input id="rpps" value={rpps} onChange={(e) => setRpps(e.target.value)} placeholder="11 chiffres" />
            <p className="text-xs text-muted-foreground">
              Répertoire Partagé des Professionnels intervenant dans le système de Santé
            </p>
          </div>
          <Button type="submit" className="self-start bg-med-cta hover:bg-med-hover text-primary-foreground">
            Enregistrer les modifications
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

// ── Addresses tab ─────────────────────────────────────────────────────────────
function AddressesTab() {
  const [addresses, setAddresses] = useState(data.user.addresses);
  const [editing, setEditing] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Adresses de livraison</CardTitle>
              <CardDescription>Gérez vos adresses pour les livraisons de commandes.</CardDescription>
            </div>
            <Button size="sm" className="bg-med-cta hover:bg-med-hover text-primary-foreground gap-1.5">
              <Plus className="size-4" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {saved && <SuccessAlert message="Adresse par défaut mise à jour" />}
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-lg border p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                addr.isDefault ? "border-med-cta bg-secondary/30" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="size-9 shrink-0 rounded-full bg-secondary flex items-center justify-center text-med-cta">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-med-nav">{addr.label}</p>
                    {addr.isDefault && (
                      <Badge className="bg-med-cta text-primary-foreground hover:bg-med-cta text-xs">
                        Par défaut
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{addr.name}</p>
                  <p className="text-sm text-muted-foreground">{addr.street}</p>
                  <p className="text-sm text-muted-foreground">{addr.zip} {addr.city}, {addr.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!addr.isDefault && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => handleSetDefault(addr.id)}>
                    <Star className="size-3.5" />
                    Par défaut
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Pencil className="size-3.5" />
                  Modifier
                </Button>
                {!addr.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(addr.id)}
                  >
                    <Trash2 className="size-3.5" />
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Billing tab ───────────────────────────────────────────────────────────────
function BillingTab() {
  const [companyName, setCompanyName] = useState(data.user.billing.companyName);
  const [siret, setSiret] = useState(data.user.billing.siret);
  const [tvaIntra, setTvaIntra] = useState(data.user.billing.tvaIntra);
  const [billingAddress, setBillingAddress] = useState(data.user.billing.address);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de facturation</CardTitle>
          <CardDescription>Ces informations apparaissent sur toutes vos factures Athlea Systems.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {saved && <SuccessAlert message="Informations de facturation enregistrées" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="companyName">Raison sociale / Cabinet</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="siret">SIRET</Label>
              <Input id="siret" value={siret} onChange={(e) => setSiret(e.target.value)} placeholder="000 000 000 00000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tvaIntra">N° TVA intracommunautaire</Label>
              <Input id="tvaIntra" value={tvaIntra} onChange={(e) => setTvaIntra(e.target.value)} placeholder="FR00000000000" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="billingAddress">Adresse de facturation</Label>
            <Textarea
              id="billingAddress"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
          <Button type="submit" className="self-start bg-med-cta hover:bg-med-hover text-primary-foreground">
            Enregistrer
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents fiscaux</CardTitle>
          <CardDescription>Téléchargez vos documents comptables annuels.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {["2025", "2024"].map((year) => (
              <div key={year} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-med-nav">Récapitulatif achats {year}</p>
                  <p className="text-xs text-muted-foreground">Toutes commandes et factures {year}</p>
                </div>
                <Button variant="outline" size="sm">Télécharger PDF</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

// ── Notifications tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    orderConfirmed: true,
    orderShipped: true,
    orderDelivered: true,
    invoiceDue: true,
    invoiceOverdue: true,
    refundUpdated: true,
    newProducts: false,
    promotions: false,
    newsletter: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      title: "Commandes",
      items: [
        { key: "orderConfirmed" as const, label: "Confirmation de commande", desc: "Reçu lors de chaque nouvelle commande" },
        { key: "orderShipped" as const, label: "Expédition", desc: "Notification lorsque votre commande est expédiée" },
        { key: "orderDelivered" as const, label: "Livraison", desc: "Confirmation de livraison" },
      ],
    },
    {
      title: "Factures",
      items: [
        { key: "invoiceDue" as const, label: "Rappel d'échéance", desc: "7 jours avant la date d'échéance" },
        { key: "invoiceOverdue" as const, label: "Facture en retard", desc: "Alerte pour les factures dépassées" },
      ],
    },
    {
      title: "Remboursements",
      items: [
        { key: "refundUpdated" as const, label: "Mise à jour remboursement", desc: "Approbation ou refus de vos demandes" },
      ],
    },
    {
      title: "Marketing",
      items: [
        { key: "newProducts" as const, label: "Nouveaux produits", desc: "Alertes sur les nouvelles références du catalogue" },
        { key: "promotions" as const, label: "Promotions", desc: "Offres et remises exclusives" },
        { key: "newsletter" as const, label: "Newsletter mensuelle", desc: "Actualités médicales et produits du mois" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Préférences de notifications</CardTitle>
          <CardDescription>Gérez les e-mails envoyés par Athlea Systems.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {saved && <SuccessAlert message="Préférences de notifications enregistrées" />}
          {sections.map((section, si) => (
            <div key={si}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {section.title}
              </p>
              <div className="flex flex-col gap-4">
                {section.items.map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-med-nav">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={prefs[item.key]}
                      onCheckedChange={() => toggle(item.key)}
                    />
                  </div>
                ))}
              </div>
              {si < sections.length - 1 && <Separator className="mt-5" />}
            </div>
          ))}
          <Button className="self-start bg-med-cta hover:bg-med-hover text-primary-foreground" onClick={handleSave}>
            Enregistrer les préférences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Security tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (newPwd !== confirmPwd) {
      setPwdError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPwd.length < 8) {
      setPwdError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setPwdSaved(true);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setTimeout(() => setPwdSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>Utilisez un mot de passe fort d'au moins 8 caractères.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
            {pwdSaved && <SuccessAlert message="Mot de passe mis à jour avec succès" />}
            {pwdError && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{pwdError}</p>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPwd">Mot de passe actuel</Label>
              <Input id="currentPwd" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPwd">Nouveau mot de passe</Label>
              <Input id="newPwd" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPwd">Confirmer le nouveau mot de passe</Label>
              <Input id="confirmPwd" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
            </div>
            <Button type="submit" className="self-start bg-med-cta hover:bg-med-hover text-primary-foreground">
              Mettre à jour le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentification à deux facteurs</CardTitle>
          <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-med-nav">Authentification par application</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Utilisez une application comme Google Authenticator ou Authy
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions actives</CardTitle>
          <CardDescription>Gérez les appareils connectés à votre compte.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[
            { device: "Chrome · Windows", location: "Paris, France", current: true },
            { device: "Safari · iPhone", location: "Paris, France", current: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-med-nav">{session.device}</p>
                  {session.current && (
                    <Badge className="bg-med-available text-primary-foreground hover:bg-med-available text-xs">
                      Session actuelle
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{session.location}</p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10 text-xs">
                  Déconnecter
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-med-cta">Accueil</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-med-nav font-medium">Paramètres</span>
          </nav>

          <h1 className="text-2xl font-semibold text-med-nav mb-8">Paramètres du compte</h1>

          <Tabs defaultValue="profile" orientation="vertical" className="flex flex-col sm:flex-row gap-6">
            <TabsList className="flex sm:flex-col h-auto sm:w-52 shrink-0 justify-start bg-background border border-border rounded-xl p-2 gap-1">
              {[
                { value: "profile", label: "Profil", icon: User },
                { value: "addresses", label: "Adresses", icon: MapPin },
                { value: "billing", label: "Facturation", icon: Building2 },
                { value: "notifications", label: "Notifications", icon: Bell },
                { value: "security", label: "Sécurité", icon: Shield },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="justify-start gap-2.5 px-3 py-2.5 text-sm data-[state=active]:bg-secondary data-[state=active]:text-med-cta w-full"
                >
                  <Icon className="size-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 min-w-0">
              <TabsContent value="profile"><ProfileTab /></TabsContent>
              <TabsContent value="addresses"><AddressesTab /></TabsContent>
              <TabsContent value="billing"><BillingTab /></TabsContent>
              <TabsContent value="notifications"><NotificationsTab /></TabsContent>
              <TabsContent value="security"><SecurityTab /></TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
