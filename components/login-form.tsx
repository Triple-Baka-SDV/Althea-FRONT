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
  email as vEmail,
  required as vRequired,
  validate,
  hasErrors,
  type FieldErrors,
} from "@/lib/validators"

type LoginField = "email" | "password"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors<LoginField>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = (): FieldErrors<LoginField> =>
    validate<LoginField>({
      email: () => vEmail(email),
      password: () => vRequired("Le mot de passe")(password),
    })

  const clearError = (field: LoginField) =>
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const next = validateForm()
    setErrors(next)
    if (hasErrors(next)) return

    setIsLoading(true)
    try {
      await authClient.signIn.email(
        { email, password },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            setIsLoading(false)
            navigate("/")
          },
          onError: (ctx) => {
            setIsLoading(false)
            setServerError(ctx.error?.message || "Identifiants incorrects")
          },
        },
      )
    } catch (err: any) {
      setIsLoading(false)
      setServerError(err?.message || "Une erreur inattendue s'est produite")
    }
  }

  return (
    <form onSubmit={signIn} noValidate className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Entrez votre adresse email et votre mot de passe pour vous connecter à votre compte.
          </p>
        </div>

        {serverError && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

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
          {errors.email && (
            <FieldDescription className="text-destructive">{errors.email}</FieldDescription>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Mot de passe oublié?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              clearError("password")
            }}
            aria-invalid={!!errors.password}
            disabled={isLoading}
          />
          {errors.password && (
            <FieldDescription className="text-destructive">{errors.password}</FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Connexion"}
          </Button>
          <FieldDescription className="text-center">
            Pas de compte?{" "}
            <a href="/register" className="underline underline-offset-4 hover:text-foreground">
              S'inscrire
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
