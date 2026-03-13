import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import useAppStore from '@/stores/useAppStore'
import { AuthProvider } from './hooks/use-auth'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Index from './pages/Index'
import Metas from './pages/Metas'
import Patrimonio from './pages/Patrimonio'
import Contas from './pages/Contas'
import Perfis from './pages/Perfis'
import FluxoCaixa from './pages/FluxoCaixa'
import Orcamento from './pages/Orcamento'
import Configuracoes from './pages/Configuracoes'
import ProducerAdmin from './pages/ProducerAdmin'
import Clients from './pages/admin/Clients'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Landing from './pages/Landing'
import { ThemeProvider } from './components/ThemeProvider'
import { SyncData } from './components/SyncData'
import { ActivePlanGuard } from './components/ActivePlanGuard'
import logoImg from './assets/copia-de-logo-drowp-horizontal-3e587.png'

function SyncSystemState() {
  const { logoUrl } = useAppStore()

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    // Restore application icon (favicon) globally, falling back to local logo asset
    link.href = logoUrl || logoImg
  }, [logoUrl])

  return null
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <SyncSystemState />
        <SyncData />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Index />} />
                <Route element={<ActivePlanGuard />}>
                  <Route path="/transacoes" element={<FluxoCaixa />} />
                  <Route path="/orcamento" element={<Orcamento />} />
                  <Route path="/metas" element={<Metas />} />
                  <Route path="/patrimonio" element={<Patrimonio />} />
                  <Route path="/contas" element={<Contas />} />
                </Route>
                <Route path="/perfis" element={<Perfis />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/producer-admin" element={<ProducerAdmin />} />
                <Route path="/admin/clients" element={<Clients />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
