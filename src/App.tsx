import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Impressum from './pages/Impressum'
import Dashboard from './pages/Dashboard'
import Changelog from './pages/Changelog'
import Settings from './pages/Settings'
import Maintenance from './pages/Maintenance'

// Set to true to enable maintenance mode
const MAINTENANCE_MODE = true

export default function App() {
    // Show maintenance page if enabled
    if (MAINTENANCE_MODE) {
        return <Maintenance />
    }

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/impressum" element={<Impressum />} />
                        <Route path="/changelog" element={<Changelog />} />
                    </Route>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* Redirect old routes to home */}
                    <Route path="/download" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/pricing" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
