import {useCallback, useState} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {ArrowRight, Lock, Mail} from 'lucide-react'
import {useAuth} from '@/context/auth'
import AppHeader from '@/components/AppHeader'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Card, CardContent} from '@/components/ui/card'
import {Alert, AlertDescription} from '@/components/ui/alert'

export default function Login() {
    const {login, loginWithGoogle} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const redirectTo = location.state?.from?.pathname || '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please enter your email and password.')
            return
        }

        setSubmitting(true)
        try {
            await login(email.trim(), password)
            navigate(redirectTo, {replace: true})
        } catch (err) {
            setError(
                err?.response?.data?.message || 'Unable to log in. Please try again.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleGoogleCredential = useCallback(
        async (credential) => {
            setError('')
            setSubmitting(true)
            try {
                await loginWithGoogle(credential)
                navigate(redirectTo, {replace: true})
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                    'Google sign-in failed. Please try again.'
                )
            } finally {
                setSubmitting(false)
            }
        },
        [loginWithGoogle, navigate, redirectTo]
    )

    const handleGoogleError = useCallback((message) => {
        setError(message || 'Google sign-in is unavailable.')
    }, [])

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundImage:
                    'linear-gradient(135deg, #704B2F 0%, #CC8C48 50%, #AA6A37 100%)',
            }}
        >
            <AppHeader/>

            <main className="flex min-h-[calc(100vh-92px)] flex-col items-center px-4 py-10">
                <h1 className="mb-1 text-center text-5xl font-extrabold tracking-tight text-amber-200 drop-shadow-sm sm:text-6xl">
                    Welcome Back!
                </h1>
                <p className="mb-8 text-center text-lg text-yellow-100/90">
                    Log in to access your CRM
                </p>

                <Card className="w-full max-w-md rounded-3xl border-amber-200/50 bg-yellow-50/95 shadow-xl">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center gap-2 text-stone-700"
                                >
                                    <Mail className="h-4 w-4"/> Work Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={submitting}
                                    required
                                    className="h-12 rounded-xl border-stone-200 bg-stone-200/70 text-stone-800 focus-visible:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="flex items-center gap-2 text-stone-700"
                                >
                                    <Lock className="h-4 w-4"/> Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={submitting}
                                    required
                                    className="h-12 rounded-xl border-stone-200 bg-stone-200/70 text-stone-800 focus-visible:bg-white"
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                size="xl"
                                disabled={submitting}
                                className="w-full bg-amber-300 text-stone-800 shadow-sm hover:bg-amber-400"
                            >
                                {submitting ? 'Logging in…' : 'Log In'}
                                <ArrowRight className="h-4 w-4"/>
                            </Button>

                            <div className="flex items-center gap-3 pt-1 text-stone-400">
                                <div className="h-px flex-1 bg-stone-300"/>
                                <span className="text-sm">Or</span>
                                <div className="h-px flex-1 bg-stone-300"/>
                            </div>

                            <p className="text-center text-stone-600">
                                Don&apos;t have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="font-semibold text-stone-800 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>

                <section
                    aria-label="Single sign-on"
                    className="mt-6 w-full max-w-md rounded-2xl bg-amber-900/40 p-5 text-center backdrop-blur-sm"
                >
                    <p className="flex items-center justify-center gap-2 font-semibold text-emerald-100">
                        <Lock className="h-4 w-4"/> Secure SSO Authentication
                    </p>
                    <p className="mb-4 mt-1 text-sm text-yellow-50/90">
                        Your credentials are handled securely by your organization
                    </p>
                    <GoogleSignInButton
                        onCredential={handleGoogleCredential}
                        onError={handleGoogleError}
                        disabled={submitting}
                    />
                </section>
            </main>
        </div>
    )
}
