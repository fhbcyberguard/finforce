import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PieChart,
  Landmark,
  Target,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { Logo } from './Logo'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Contas', href: '/contas' },
  { icon: ArrowLeftRight, label: 'Fluxo de Caixa', href: '/transacoes' },
  { icon: PieChart, label: 'Orçamento', href: '/orcamento' },
  { icon: Landmark, label: 'Patrimônio', href: '/patrimonio' },
  { icon: Target, label: 'Metas', href: '/metas' },
  { icon: Users, label: 'Perfis', href: '/perfis' },
  { icon: Settings, label: 'Configurações', href: '/configuracoes' },
]

export function AppSidebar() {
  const location = useLocation()
  const { state } = useSidebar()
  const { user } = useAuth()

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
      <SidebarFooter className="p-4">
        {state !== 'collapsed' && user && (
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
