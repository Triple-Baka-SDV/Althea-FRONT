# Modern Auth System Setup Guide

Your authentication system is now fully configured! Here's how to use it:

## Environment Variables

Add these to your `.env.local` file in the Althea-Front root:

```env
VITE_AUTH_URL=http://localhost:3001
```

## Components Overview

### 1. **LoginForm** (`components/login-form.tsx`)
- Clean email/password login form
- Real-time error handling
- Loading states during submission
- Auto-redirects to home on success
- French language support

**Usage:**
```tsx
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  )
}
```

### 2. **SignupForm** (`components/signup-form.tsx`)
- Complete registration with validation
- Password confirmation matching
- Real-time validation feedback
- Password strength indicator
- Auto-redirects after successful signup

**Usage:**
```tsx
import { SignupForm } from "@/components/signup-form"

export default function RegisterPage() {
  return (
    <div>
      <SignupForm />
    </div>
  )
}
```

### 3. **useAuth Hook** (`hooks/use-auth.ts`)
- Get current user and session info
- Check authentication status
- Perform sign-out
- Loading state management

**Usage:**
```tsx
import { useAuth } from "@/hooks/use-auth"

export function MyComponent() {
  const { user, isAuthenticated, signOut, isLoading } = useAuth()

  if (isLoading) return <div>Chargement...</div>

  return (
    <div>
      {isAuthenticated && <p>Connecté en tant que: {user?.name}</p>}
      <button onClick={signOut}>Déconnexion</button>
    </div>
  )
}
```

### 4. **ProtectedRoute** (`components/protected-route.tsx`)
- Wraps components requiring authentication
- Auto-redirects to login if not authenticated
- Shows loading state while checking auth

**Usage:**
```tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Tableau de bord (protégé)</h1>
        {/* Contenu réservé aux utilisateurs connectés */}
      </div>
    </ProtectedRoute>
  )
}
```

### 5. **UserMenu** (`components/user-menu.tsx`)
- Displays logged-in user info
- Dropdown menu with profile and logout
- Shows login button if not authenticated
- Place in your header

**Usage:**
```tsx
import { UserMenu } from "@/components/user-menu"

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>Althea</h1>
      <UserMenu />
    </header>
  )
}
```

## Auth Flow

### Login Flow
1. User fills email & password
2. Form validates inputs
3. Sends request to `POST /api/auth/sign-in/email`
4. On success: Creates session, redirects to home
5. On error: Shows error message

### Signup Flow
1. User fills name, email, and password
2. Form validates:
   - Email format
   - Password length (min 8 chars)
   - Password confirmation match
3. Sends request to `POST /api/auth/sign-up/email`
4. On success: Creates user & session, redirects to home
5. On error: Shows specific error message

### Session Management
- Sessions stored in cookies (browser automatically handles)
- Auto-fetched on page load via `useAuth()` hook
- Credentials sent automatically with requests (CORS) configured
- Sign-out clears session

## Authentication Client

The auth client is configured in `lib/auth-client.ts`:

```tsx
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL ?? "http://localhost:3001",
})
```

It communicates with your Better Auth backend endpoints:
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-out`
- `GET /api/auth/session`
- `POST /api/auth/forget-password`
- `POST /api/auth/reset-password/{token}`
- `GET /api/auth/verify-email`

## Integration Examples

### Protecting a Route
```tsx
// app/routes/profile.tsx
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div>
        <h1>Mon Profil</h1>
        <p>Email: {user?.email}</p>
        <p>Nom: {user?.name}</p>
      </div>
    </ProtectedRoute>
  )
}
```

### Conditional Rendering Based on Auth
```tsx
import { useAuth } from "@/hooks/use-auth"

export function ProductCard() {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      <p>Produit exclusif</p>
      {!isAuthenticated && (
        <p>Connectez-vous pour voir les prix</p>
      )}
      {isAuthenticated && (
        <p>Prix: 99€</p>
      )}
    </div>
  )
}
```

### Custom Logout Button
```tsx
import { useAuth } from "@/hooks/use-auth"
import { useNavigate } from "@remix-run/react"

export function LogoutButton() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate("/login")
  }

  return <button onClick={handleLogout}>Déconnexion</button>
}
```

## Features

✅ Clean, modern UI using your Shadcn components  
✅ Real-time form validation  
✅ Error handling with user-friendly messages  
✅ Loading states on buttons  
✅ Password strength feedback  
✅ Session persistence  
✅ Auto-redirect after auth  
✅ Fully French localized  
✅ TypeScript types included  
✅ Remix-ready with navigation hooks  

## Troubleshooting

**"Failed to fetch session" error:**
- Ensure backend is running on `http://localhost:3001`
- Check CORS is configured in backend
- Verify `VITE_AUTH_URL` environment variable

**Form not submitting:**
- Check browser console for errors
- Verify all required fields are filled
- Ensure password is at least 8 characters
- Check network tab to see API responses

**Redirects not working:**
- Ensure `useNavigate` is from `@remix-run/react`
- Check that Remix router is properly configured

## Next Steps

1. Add `.env.local` with `VITE_AUTH_URL`
2. Update your header to include `<UserMenu />`
3. Wrap protected pages with `<ProtectedRoute />`
4. Test login/signup flows
5. Add role-based access control using `user.role` field
6. Implement forgot password flow
