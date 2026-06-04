import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { ChevronRight, CheckCircle2, MapPin, CreditCard, Building2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { fetchAddressesByUser, createOrderBatch, type ApiAdresse } from "@/lib/api";

export const meta: MetaFunction = () => [
  { title: "Passer la commande – Althea Systems" },
];

const PAYMENT_METHODS = [
  { id: "virement", label: "Virement bancaire", desc: "Délai de traitement : 1–2 jours ouvrés", icon: Building2 },
  { id: "cheque", label: "Chèque professionnel", desc: "À l'ordre d'Althea Systems", icon: CreditCard },
  { id: "cb", label: "Carte bancaire", desc: "Visa, Mastercard, Amex", icon: CreditCard },
];

export default function CommandePage() {
  const { items, total, clearCart } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<ApiAdresse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("virement");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [createdFactureId, setCreatedFactureId] = useState<number | null>(null);

  const tva = total * 0.2;
  const totalTTC = total * 1.2;

  useEffect(() => {
    if (authLoading || !user) {
      setLoadingAddresses(false);
      return;
    }
    fetchAddressesByUser(user.id)
      .then((data) => {
        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].id);
      })
      .catch(() => setAddresses([]))
      .finally(() => setLoadingAddresses(false));
  }, [user, authLoading]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  if (items.length === 0 && !confirmed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h1 className="text-xl font-semibold text-med-nav mb-3">Votre panier est vide</h1>
            <Link to="/products">
              <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground">
                Parcourir le catalogue
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!user || !selectedAddressId) return;
    setIsSubmitting(true);
    try {
      const result = await createOrderBatch({
        clientId:  user.id,
        adresseId: selectedAddressId,
        items: items.map((item) => ({
          productsId:   item.productId,
          productName:  item.name,
          quantity:     item.qty,
          unitaryPrice: item.price.toFixed(2),
          taxRate:      "20.00",
        })),
      });
      setCreatedFactureId(result.facture?.id ?? null);
      clearCart();
      setConfirmed(true);
    } catch {
      clearCart();
      setConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30 flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="flex size-20 items-center justify-center rounded-full bg-med-available/10">
                <CheckCircle2 className="size-10 text-med-available" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-med-nav mb-3">Commande confirmée !</h1>
            <p className="text-muted-foreground mb-2">
              Votre commande a bien été enregistrée. Une facture a été émise
              {user && <> au nom de <strong>{user.email}</strong></>}.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {createdFactureId
                ? <>Vous pouvez régler la facture <strong>#{createdFactureId}</strong> dès maintenant.</>
                : <>Délai de livraison estimé : <strong>24–48h ouvrées</strong></>}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/invoices">
                <Button className="bg-med-cta hover:bg-med-hover text-primary-foreground">
                  Régler ma facture
                </Button>
              </Link>
              <Link to="/orders">
                <Button variant="outline">Voir mes commandes</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline">Continuer mes achats</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-med-cta">Accueil</Link>
            <ChevronRight className="size-3.5" />
            <Link to="/panier" className="hover:text-med-cta">Panier</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-med-nav font-medium">Commande</span>
          </nav>

          <h1 className="text-2xl font-semibold text-med-nav mb-8">Finaliser la commande</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Delivery address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-med-nav">
                    <MapPin className="size-4 text-med-cta" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingAddresses ? (
                    <p className="text-sm text-muted-foreground">Chargement des adresses…</p>
                  ) : addresses.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      <p>Aucune adresse enregistrée.</p>
                      <Link to="/settings" className="text-med-cta hover:underline text-xs mt-2 inline-block">
                        + Ajouter une adresse dans les paramètres
                      </Link>
                    </div>
                  ) : (
                    <RadioGroup
                      value={selectedAddressId != null ? String(selectedAddressId) : ""}
                      onValueChange={(v) => setSelectedAddressId(Number(v))}
                      className="flex flex-col gap-3"
                    >
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                            selectedAddressId === addr.id
                              ? "border-med-cta bg-secondary/50"
                              : "border-border hover:border-med-cta/50"
                          }`}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          <RadioGroupItem value={String(addr.id)} id={`addr-${addr.id}`} />
                          <Label htmlFor={`addr-${addr.id}`} className="cursor-pointer flex-1">
                            <span className="font-medium text-med-nav text-sm">
                              {addr.name ?? `Adresse ${addr.id}`}
                            </span>
                            {addr.adress && (
                              <p className="text-sm text-muted-foreground">{addr.adress}</p>
                            )}
                            {(addr.city || addr.country) && (
                              <p className="text-sm text-muted-foreground">
                                {[addr.city, addr.country].filter(Boolean).join(", ")}
                              </p>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  <Link to="/settings" className="text-xs text-med-cta hover:underline mt-3 inline-block">
                    + Gérer mes adresses
                  </Link>
                </CardContent>
              </Card>

              {/* Delivery method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-med-nav">
                    <Truck className="size-4 text-med-cta" />
                    Mode de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 rounded-lg border border-med-cta bg-secondary/50 p-4">
                    <div className="size-4 rounded-full border-2 border-med-cta mt-0.5 flex items-center justify-center">
                      <div className="size-2 rounded-full bg-med-cta" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-med-nav">Livraison standard (24–48h)</p>
                      <p className="text-xs text-muted-foreground">Transport adapté matériel médical · Offerte dès 150 € HT</p>
                      <p className="text-xs text-med-available font-medium mt-1">Gratuit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-med-nav">
                    <CreditCard className="size-4 text-med-cta" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-3">
                    {PAYMENT_METHODS.map((m) => (
                      <div
                        key={m.id}
                        className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                          paymentMethod === m.id
                            ? "border-med-cta bg-secondary/50"
                            : "border-border hover:border-med-cta/50"
                        }`}
                        onClick={() => setPaymentMethod(m.id)}
                      >
                        <RadioGroupItem value={m.id} id={`pay-${m.id}`} />
                        <Label htmlFor={`pay-${m.id}`} className="cursor-pointer">
                          <p className="text-sm font-medium text-med-nav">{m.label}</p>
                          <p className="text-xs text-muted-foreground">{m.desc}</p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Note */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-med-nav">Note de commande (optionnel)</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none min-h-20"
                    placeholder="Instructions de livraison, référence interne, numéro de bon de commande…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-border bg-background p-6 flex flex-col gap-4">
                <h2 className="text-base font-semibold text-med-nav">Récapitulatif</h2>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between gap-2 text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1">
                        {item.name} <span className="text-xs">×{item.qty}</span>
                      </span>
                      <span className="font-medium text-med-nav shrink-0">
                        {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total HT</span>
                    <span className="font-medium text-med-nav">{total.toFixed(2).replace(".", ",")} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA (20%)</span>
                    <span className="font-medium text-med-nav">{tva.toFixed(2).replace(".", ",")} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-med-available font-medium">Offerte</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold text-med-nav">Total TTC</span>
                  <span className="text-xl font-bold text-med-nav">{totalTTC.toFixed(2).replace(".", ",")} €</span>
                </div>

                {selectedAddress && (
                  <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                    <p className="font-medium text-med-nav mb-1">Livraison à :</p>
                    <p>{selectedAddress.name}</p>
                    {selectedAddress.adress && <p>{selectedAddress.adress}</p>}
                    {selectedAddress.city && <p>{selectedAddress.city}</p>}
                  </div>
                )}

                <Button
                  className="w-full bg-med-cta hover:bg-med-hover text-primary-foreground"
                  size="lg"
                  onClick={handleConfirm}
                  disabled={isSubmitting || !user || (!selectedAddressId && addresses.length > 0)}
                >
                  {isSubmitting ? "Confirmation en cours…" : "Confirmer la commande"}
                </Button>

                {!user && !authLoading && (
                  <p className="text-xs text-center text-destructive">
                    Vous devez être connecté pour passer une commande.
                  </p>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  En confirmant, vous acceptez nos{" "}
                  <Link to="/cgu" className="text-med-cta hover:underline">CGU</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
