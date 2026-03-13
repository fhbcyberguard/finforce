import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  PieChart,
  ArrowRightLeft,
  CreditCard,
  Users,
  Settings,
  Waves,
  LogOut,
  ShieldAlert,
  Target,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'

const navigation = [
  { title: 'Visão Geral', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Metas e Sonhos', url: '/metas', icon: Target },
  { title: 'Patrimônio', url: '/patrimonio', icon: PieChart },
  { title: 'Fluxo de Caixa', url: '/fluxo', icon: ArrowRightLeft },
  { title: 'Cartões e Contas', url: '/contas', icon: CreditCard },
  { title: 'Membros Familiares', url: '/perfis', icon: Users },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { logoUrl, currentContext } = useAppStore()

  const handleLogout = () => {
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu da sua conta com sucesso.',
    })
    navigate('/login', { replace: true })
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-muted" />
        ) : (
          <div className="bg-[#1E3A5F] p-1.5 rounded-lg text-[#2EC4B6]">
            <Waves className="w-6 h-6" />
          </div>
        )}
        <span className="font-bold text-lg tracking-tight">FinFlow</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                let title = item.title
                if (item.url === '/perfis') {
                  title =
                    currentContext === 'business' ? 'Perfis de Colaborador' : 'Membros Familiares'
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/producer-admin'}
                  className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                >
                  <Link to="/producer-admin" className="flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Produtor</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/configuracoes'}
                  className="text-muted-foreground"
                >
                  <Link to="/configuracoes" className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
