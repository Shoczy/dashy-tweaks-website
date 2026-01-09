import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Download from './pages/Download'
import Pricing from './pages/Pricing'
import HowToUse from './pages/HowToUse'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Impressum from './pages/Impressum'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/download" element={<Download />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/how-to-use" element={<HowToUse />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/impressum" element={<Impressum />} />
                        <Route path="/login" element={<Login />} />
                    </Route>
                    {/* Dashboard without Layout (has own sidebar) */}
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
