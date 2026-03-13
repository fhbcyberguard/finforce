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
  ChevronsUpDown,
  Briefcase,
  User,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'

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
  const { logoUrl, currentContext, setCurrentContext } = useAppStore()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu da sua conta com sucesso.',
    })
    navigate('/', { replace: true })
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#1E3A5F] text-[#2EC4B6]">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="size-8 rounded-lg object-contain bg-muted"
                      />
                    ) : (
                      <Waves className="size-5" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold tracking-tight text-base">FinFlow</span>
                    <span className="truncate text-xs font-medium text-muted-foreground">
                      {currentContext === 'business' ? 'Perfil Empresarial' : 'Perfil Pessoal'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={() => setCurrentContext('personal')}
                  className="cursor-pointer gap-2"
                >
                  <User className="size-4" />
                  <span>Perfil Pessoal</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrentContext('business')}
                  className="cursor-pointer gap-2"
                >
                  <Briefcase className="size-4" />
                  <span>Perfil Empresarial</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
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
