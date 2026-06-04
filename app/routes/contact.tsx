import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  required as vRequired,
  email as vEmail,
  name as vName,
  minLength as vMinLength,
  maxLength as vMaxLength,
  runAll,
  validate,
  hasErrors,
  type FieldErrors,
} from "@/lib/validators";

export const meta: MetaFunction = () => [
  { title: "Contact – Althea Systems" },
  {
    name: "description",
    content:
      "Contactez l'équipe Althea Systems pour toute question sur nos produits, vos commandes ou un sujet professionnel.",
  },
];

const SUBJECTS = [
  { value: "commande", label: "Question sur une commande" },
  { value: "produit", label: "Question sur un produit" },
  { value: "facturation", label: "Facturation / paiement" },
  { value: "remboursement", label: "Remboursement / retour" },
  { value: "compte", label: "Mon compte" },
  { value: "professionnel", label: "Demande professionnelle" },
  { value: "autre", label: "Autre" },
];

type Field = "name" | "email" | "subject" | "message";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function FormField({
    id,
    label,
    error,
    children,
  }: {
    id: string;
    label: string;
    error?: string | null;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        {children}
        {error ? (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="size-3" /> {error}
          </p>
        ) : null}
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate<Field>({
      name: () => runAll(vRequired("Nom")(name), vName(name)),
      email: () => runAll(vRequired("E-mail")(email), vEmail(email)),
      subject: () => vRequired("Sujet")(subject),
      message: () =>
        runAll(
          vRequired("Message")(message),
          vMinLength(20, "Message")(message),
          vMaxLength(2000, "Message")(message),
        ),
    });
    setErrors(errs);
    if (hasErrors(errs)) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 600);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h1
            className="mb-3 text-3xl font-semibold text-med-nav"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Nous contacter
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Une question, une suggestion ? L'équipe Althea Systems vous répond
            sous 48h ouvrées.
          </p>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            {/* Form */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {success ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-med-available/10 text-med-available">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-med-nav">
                    Message envoyé
                  </h2>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Merci ! Votre message a bien été transmis à notre équipe.
                    Nous vous répondrons par e-mail dans les meilleurs délais.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSuccess(false)}
                    className="mt-2"
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField id="name" label="Nom complet" error={errors.name}>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jean Dupont"
                        aria-invalid={!!errors.name}
                      />
                    </FormField>
                    <FormField id="email" label="E-mail" error={errors.email}>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean.dupont@email.fr"
                        aria-invalid={!!errors.email}
                      />
                    </FormField>
                  </div>

                  <FormField id="subject" label="Sujet" error={errors.subject}>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger id="subject" aria-invalid={!!errors.subject}>
                        <SelectValue placeholder="Sélectionnez un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField id="message" label="Message" error={errors.message}>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Décrivez votre demande en quelques lignes..."
                      rows={6}
                      aria-invalid={!!errors.message}
                    />
                    <p className="text-right text-xs text-muted-foreground">
                      {message.length} / 2000
                    </p>
                  </FormField>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="self-start bg-med-cta hover:bg-med-hover"
                  >
                    <Send className="size-4" />
                    {submitting ? "Envoi…" : "Envoyer le message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Sidebar — coordinates */}
            <aside className="flex flex-col gap-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2
                  className="mb-4 text-lg font-semibold text-med-nav"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Nos coordonnées
                </h2>
                <ul className="flex flex-col gap-4 text-sm text-foreground/80">
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-med-cta" />
                    <div>
                      <p className="font-medium text-med-nav">Téléphone</p>
                      <p>01 23 45 67 89</p>
                      <p className="text-xs text-muted-foreground">
                        Lun–Ven, 9h–18h
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-med-cta" />
                    <div>
                      <p className="font-medium text-med-nav">E-mail</p>
                      <p>contact@altheasystems.fr</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-med-cta" />
                    <div>
                      <p className="font-medium text-med-nav">Adresse</p>
                      <p>12 rue de la Pharmacie</p>
                      <p>75001 Paris, France</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-med-bg/40 p-6">
                <h3 className="mb-2 text-sm font-semibold text-med-nav">
                  Besoin d'aide rapide ?
                </h3>
                <p className="text-sm text-foreground/80">
                  Consultez notre FAQ ou notre ChatBot pour obtenir une réponse
                  immédiate aux questions les plus fréquentes.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
