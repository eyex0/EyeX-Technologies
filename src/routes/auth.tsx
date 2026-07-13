import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { AuthService } from '@/services/auth.service'
import { useAuth } from '@/hooks/use-auth'

/**
 * Simple authentication page using Supabase via the existing AuthService.
 * Features:
 *  - Email input
 *  - Password input
 *  - Login button
 *  - Signup button
 *  - Google login button
 * After a successful login the user is redirected to "/dashboard".
 * The page uses a dark background to match the requested style.
 */
export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()

  // UI state
  const [mode, setMode] = useState<'signIn' | 'signUp' | 'forgot'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: '/dashboard' })
    }
  }, [authLoading, user, navigate])

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const isValidPassword = (p: string) => p.length >= 6

  const handleSignIn = async () => {
    setError(null)
    if (!isValidEmail(email) || !isValidPassword(password)) {
      setError('Please provide a valid email and password (min 6 characters).')
      return
    }
    setLoading(true)
    try {
      await AuthService.signIn(email, password)
      navigate({ to: '/dashboard' })
    } catch (e: any) {
      setError(e.message ?? 'Sign‑in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    setError(null)
    if (!isValidEmail(email) || !isValidPassword(password) || !fullName.trim()) {
      setError('All fields are required (password min 6 characters).')
      return
    }
    setLoading(true)
    try {
      await AuthService.signUp(email, password, fullName.trim())
      navigate({ to: '/dashboard' })
    } catch (e: any) {
      setError(e.message ?? 'Sign‑up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async () => {
    setError(null)
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      await AuthService.resetPassword(email)
      setError('Password‑reset email sent – check your inbox.')
      setMode('signIn')
    } catch (e: any) {
      setError(e.message ?? 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null)
    setLoading(true)
    try {
      await AuthService.signInWithOAuth(provider)
    } catch (e: any) {
      setError(e.message ?? `${provider} login failed`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">EyeX Technologies Authentication</h1>

        {/* Mode selector */}
        <div className="flex justify-center space-x-4 mb-4">
          <button onClick={() => setMode('signIn')} className={`px-3 py-1 rounded ${mode === 'signIn' ? 'bg-blue-600' : 'bg-gray-700'}`}>Sign In</button>
          <button onClick={() => setMode('signUp')} className={`px-3 py-1 rounded ${mode === 'signUp' ? 'bg-blue-600' : 'bg-gray-700'}`}>Sign Up</button>
          <button onClick={() => setMode('forgot')} className={`px-3 py-1 rounded ${mode === 'forgot' ? 'bg-blue-600' : 'bg-gray-700'}`}>Forgot Password</button>
        </div>

        {error && <div className="bg-red-600 text-sm p-2 rounded text-center">{error}</div>}

        {/* Email */}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded px-3 py-2 bg-gray-700 text-white focus:outline-none" />

        {mode !== 'forgot' && (
          <>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded px-3 py-2 bg-gray-700 text-white focus:outline-none" />
            {mode === 'signUp' && (
              <input type="text" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded px-3 py-2 bg-gray-700 text-white focus:outline-none" />
            )}
          </>
        )}

        <button onClick={mode === 'signIn' ? handleSignIn : mode === 'signUp' ? handleSignUp : handleForgot} disabled={loading} className="w-full rounded bg-blue-600 hover:bg-blue-500 py-2 disabled:opacity-50">
          {loading ? 'Processing…' : mode === 'signIn' ? 'Sign In' : mode === 'signUp' ? 'Sign Up' : 'Reset Password'}
        </button>

        {/* OAuth */}
        <div className="flex flex-col space-y-2 mt-4">
          <button onClick={() => handleOAuth('google')} disabled={loading} className="w-full rounded bg-red-600 hover:bg-red-500 py-2 disabled:opacity-50">Continue with Google</button>
          <button onClick={() => handleOAuth('github')} disabled={loading} className="w-full rounded bg-gray-600 hover:bg-gray-500 py-2 disabled:opacity-50">Continue with GitHub</button>
        </div>
      </div>
    </div>
  )
}
