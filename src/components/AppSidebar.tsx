import { Home, Users, Settings, PieChart, CreditCard, Wallet, Building2 } from 'lucide-react'
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

const mainNavItems = [
  { title: 'Dashboard', icon: Home, url: '/dashboard' },
  { title: 'Transações', icon: CreditCard, url: '/transacoes' },
  { title: 'Orçamento', icon: PieChart, url: '/orcamento' },
  { title: 'Contas', icon: Wallet, url: '/contas' },
  { title: 'Perfis', icon: Users, url: '/perfis' },
]

const bottomNavItems = [{ title: 'Configurações', icon: Settings, url: '/configuracoes' }]

export function AppSidebar() {
  const location = useLocation()
  const { profile, user } = useAuth()
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)

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
                      className={location.pathname === item.url ? 'text-[#03f2ff]' : ''}
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
          <SidebarGroupLabel className="text-[#03f2ff]/70">Opções Premium</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Perfil Empresarial"
                  onClick={(e) => {
                    if (profile?.plan === 'basic' || !profile?.plan) {
                      e.preventDefault()
                      setIsUpgradeOpen(true)
                    }
                  }}
                >
                  <Link
                    to={
                      profile?.plan === 'basic' || !profile?.plan
                        ? '#'
                        : '/dashboard?context=business'
                    }
                  >
                    <Building2 className="h-4 w-4 text-[#03f2ff]" />
                    <span className="text-[#03f2ff] font-medium">Perfil Empresarial</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
                  className={location.pathname === item.url ? 'text-[#03f2ff]' : ''}
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
