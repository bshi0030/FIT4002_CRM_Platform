import { useAuth } from '@/context/auth'
import { useLocation } from 'react-router-dom'
import AppHeader from '@/components/AppHeader'
import Menu from '@/pages/Menu'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import '../styles/AppLayout.css'

function AppLayout({ children }) {
    const { logout } = useAuth()
    const location = useLocation()

    const currentPage = location.pathname === '/' ? 'home' : location.pathname.replace('/', '')

    return (
        <div className="app-layout-wrapper">

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

            <div className="app-body">

                <aside className="app-sidebar">
                    <div className="menu-wrapper">
                        <h2 className="menu-title">Menu</h2>
                        <Menu currentPage={currentPage} setCurrentPage={() => {}} />
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