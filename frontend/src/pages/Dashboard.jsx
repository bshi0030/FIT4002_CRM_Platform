import {LogOut} from 'lucide-react'
import {useAuth} from '@/context/auth'
import AppHeader from '@/components/AppHeader'
import {Button} from '@/components/ui/button'

export default function Dashboard() {
    const {user, logout} = useAuth()

    return (
        <div className="min-h-screen bg-stone-200">
            <AppHeader
                actions={
                    <Button
                        onClick={logout}
                        size="lg"
                        className="rounded-full bg-amber-300 text-stone-800 hover:bg-amber-400"
                    >
                        <LogOut className="h-4 w-4"/>
                        Log out
                    </Button>
                }
            />

            <main className="mx-auto max-w-4xl px-6 py-12">
                <h1 className="text-3xl font-bold text-stone-900">
                    Welcome, {user?.fullName}!
                </h1>
                <p className="mt-2 text-stone-700">
                    You are signed in as <strong>{user?.role}</strong> at{' '}
                    <strong>{user?.companyName}</strong>.
                </p>
            </main>
        </div>
    )
}
