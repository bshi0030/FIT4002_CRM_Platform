import {Navigate} from 'react-router-dom'
import {hasPortalSession} from '@/api/portal'

export default function PortalProtectedRoute({children}) {
    if (!hasPortalSession()) {
        return <Navigate to="/portal" replace/>
    }
    return children
}
