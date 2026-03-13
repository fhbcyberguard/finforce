import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, DollarSign, Clock } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export default function KpiCards() {
  const { assets, transactions } = useAppStore()

  // Derived calculations for KPIs
  const patrimony = assets.reduce((sum, asset) => sum + asset.value, 0)

  // Estimate passive income (roughly 0.8% of yield-bearing assets)
  const passiveIncome = assets
    .filter((a) => a.category === 'FIIs' || a.category === 'Ações' || a.category === 'Renda Fixa')
    .reduce((sum, a) => sum + a.value * 0.008, 0)

  // Sum monthly fixed expenses
  const fixedExpenses =
    Math.abs(
      transactions
        .filter((t) => t.amount < 0 && t.recurrence === 'monthly')
        .reduce((sum, t) => sum + t.amount, 0),
    ) || 4200 // Fallback if none configured

  // Time to freedom calculation (Rule of 300)
  const targetPatrimony = fixedExpenses * 300
  const shortfall = targetPatrimony - patrimony
  const averageMonthlyAporte = 2000 // Assumed average contribution
  const yearsToFreedom = shortfall > 0 ? (shortfall / averageMonthlyAporte / 12).toFixed(1) : '0'

  const kpis = [
    {
      title: 'Patrimônio Total',
      value: `R$ ${patrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      trend: '+2.4%',
      desc: 'vs mês anterior',
    },
    {
      title: 'Renda Passiva Mensal',
      value: `R$ ${passiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      trend: '+5.1%',
      desc: 'estimativa média',
    },
    {
      title: 'Gastos Fixos',
      value: `R$ ${fixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: '-1.2%',
      desc: 'despesas recorrentes',
      trendUpIsBad: true,
    },
    {
      title: 'Tempo p/ Liberdade',
      value: `${yearsToFreedom} Anos`,
      icon: Clock,
      desc: `com aporte de R$${averageMonthlyAporte}`,
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
