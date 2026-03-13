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
import Configuracoes from './pages/Configuracoes'
import ProducerAdmin from './pages/ProducerAdmin'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Landing from './pages/Landing'
import { ThemeProvider } from './components/ThemeProvider'

function SyncSystemState() {
  const { logoUrl } = useAppStore()

  useEffect(() => {
    if (logoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = logoUrl
    }
  }, [logoUrl])

  return null
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <SyncSystemState />
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
                <Route path="/metas" element={<Metas />} />
                <Route path="/patrimonio" element={<Patrimonio />} />
                <Route path="/fluxo" element={<FluxoCaixa />} />
                <Route path="/contas" element={<Contas />} />
                <Route path="/perfis" element={<Perfis />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/producer-admin" element={<ProducerAdmin />} />
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
