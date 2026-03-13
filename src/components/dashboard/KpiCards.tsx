import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, DollarSign, Clock, Coins } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export default function KpiCards() {
  const { assets, transactions, timeframe } = useAppStore()

  const now = new Date()
  const currentMonth = now.toISOString().slice(0, 7)
  const currentYear = now.toISOString().slice(0, 4)
  const isAnnual = timeframe === 'annual'

  const filteredTransactions = transactions.filter((t) => {
    if (isAnnual) return t.date.startsWith(currentYear)
    return t.date.startsWith(currentMonth)
  })

  // Derived calculations for KPIs
  const patrimony = assets.reduce((sum, asset) => sum + asset.value, 0)

  // Estimate passive income (roughly 0.8% of yield-bearing assets)
  const passiveIncome = assets
    .filter((a) => a.category === 'FIIs' || a.category === 'Ações' || a.category === 'Renda Fixa')
    .reduce((sum, a) => sum + a.value * 0.008, 0)

  // Real-time calculated income
  const rendaMensal = filteredTransactions
    .filter((t) => t.type === 'Revenue')
    .reduce((sum, t) => sum + t.amount, 0)

  // Sum fixed expenses based on explicitly marked transactions or recurrences
  const fixedExpenses = Math.abs(
    filteredTransactions
      .filter(
        (t) =>
          t.amount < 0 &&
          (t.expenseType === 'fixed' || t.recurrence === 'monthly' || t.recurrence === 'yearly'),
      )
      .reduce((sum, t) => sum + t.amount, 0),
  )

  // Time to freedom calculation
  const monthlyFixedExpenses = isAnnual ? fixedExpenses / 12 || 4200 : fixedExpenses || 4200
  const targetPatrimony = monthlyFixedExpenses * 300 // Rule of 300 for monthly FI
  const shortfall = targetPatrimony - patrimony
  const averageMonthlyAporte = 2000 // Assumed average contribution
  const yearsToFreedom = shortfall > 0 ? (shortfall / averageMonthlyAporte / 12).toFixed(1) : '0'

  const kpis = [
    {
      title: 'Patrimônio Total',
      value: `R$ ${patrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      trend: '+2.4%',
      desc: 'vs anterior',
    },
    {
      title: isAnnual ? 'Renda Anual' : 'Renda Mensal',
      value: `R$ ${rendaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Coins,
      trend: '+5.1%',
      desc: isAnnual ? 'entradas no ano' : 'entradas no mês',
    },
    {
      title: 'Renda Passiva Mensal',
      value: `R$ ${passiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      trend: '+1.5%',
      desc: 'estimativa média',
    },
    {
      title: isAnnual ? 'Gastos Fixos (Ano)' : 'Gastos Fixos',
      value: `R$ ${fixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: '-1.2%',
      desc: 'despesas essenciais',
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
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
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
