import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppLayout from '@/components/AppLayout'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import SalesPipeline from '@/pages/SalesPipeline'
import TaskKanban from './pages/TaskKanban'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Dashboard />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/pipeline"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <SalesPipeline />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                        <Route
        path="/task-kanban"
        element={
            <ProtectedRoute>
                <AppLayout>
                    <TaskKanban />
                </AppLayout>
            </ProtectedRoute>
        }
    />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App