import { useAuth } from '@/context/auth'
import AppHeader from '@/components/AppHeader'
import Menu from '@/components/Menu'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import './AppLayout.css'

function AppLayout({ children }) {
    const { logout } = useAuth()

    return (
        <div className="app-layout-wrapper">

            {/* TOPBAR — full width across top */}
            <AppHeader
                actions={
                    <Button
                        onClick={logout}
                        size="lg"
                        className="rounded-full bg-amber-300 text-stone-800 hover:bg-amber-400"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </Button>
                }
            />

            {/* BOTTOM SECTION — sidebar + content side by side */}
            <div className="app-body">

                <aside className="app-sidebar">
                    <div className="menu-wrapper">
                        <h2 className="menu-title">Menu</h2>
                        <Menu currentPage="home" setCurrentPage={() => {}} />
                    </div>
                </aside>

                <div className="app-main">
                    <div className="app-content">
                        {children}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default AppLayout