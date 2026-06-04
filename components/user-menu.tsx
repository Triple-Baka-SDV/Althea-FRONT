import { useAuth } from "@/hooks/use-auth"
import { useNavigate } from "@remix-run/react"
import { LogOut, Settings, Package, RotateCcw, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

const BACK_OFFICE_URL =
  (import.meta.env.VITE_BACK_OFFICE_URL as string | undefined) ??
  "http://localhost:3002"

export function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const isAdmin = (user as { role?: string } | null)?.role === "admin"

  const handleOpenBackOffice = async () => {
    try {
      const res = await authClient.getSession()
      const token = (res?.data?.session as { token?: string } | undefined)?.token
      if (!token) {
        console.error("Pas de token de session — connectez-vous à nouveau.")
        return
      }
      window.open(
        `${BACK_OFFICE_URL}/admin/sso?token=${encodeURIComponent(token)}`,
        "_blank",
        "noopener,noreferrer",
      )
    } catch (err) {
      console.error("Impossible d'ouvrir le back office :", err)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <Button 
        onClick={() => navigate("/login")} 
        variant="ghost" 
        className="text-med-nav hover:bg-secondary hover:text-med-cta"
      >
        Se connecter
      </Button>
    )
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  const handleSignOut = async () => {
    await signOut()
    navigate("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-med-nav bg-med-cta text-primary-foreground font-semibold text-sm hover:opacity-80 transition-opacity">
            {initials}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/orders")}>
          <Package className="mr-2 h-4 w-4" />
          <span>Mes commandes</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/refunds")}>
          <RotateCcw className="mr-2 h-4 w-4" />
          <span>Remboursements</span>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleOpenBackOffice}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Back Office</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
