import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Save, Bell, Palette, Users, SlidersHorizontal } from 'lucide-react'

export default function Configuracoes() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [notificacoes, setNotificacoes] = useState(true)

  const handleSavePersonalization = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Personalizações salvas',
      description: 'Nomenclaturas de sessões e categorias foram atualizadas.',
    })
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências de interface, notificações e personalizações do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-5 h-5 text-muted-foreground" /> Aparência
            </CardTitle>
            <CardDescription>Ajuste o tema visual do aplicativo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Modo Escuro</span>
                <span className="font-normal text-xs text-muted-foreground max-w-[200px] md:max-w-none">
                  Alternar entre o tema claro e escuro para conforto visual.
                </span>
              </Label>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" /> Notificações
            </CardTitle>
            <CardDescription>Configure como você recebe alertas de vencimentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col space-y-1">
                <span>Status de Notificações (Ativada D-2)</span>
                <span className="font-normal text-xs text-muted-foreground max-w-[200px] md:max-w-none">
                  Receber alertas com 2 dias de antecedência do vencimento.
                </span>
              </Label>
              <Switch
                id="notifications"
                checked={notificacoes}
                onCheckedChange={(checked) => {
                  setNotificacoes(checked)
                  toast({
                    title: checked ? 'Notificações Ativadas' : 'Notificações Desativadas',
                    description: `O envio de alertas D-2 foi ${checked ? 'habilitado' : 'desabilitado'} com sucesso.`,
                  })
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" /> Personalização
            </CardTitle>
            <CardDescription>
              Adapte os nomes das sessões, categorias e tipos de gastos para refletir a realidade da
              sua família.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSavePersonalization} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Sessão Principal</Label>
                  <Input defaultValue="Visão Geral" />
                </div>
                <div className="space-y-2">
                  <Label>Nome da Sessão de Ativos</Label>
                  <Input defaultValue="Patrimônio" />
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
              <Button type="submit" className="mt-4 gap-2">
                <Save className="w-4 h-4" /> Salvar Personalizações
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-secondary/5 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" /> Perfis Familiares
            </CardTitle>
            <CardDescription>
              Navegue até a área de gestão de perfis para adicionar ou editar membros da família,
              papéis de administrador e limites orçamentários.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link to="/perfis">Gerenciar Perfis da Família</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
