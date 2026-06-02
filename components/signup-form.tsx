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
import { AlertCircle } from "lucide-react"
import {
  name as vName,
  email as vEmail,
  password as vPassword,
  matches as vMatches,
  validate,
  hasErrors,
  type FieldErrors,
} from "@/lib/validators"

type SignupField = "name" | "email" | "password" | "confirm"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors<SignupField>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = (): FieldErrors<SignupField> =>
    validate<SignupField>({
      name: () => vName(name),
      email: () => vEmail(email),
      password: () => vPassword(password),
      confirm: () => vMatches(password, "Les mots de passe")(confirmPassword),
    })

  const clearError = (field: SignupField) =>
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const next = validateForm()
    setErrors(next)
    if (hasErrors(next)) return

    setIsLoading(true)
    try {
      await authClient.signUp.email(
        { email, password, name },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            setIsLoading(false)
            navigate("/")
          },
          onError: (ctx) => {
            setIsLoading(false)
            setServerError(ctx.error?.message || "Une erreur est survenue lors de l'inscription")
          },
        },
      )
    } catch (err: any) {
      setIsLoading(false)
      setServerError(err?.message || "Une erreur inattendue s'est produite")
    }
  }

  const passwordOk = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
  const confirmOk = confirmPassword.length > 0 && password === confirmPassword

  return (
    <form onSubmit={signUp} noValidate className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Inscrivez-vous pour accéder à votre compte
          </p>
        </div>

        {serverError && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="name">Nom et prénom</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              clearError("name")
            }}
            onBlur={() => setErrors((p) => ({ ...p, name: vName(name) ?? undefined }))}
            aria-invalid={!!errors.name}
            disabled={isLoading}
          />
          {errors.name && (
            <FieldDescription className="text-destructive">{errors.name}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearError("email")
            }}
            onBlur={() => setErrors((p) => ({ ...p, email: vEmail(email) ?? undefined }))}
            aria-invalid={!!errors.email}
            disabled={isLoading}
          />
          {errors.email ? (
            <FieldDescription className="text-destructive">{errors.email}</FieldDescription>
          ) : (
            <FieldDescription>
              Nous ne partagerons jamais votre email avec qui que ce soit.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              clearError("password")
              if (confirmPassword) clearError("confirm")
            }}
            onBlur={() => setErrors((p) => ({ ...p, password: vPassword(password) ?? undefined }))}
            aria-invalid={!!errors.password}
            disabled={isLoading}
          />
          {errors.password ? (
            <FieldDescription className="text-destructive">{errors.password}</FieldDescription>
          ) : (
            <FieldDescription className={passwordOk ? "text-green-600" : ""}>
              {passwordOk ? "✓ " : ""}
              Au moins 8 caractères, une lettre et un chiffre.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmer le mot de passe</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              clearError("confirm")
            }}
            onBlur={() =>
              setErrors((p) => ({
                ...p,
                confirm: vMatches(password, "Les mots de passe")(confirmPassword) ?? undefined,
              }))
            }
            aria-invalid={!!errors.confirm}
            disabled={isLoading}
          />
          {errors.confirm ? (
            <FieldDescription className="text-destructive">{errors.confirm}</FieldDescription>
          ) : confirmOk ? (
            <FieldDescription className="text-green-600">
              ✓ Les mots de passe correspondent
            </FieldDescription>
          ) : null}
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
