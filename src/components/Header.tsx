import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Settings, LogOut, Users, Waves, Briefcase, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ThemeToggle } from './ThemeToggle'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'

export function Header() {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    logoUrl,
    searchQuery,
    setSearchQuery,
    profiles,
    alerts,
    currentContext,
    setCurrentContext,
    subscriptionPlan,
    setSubscriptionPlan,
  } = useAppStore()

  const urgentAlerts = alerts.filter((a) => a.type === 'urgent').length
  const mainProfile = profiles[0]

  const handleLogout = () => {
    toast({ title: 'Sessão encerrada', description: 'Você saiu da sua conta com sucesso.' })
    navigate('/login', { replace: true })
  }

  const handleContextSwitch = () => {
    if (currentContext === 'personal' && subscriptionPlan === 'basic') {
      setShowUpgrade(true)
      return
    }
    const newContext = currentContext === 'personal' ? 'business' : 'personal'
    setCurrentContext(newContext)
    toast({
      title: 'Contexto alterado',
      description: `Você está agora na Visão ${newContext === 'business' ? 'Empresarial' : 'Pessoal'}.`,
    })
  }

  const handleUpgrade = () => {
    setSubscriptionPlan('master')
    setShowUpgrade(false)
    setCurrentContext('business')
    toast({
      title: 'Plano Atualizado!',
      description: 'O contexto empresarial foi ativado com sucesso.',
    })
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="md:hidden flex items-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-6 h-6 rounded-md object-contain bg-muted"
              />
            ) : (
              <div className="bg-[#1E3A5F] p-1 rounded-md text-[#2EC4B6]">
                <Waves className="w-4 h-4" />
              </div>
            )}
          </div>

          {currentContext === 'business' && (
            <div className="hidden md:flex items-center ml-2">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 gap-1.5 py-1"
              >
                <Briefcase className="w-3 h-3" /> Fluxo da Empresa
              </Badge>
            </div>
          )}

          <div className="hidden lg:flex relative w-64 xl:w-96 ml-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar transações ou ativos..."
              className="w-full bg-muted/50 pl-9 rounded-full border-none focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                {urgentAlerts > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive animate-pulse-alert" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="p-3 border-b font-semibold text-sm">Central de Notificações</div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Nenhum alerta pendente.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 border-b last:border-0 hover:bg-muted/50 text-sm transition-colors cursor-default"
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-medium truncate">{alert.title}</span>
                        {alert.type === 'urgent' && (
                          <Badge variant="destructive" className="text-[10px] h-4 px-1.5 shrink-0">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between items-center mt-1.5">
                        <span>Venc: {new Date(alert.dueDate).toLocaleDateString('pt-BR')}</span>
                        <span className="font-medium text-foreground">
                          R$ {alert.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary ml-2">
                <AvatarImage
                  src={
                    mainProfile?.avatar ||
                    'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4'
                  }
                  alt="User"
                />
                <AvatarFallback>{mainProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {mainProfile?.name || 'Usuário'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">conta@familia.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleContextSwitch}
                className="cursor-pointer font-medium text-primary focus:text-primary"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>
                  {currentContext === 'personal' ? 'perfil empresarial' : 'perfil pessoal'}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/configuracoes')}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/perfis')} className="cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                <span>
                  {currentContext === 'business' ? 'Perfis de Colaborador' : 'Membros Familiares'}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair da conta</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Funcionalidade Premium
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              O gerenciamento de <strong>Fluxo de Caixa Empresarial</strong> e a separação de
              contextos estão disponíveis apenas para assinantes Premium.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center text-center bg-muted/30 rounded-lg my-2 border border-border/50">
            <Briefcase className="w-12 h-12 text-primary mb-3" />
            <h4 className="font-semibold">Profissionalize suas finanças</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">
              Separe completamente os gastos da sua empresa dos gastos pessoais.
            </p>
          </div>
          <DialogFooter className="sm:justify-between flex-row gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowUpgrade(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-to-r from-primary to-emerald-500 text-white border-0"
            >
              Fazer Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
