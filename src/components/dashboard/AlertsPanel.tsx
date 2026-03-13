import { MOCK_ALERTS } from '@/lib/mockData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Calendar } from 'lucide-react'

export default function AlertsPanel() {
  const alerts = MOCK_ALERTS || []

  const formatDays = (date: Date) => {
    const diffTime = date.getTime() - Date.now()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return 'Vence hoje'
    if (diffDays === 1) return 'Vence amanhã'
    if (diffDays === 2) return 'Vence em 2 dias (D-2)'
    return `Vence em ${diffDays} dias`
  }

  return (
    <Card className="h-full border-border/50">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Alertas e Vencimentos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhum alerta pendente. Tudo em dia!
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
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <span className="font-mono text-sm font-bold text-foreground">
                      R$ {alert.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className={isUrgent ? 'text-destructive' : ''}>
                        {formatDays(alert.dueDate)}
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
