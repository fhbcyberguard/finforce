import {
  Home,
  Users,
  Settings,
  PieChart,
  CreditCard,
  Wallet,
  Building2,
  User,
  Target,
  ShieldCheck,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/hooks/use-auth'
import { BusinessUpgradeModal } from './BusinessUpgradeModal'
import useAppStore from '@/stores/useAppStore'

const mainNavItems = [
  { title: 'Dashboard', icon: Home, url: '/dashboard' },
  { title: 'Transações', icon: CreditCard, url: '/transacoes' },
  { title: 'Orçamento', icon: PieChart, url: '/orcamento' },
  { title: 'Metas', icon: Target, url: '/metas' },
  { title: 'Contas', icon: Wallet, url: '/contas' },
  { title: 'Perfis', icon: Users, url: '/perfis' },
]

const bottomNavItems = [{ title: 'Configurações', icon: Settings, url: '/configuracoes' }]

export function AppSidebar() {
  const location = useLocation()
  const { profile, user, isMasterAdmin } = useAuth()
  const { currentContext, setCurrentContext } = useAppStore()
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)

  const handleBusinessClick = (e: React.MouseEvent) => {
    if (profile?.plan === 'basic' || !profile?.plan) {
      e.preventDefault()
      setIsUpgradeOpen(true)
    } else {
      setCurrentContext('business')
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border/50 bg-background/50">
        <Logo to={user ? '/dashboard' : '/'} className="w-full justify-center" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link
                      to={item.url}
                      className={location.pathname === item.url ? 'text-primary' : ''}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70">Contexto de Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentContext === 'personal'}
                  onClick={() => setCurrentContext('personal')}
                  tooltip="Perfil Pessoal"
                >
                  <User className="h-4 w-4" />
                  <span>Perfil Pessoal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentContext === 'business'}
                  onClick={handleBusinessClick}
                  tooltip="Perfil Empresarial"
                >
                  <Building2
                    className={`h-4 w-4 ${currentContext === 'business' ? '' : 'text-amber-500'}`}
                  />
                  <span>Perfil Empresarial</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isMasterAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary">Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/admin/clients'}
                    tooltip="Gestão de Clientes"
                  >
                    <Link
                      to="/admin/clients"
                      className={
                        location.pathname === '/admin/clients'
                          ? 'text-primary'
                          : 'hover:text-primary transition-colors'
                      }
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Clientes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                tooltip={item.title}
              >
                <Link
                  to={item.url}
                  className={location.pathname === item.url ? 'text-primary' : ''}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>

      <BusinessUpgradeModal open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen} />
    </Sidebar>
  )
}
