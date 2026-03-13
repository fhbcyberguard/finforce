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
} from 'lucide-react'
import { MOCK_ACCOUNTS, MOCK_PROFILES } from '@/lib/mockData'

export default function Configuracoes() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [notificacoesD2, setNotificacoesD2] = useState(true)
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesSMS, setNotificacoesSMS] = useState(false)

  const handleSavePersonalization = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Personalizações salvas',
      description: 'As nomenclaturas foram atualizadas com sucesso em todo o sistema.',
    })
  }

  const handleLogout = () => {
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu da sua conta com sucesso.',
    })
    navigate('/', { replace: true })
  }

  const handleRemoveCard = () => {
    toast({
      title: 'Cartão removido',
      description: 'O cartão foi removido da sua carteira virtual.',
    })
  }

  const mainProfile = MOCK_PROFILES[0]

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências de interface, notificações e segurança da conta.
        </p>
      </div>

      <Tabs defaultValue="conta" className="w-full">
        <TabsList className="grid grid-cols-2 md:flex h-auto w-full md:w-auto bg-muted p-1 gap-1 mb-6">
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
            Personalizar
          </TabsTrigger>
          <TabsTrigger
            value="seguranca"
            className="col-span-2 md:col-span-1 flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conta" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" /> Perfil Principal
              </CardTitle>
              <CardDescription>Informações da sua conta de administrador.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 ring-2 ring-primary/20">
                <AvatarImage src={mainProfile.avatar} />
                <AvatarFallback>{mainProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <div className="grid gap-1">
                  <h3 className="font-semibold text-lg">{mainProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">carlos@familia.com</p>
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                    {mainProfile.role}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full md:w-auto" asChild>
                <Link to="/perfis">
                  <Users className="w-4 h-4 mr-2" /> Gerenciar Família
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Encerrar Sessão</CardTitle>
              <CardDescription>
                Desconecte-se deste dispositivo. Você precisará de sua senha para acessar novamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-muted-foreground" /> Tema Visual
              </CardTitle>
              <CardDescription>
                Ajuste como a interface é exibida no seu dispositivo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span className="text-base">Modo Escuro</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Ativa um tema de cores escuras, ideal para ambientes com pouca luz.
                  </span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? 'dark' : 'light')
                    toast({
                      title: 'Tema atualizado',
                      description: `Modo ${checked ? 'escuro' : 'claro'} ativado.`,
                    })
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-muted-foreground" /> Alertas e Vencimentos
              </CardTitle>
              <CardDescription>Configure como e quando você quer ser avisado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Label htmlFor="notif-d2" className="flex flex-col space-y-1">
                  <span className="text-base">Alertas Antecipados (D-2)</span>
                  <span className="font-normal text-sm text-muted-foreground max-w-lg">
                    Receba avisos 2 dias antes do vencimento de contas e faturas de cartão.
                  </span>
                </Label>
                <Switch
                  id="notif-d2"
                  checked={notificacoesD2}
                  onCheckedChange={(checked) => {
                    setNotificacoesD2(checked)
                    toast({
                      title: checked ? 'Alertas ativados' : 'Alertas desativados',
                      description: 'A configuração de alertas D-2 foi atualizada.',
                    })
                  }}
                />
              </div>

              <div className="h-px bg-border" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Label htmlFor="notif-email" className="flex flex-col space-y-1">
                  <span className="text-base">Resumo Semanal por E-mail</span>
                  <span className="font-normal text-sm text-muted-foreground max-w-lg">
                    Receba um boletim todo domingo com o balanço da semana e contas dos próximos 7
                    dias.
                  </span>
                </Label>
                <Switch
                  id="notif-email"
                  checked={notificacoesEmail}
                  onCheckedChange={(checked) => {
                    setNotificacoesEmail(checked)
                    toast({
                      title: 'Preferência de e-mail salva',
                      description: checked
                        ? 'Você receberá os resumos semanais.'
                        : 'Você não receberá mais os resumos.',
                    })
                  }}
                />
              </div>

              <div className="h-px bg-border" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Label htmlFor="notif-sms" className="flex flex-col space-y-1">
                  <span className="text-base">Alertas SMS Urgentes</span>
                  <span className="font-normal text-sm text-muted-foreground max-w-lg">
                    Para contas que vencem no dia e ainda não constam como pagas.
                  </span>
                </Label>
                <Switch
                  id="notif-sms"
                  checked={notificacoesSMS}
                  onCheckedChange={(checked) => {
                    setNotificacoesSMS(checked)
                    toast({
                      title: 'Preferência de SMS atualizada',
                      description: 'Sua configuração para alertas urgentes foi salva.',
                    })
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalizacao" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-muted-foreground" /> Vocabulário do
                Sistema
              </CardTitle>
              <CardDescription>
                Adapte as nomenclaturas para refletir a maneira como sua família lida com as
                finanças.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePersonalization} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nome da Sessão Principal</Label>
                    <Input defaultValue="Visão Geral" />
                    <p className="text-xs text-muted-foreground">Ex: Dashboard, Resumo, Painel</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Nome da Sessão de Ativos</Label>
                    <Input defaultValue="Patrimônio" />
                    <p className="text-xs text-muted-foreground">
                      Ex: Investimentos, Minha Riqueza
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria Padrão (Entradas)</Label>
                    <Input defaultValue="Salário" />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria Padrão (Saídas)</Label>
                    <Input defaultValue="Moradia" />
                  </div>
                </div>
                <Button type="submit" className="gap-2 w-full md:w-auto">
                  <Save className="w-4 h-4" /> Salvar Personalizações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" /> Conexões Bancárias
                </CardTitle>
                <CardDescription>
                  Instituições com acesso permitido via Open Finance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_ACCOUNTS.filter((a) => a.connected).map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div>
                      <p className="font-medium">{acc.bank}</p>
                      <p className="text-xs text-muted-foreground">
                        Acesso: Leitura de transações e saldo
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                      <Shield className="w-4 h-4" /> Ativo
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contas">Gerenciar Conexões</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" /> Cartões Salvos
                </CardTitle>
                <CardDescription>
                  Métodos de pagamento vinculados para acompanhamento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Mastercard Black</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Termina em 4321
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleRemoveCard}
                  >
                    Remover
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Visa Infinite</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Termina em 9876
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleRemoveCard}
                  >
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
