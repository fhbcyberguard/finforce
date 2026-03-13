import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PieChart,
  Landmark,
  Target,
  Settings,
  Users,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart2,
  TrendingUp,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Logo } from './Logo'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BarChart2, label: 'Visão Macro', href: '/visao-macro' },
  { icon: Wallet, label: 'Contas', href: '/contas' },
  { icon: ArrowLeftRight, label: 'Fluxo de Caixa', href: '/transacoes' },
  { icon: PieChart, label: 'Orçamento', href: '/orcamento' },
  { icon: Target, label: 'Metas', href: '/metas' },
  { icon: TrendingUp, label: 'Plano de Aposentadoria', href: '/aposentadoria' },
  { icon: Landmark, label: 'Patrimônio', href: '/patrimonio' },
  { icon: Users, label: 'Perfis', href: '/perfis' },
  { icon: Settings, label: 'Configurações', href: '/configuracoes' },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state, toggleSidebar } = useSidebar()
  const { signOut } = useAuth()
  const { currentContext, setCurrentContext } = useAppStore()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4 flex justify-center items-center h-16">
        <Link to="/" className="flex items-center justify-center w-full">
          <Logo collapsed={state === 'collapsed'} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 flex flex-col gap-4 border-t border-sidebar-border/50">
        {state === 'expanded' ? (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <Tabs
              value={currentContext}
              onValueChange={(v) => setCurrentContext(v as 'personal' | 'business')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-10 bg-sidebar-accent">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2 text-xs data-[state=active]:bg-sidebar data-[state=active]:shadow-sm"
                >
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate">Pessoal</span>
                </TabsTrigger>
                <TabsTrigger
                  value="business"
                  className="flex items-center gap-2 text-xs data-[state=active]:bg-sidebar data-[state=active]:shadow-sm"
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">Empresa</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex justify-center w-full">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-full"
                onClick={toggleSidebar}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 bg-sidebar-accent hover:bg-sidebar-accent/80"
              onClick={() =>
                setCurrentContext(currentContext === 'personal' ? 'business' : 'personal')
              }
              title={currentContext === 'personal' ? 'Mudar para Empresa' : 'Mudar para Pessoal'}
            >
              {currentContext === 'personal' ? (
                <User className="h-5 w-5 text-sidebar-foreground" />
              ) : (
                <Building2 className="h-5 w-5 text-sidebar-foreground" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-full"
              onClick={toggleSidebar}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              onClick={handleLogout}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
