import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, DollarSign, Clock } from 'lucide-react'

export default function KpiCards() {
  const kpis = [
    {
      title: 'Patrimônio Total',
      value: 'R$ 342.500',
      icon: Wallet,
      trend: '+2.4%',
      desc: 'vs mês anterior',
    },
    {
      title: 'Renda Passiva Mensal',
      value: 'R$ 1.850',
      icon: TrendingUp,
      trend: '+5.1%',
      desc: 'vs mês anterior',
    },
    {
      title: 'Gastos Fixos',
      value: 'R$ 4.200',
      icon: DollarSign,
      trend: '-1.2%',
      desc: 'vs mês anterior',
      trendUpIsBad: true,
    },
    {
      title: 'Tempo p/ Liberdade',
      value: '8.5 Anos',
      icon: Clock,
      desc: 'Considerando aporte atual',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, i) => (
        <Card
          key={i}
          className="border-border/50 bg-card/50 backdrop-blur shadow-subtle hover:shadow-md transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {kpi.trend && (
                <span
                  className={
                    kpi.trend.startsWith('+') && !kpi.trendUpIsBad
                      ? 'text-emerald-500'
                      : kpi.trend.startsWith('-') && kpi.trendUpIsBad
                        ? 'text-emerald-500'
                        : 'text-rose-500'
                  }
                >
                  {kpi.trend}
                </span>
              )}
              {kpi.desc}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
