import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, ShoppingCart, RefreshCw, BarChart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ProducerAdmin() {
  const { toast } = useToast()

  const handleSync = () => {
    toast({
      title: 'Sincronizando com Hotmart...',
      description: 'Atualizando status de assinaturas e integrações de webhook.',
    })
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-amber-500 flex items-center gap-2">
          Painel do Produtor
        </h1>
        <p className="text-muted-foreground">
          Gestão de assinantes, planos e integração Hotmart. (Visível apenas para admins).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
              Assinaturas Ativas
              <Users className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,248</div>
            <p className="text-xs text-emerald-500 mt-1">+12% este mês</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
              MRR (Receita Recorrente)
              <BarChart className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 74.5k</div>
            <p className="text-xs text-emerald-500 mt-1">+8% este mês</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex justify-between">
              Status de Integração
              <ShoppingCart className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              >
                Webhook Ativo
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={handleSync}
              variant="secondary"
              className="w-full gap-2 mt-auto"
            >
              <RefreshCw className="w-4 h-4" /> Forçar Sincronização
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Distribuição de Planos</CardTitle>
          <CardDescription>
            Gere cupons e gerencie a liberação de features (Feature Gating).
          </CardDescription>
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
                  <p className="text-xs text-muted-foreground mt-1">Nível de Acesso: N{i + 1}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono font-medium">{Math.floor(800 / (i + 1))} assinantes</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Gerar Cupom
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
