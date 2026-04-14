import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { useNavigate } from "@remix-run/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export default function SettingsPage() {
  const { user, signOut, isLoading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || "")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!name.trim()) {
      setError("Le nom ne peut pas être vide")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate("/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Paramètres du compte</h1>
            <p className="mt-2 text-muted-foreground">Gérez vos informations personnelles et vos paramètres de compte</p>
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Modifiez vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <p>Profil mis à jour avec succès</p>
                  </div>
                )}

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Nom et prénom</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSaving}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="cursor-not-allowed"
                    />
                    <FieldDescription>
                      Votre adresse email ne peut pas être modifiée
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="role">Rôle</FieldLabel>
                    <Input
                      id="role"
                      type="text"
                      value={(user as any)?.role || "user"}
                      disabled
                      className="cursor-not-allowed"
                    />
                  </Field>

                  <Button type="submit" disabled={isSaving} className="mt-4">
                    {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Gérez votre sécurité et vos sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Déconnexion</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Déconnectez-vous de votre compte sur cet appareil
                  </p>
                  <Button variant="outline" onClick={handleLogout}>
                    Se déconnecter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>Détails sur votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compte créé</p>
                  <p className="text-sm">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Non disponible"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
