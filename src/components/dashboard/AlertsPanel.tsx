import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Calendar, ShieldCheck, CreditCard } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export default function AlertsPanel() {
  const { creditCards, accounts } = useAppStore()

  const hasAccountsOrCards = accounts.length > 0 || creditCards.length > 0

  const alerts = useMemo(() => {
    const generatedAlerts: any[] = []
    const today = new Date()
    const currentDay = today.getDate()

    creditCards.forEach((card) => {
      if (card.dueDate) {
        const dueDay = Number(card.dueDate)
        let diffDays = dueDay - currentDay

        if (diffDays < 0) {
          // If past this month, we skip it for simplicity
          return
        }

        if (diffDays <= 15) {
          const date = new Date(today.getFullYear(), today.getMonth(), dueDay)
          generatedAlerts.push({
            id: card.id,
            title: `Fatura: ${card.name || card.bank}`,
            dateStr: date.toISOString(),
            type: diffDays <= 5 ? 'urgent' : 'normal',
            diffDays,
          })
        }
      }
    })

    return generatedAlerts.sort((a, b) => a.diffDays - b.diffDays)
  }, [creditCards])

  const formatDays = (diffDays: number) => {
    if (diffDays === 0) return 'Vence hoje'
    if (diffDays === 1) return 'Vence amanhã'
    if (diffDays === 2) return 'Vence em 2 dias (D-2)'
    return `Vence em ${diffDays} dias`
  }

  if (!hasAccountsOrCards) {
    return (
      <Card className="h-full border-border/50 opacity-60">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-5 h-5" />
            Alerta de Vencimentos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center h-[200px] gap-3">
            <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
            <p>Nenhuma conta ou cartão vinculado.</p>
            <p className="text-xs">
              Cadastre contas e cartões para ativar o monitoramento inteligente de faturas.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-border/50">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Alerta de Vencimentos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40 max-h-[300px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhum vencimento para os próximos dias.
            </div>
          ) : (
            alerts.map((alert) => {
              const isUrgent = alert.type === 'urgent'
              return (
                <div
                  key={alert.id}
                  className={`p-4 transition-colors hover:bg-muted/30 ${isUrgent ? 'border-l-4 border-l-destructive bg-destructive/5' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`font-semibold text-sm flex items-center gap-2 ${isUrgent ? 'text-destructive' : 'text-foreground'}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      {alert.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className={isUrgent ? 'text-destructive' : ''}>
                        {formatDays(alert.diffDays)}
                      </span>
                    </div>
                    {isUrgent && (
                      <Badge variant="destructive" className="h-5 text-[10px] px-1.5 animate-pulse">
                        Atenção
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
