import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  Save,
  Bell,
  Palette,
  Users,
  SlidersHorizontal,
  Shield,
  User,
  LogOut,
  CreditCard,
  Lock,
  Building2,
  CodeSquare,
} from 'lucide-react'
import { MOCK_ACCOUNTS, MOCK_PROFILES } from '@/lib/mockData'
import { SecuritySettings } from '../components/settings/SecuritySettings'

export default function Configuracoes() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [notificacoesD2, setNotificacoesD2] = useState(true)
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesSMS, setNotificacoesSMS] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const handleSavePersonalization = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Personalizações salvas', description: 'Nomenclaturas atualizadas.' })
  }

  const handleLogout = () => {
    toast({ title: 'Sessão encerrada', description: 'Você saiu da sua conta.' })
    navigate('/login', { replace: true })
  }

  const mainProfile = (MOCK_PROFILES && MOCK_PROFILES[0]) || {
    id: '0',
    name: 'Admin',
    role: 'Admin',
    limit: 0,
    avatar: '',
  }
  const connectedAccounts = MOCK_ACCOUNTS ? MOCK_ACCOUNTS.filter((a) => a.connected) : []

  const generateSystemState = () => {
    return JSON.stringify(
      {
        calculo_enriquecimento: { tempo_estimado: '8 anos e 2 meses', valor_alvo: 1000000 },
        status_notificacoes: notificacoesD2 ? 'Ativada (D-2)' : 'Desativada',
        tema: theme === 'dark' ? 'Dark Mode' : 'Light Mode',
        api_status: 'Conectado via Open Finance (1/3 inst.)',
        plano_ativo: 'Pro',
        status_pagamento: 'Ativo',
        dashboard_resumo: {
          alertas_d2: 3,
          saude_patrimonio: 'Equilibrado',
          saldo_consolidado: 16950.0,
        },
        contas_cadastradas: MOCK_ACCOUNTS.length,
        cartoes_cadastrados: 2,
        transacoes_mes: 4,
      },
      null,
      2,
    )
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie preferências, notificações e segurança.</p>
      </div>

      <Tabs defaultValue="conta" className="w-full">
        <TabsList className="grid grid-cols-2 md:flex h-auto w-full md:w-auto bg-muted p-1 gap-1 mb-6 flex-wrap">
          <TabsTrigger value="conta" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alertas
          </TabsTrigger>
          <TabsTrigger value="personalizacao" className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conta" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Perfil Principal</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="w-24 h-24 ring-2 ring-primary/20">
                <AvatarImage src={mainProfile.avatar} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold text-lg">{mainProfile.name}</h3>
                <p className="text-sm text-muted-foreground">carlos@familia.com</p>
                <Badge variant="secondary">{mainProfile.role}</Badge>
              </div>
              <Button variant="outline" asChild>
                <Link to="/perfis">Gerenciar Família</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-6">
          <Card className="border-border/50">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span className="text-base">Modo Escuro (Dark Mode)</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Ativa um tema de cores escuras adaptativo.
                  </span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card className="border-border/50">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-d2" className="flex flex-col space-y-1">
                  <span className="text-base">Alertas D-2</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receba avisos 2 dias antes de vencimentos.
                  </span>
                </Label>
                <Switch
                  id="notif-d2"
                  checked={notificacoesD2}
                  onCheckedChange={setNotificacoesD2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalizacao" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Customização do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePersonalization} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nome da Sessão de Ativos</Label>
                    <Input defaultValue="Patrimônio" />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria Padrão (Entradas)</Label>
                    <Input defaultValue="Salário" />
                  </div>
                </div>
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" /> Salvar
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Dev/Diagnostics Output */}
          <Card className="border-dashed border-2 bg-muted/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <CodeSquare className="w-4 h-4" /> Ferramentas de Diagnóstico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" onClick={() => setShowJson(true)}>
                Exportar Estado do Sistema (JSON)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <SecuritySettings />
        </TabsContent>
      </Tabs>

      <Dialog open={showJson} onOpenChange={setShowJson}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estado do Sistema Gerado</DialogTitle>
            <DialogDescription>Snapshot atual para auditoria ou suporte.</DialogDescription>
          </DialogHeader>
          <div className="bg-zinc-950 p-4 rounded-md overflow-auto max-h-[400px]">
            <pre className="text-xs text-green-400 font-mono">{generateSystemState()}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
