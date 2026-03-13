import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, ShoppingCart, RefreshCw, BarChart, LifeBuoy, Mail, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { MOCK_TICKETS } from '@/lib/mockData'

export default function ProducerAdmin() {
  const { toast } = useToast()
  const [smtpTLS, setSmtpTLS] = useState(true)

  // Implementation of zero-state logic for active subscriptions
  const [activeSubscriptions] = useState<any[]>([])
  const activeSubscriptionsCount = activeSubscriptions.length

  const handleSync = () =>
    toast({ title: 'Sincronizando com Hotmart...', description: 'Atualizando status.' })
  const handleSaveSMTP = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Configuração Salva', description: 'Notificações usarão este provedor.' })
  }
  const handleTestConnection = () =>
    toast({ title: 'Testando Conexão', description: 'E-mail de teste enviado.' })

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-amber-500">
          Painel do Produtor
        </h1>
        <p className="text-muted-foreground">Gestão SaaS: Assinantes, Planos, SMTP e Suporte.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto w-full mb-6">
          <TabsTrigger value="overview" className="flex gap-2">
            <BarChart className="w-4 h-4" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex gap-2">
            <ShoppingCart className="w-4 h-4" /> Planos & Cupons
          </TabsTrigger>
          <TabsTrigger value="smtp" className="flex gap-2">
            <Mail className="w-4 h-4" /> SMTP & Alertas
          </TabsTrigger>
          <TabsTrigger value="support" className="flex gap-2">
            <LifeBuoy className="w-4 h-4" /> Suporte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex justify-between">
                  Assinaturas Ativas <Users className="w-4 h-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{activeSubscriptionsCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Nenhum dado ativo sincronizado</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex justify-between">
                  MRR Bruto <BarChart className="w-4 h-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ 0.00</div>
                <p className="text-xs text-muted-foreground mt-1">Aguardando dados</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary flex justify-between">
                  Integração Hotmart <RefreshCw className="w-4 h-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 w-max"
                >
                  Webhook Ativo
                </Badge>
                <Button
                  size="sm"
                  onClick={handleSync}
                  variant="secondary"
                  className="w-full mt-auto"
                >
                  Sincronizar Agora
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Planos e Permissões</CardTitle>
              <CardDescription>Gere cupons e restrinja acesso a funcionalidades.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Básico (R$ 29)', 'Pro (R$ 59)', 'Família (R$ 99)'].map((plan, i) => (
                  <div
                    key={plan}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
                  >
                    <div>
                      <h4 className="font-semibold">{plan}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Nível: N{i + 1}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-mono font-medium">0 usuários</p>
                      <Button variant="outline" size="sm">
                        Gerar Cupom
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Configuração SMTP</CardTitle>
              <CardDescription>
                Servidor para envio de Alertas D-2 e recup. de senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSMTP} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Servidor (Host)</Label>
                    <Input required />
                  </div>
                  <div className="space-y-2">
                    <Label>Porta</Label>
                    <Input type="number" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Usuário</Label>
                    <Input required />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input type="password" required />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <span className="text-sm font-medium">Usar Autenticação TLS</span>
                  <Switch checked={smtpTLS} onCheckedChange={setSmtpTLS} />
                </div>
                <div className="flex gap-4 pt-4 border-t border-border/50">
                  <Button type="button" variant="outline" onClick={handleTestConnection}>
                    <Send className="w-4 h-4 mr-2" /> Testar Conexão
                  </Button>
                  <Button type="submit">Salvar Configurações</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Tickets de Suporte</CardTitle>
              <CardDescription>Histórico de interações com os usuários.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TICKETS.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell>{t.user}</TableCell>
                      <TableCell>{t.subject}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            t.status === 'Resolvido'
                              ? 'secondary'
                              : t.status === 'Aberto'
                                ? 'destructive'
                                : 'default'
                          }
                          className="text-[10px]"
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {t.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
