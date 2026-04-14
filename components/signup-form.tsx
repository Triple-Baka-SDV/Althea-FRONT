import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { useNavigate } from "@remix-run/react"
import { AlertCircle, CheckCircle } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = (): string | null => {
    if (!name.trim()) return "Le nom est requis"
    if (!email.trim()) return "L'email est requis"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email invalide"
    if (password.length < 8) return "Le mot de passe doit faire au minimum 8 caractères"
    if (password !== confirmPassword) return "Les mots de passe ne correspondent pas"
    return null
  }

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onSuccess: () => {
            setIsLoading(false)
            navigate("/")
          },
          onError: (ctx) => {
            setIsLoading(false)
            setError(ctx.error?.message || "Une erreur est survenue lors de l'inscription")
          },
        },
      )
    } catch (err: any) {
      setIsLoading(false)
      setError(err?.message || "Une erreur inattendue s'est produite")
    }
  }

  return (
    <form onSubmit={signUp} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Inscrivez-vous pour accéder à votre compte
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="name">Nom et prénom</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <FieldDescription>
            Nous ne partagerons jamais votre email avec qui que ce soit.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <FieldDescription className={password.length >= 8 ? "text-green-600" : ""}>
            {password.length >= 8 ? "✓ " : ""}Votre mot de passe doit comporter au minimum 8 caractères.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmer le mot de passe</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {confirmPassword && password === confirmPassword && (
            <FieldDescription className="text-green-600">
              ✓ Les mots de passe correspondent
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Inscription en cours..." : "Créer mon compte"}
          </Button>
          <FieldDescription className="px-6 text-center">
            Déjà un compte?{" "}
            <a href="/login" className="underline underline-offset-4 hover:text-foreground">
              Se connecter
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

