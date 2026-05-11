import {LogOut} from 'lucide-react'
import {useAuth} from '@/context/auth'
import {Button} from '@/components/ui/button'
import logo from '@/assets/CRM_logo.png'

export default function Dashboard() {
    const {user, logout} = useAuth()

    return (
        <div className="min-h-screen bg-stone-200">
            <header className="flex items-center justify-between bg-stone-300 px-6 py-3">
                <div className="flex items-center gap-4">
                    <img
                        src={logo}
                        alt="NexGen CRM"
                        className="h-20 w-20 object-contain"
                    />
                    <div className="h-12 w-px bg-stone-500/40"/>
                    <p className="text-base font-semibold text-stone-700">
                        Next Generation CRM Platform
                    </p>
                </div>
                <Button
                    onClick={logout}
                    size="lg"
                    className="rounded-full bg-amber-300 text-stone-800 hover:bg-amber-400"
                >
                    <LogOut className="h-4 w-4"/>
                    Log out
                </Button>
            </header>

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
