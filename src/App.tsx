import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Patrimonio from './pages/Patrimonio'
import Contas from './pages/Contas'
import Perfis from './pages/Perfis'
import FluxoCaixa from './pages/FluxoCaixa'
import Configuracoes from './pages/Configuracoes'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import { ThemeProvider } from './components/ThemeProvider'

const App = () => (
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/patrimonio" element={<Patrimonio />} />
            <Route path="/fluxo" element={<FluxoCaixa />} />
            <Route path="/contas" element={<Contas />} />
            <Route path="/perfis" element={<Perfis />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
