import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, DollarSign, Activity, Target } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export default function KpiCards() {
  const { assets, accounts, transactions, timeframe, selectedYear } = useAppStore()

  const now = new Date()
  const yearToUse = selectedYear || now.getFullYear().toString()
  const currentMonth = `${yearToUse}-${now.toISOString().slice(5, 7)}`
  const isAnnual = timeframe === 'annual'

  const filteredTransactions = transactions.filter((t) => {
    if (isAnnual) return t.date.startsWith(yearToUse)
    return t.date.startsWith(currentMonth)
  })

  // Derived calculations for KPIs
  const patrimony =
    assets.reduce((sum, asset) => sum + asset.value, 0) +
    accounts.reduce((sum, acc) => sum + acc.balance, 0)

  // Real-time calculated income
  const rendaMensal = filteredTransactions
    .filter((t) => t.type === 'Revenue' || t.category.includes('Renda'))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  // Sum fixed expenses based on explicitly marked transactions or recurrences
  const fixedExpenses = Math.abs(
    filteredTransactions
      .filter(
        (t) =>
          !(t.type === 'Revenue' || t.category.includes('Renda')) &&
          t.amount < 0 &&
          t.type !== 'Transfer' &&
          (t.expenseType === 'fixed' || t.recurrence === 'monthly' || t.recurrence === 'yearly'),
      )
      .reduce((sum, t) => sum + t.amount, 0),
  )

  const variableExpenses = Math.abs(
    filteredTransactions
      .filter(
        (t) =>
          !(t.type === 'Revenue' || t.category.includes('Renda')) &&
          t.amount < 0 &&
          t.type !== 'Transfer' &&
          t.expenseType !== 'fixed' &&
          t.recurrence !== 'monthly' &&
          t.recurrence !== 'yearly',
      )
      .reduce((sum, t) => sum + t.amount, 0),
  )

  // Monthly Result = Revenue - Fixed - Variable
  const resultadoMes = rendaMensal - fixedExpenses - variableExpenses

  const kpis = [
    {
      title: 'Patrimônio Total',
      value: `R$ ${patrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      trend: '+2.4%',
      desc: 'vs anterior',
    },
    {
      title: isAnnual ? 'Renda Anual' : 'Receita Mensal',
      value: `R$ ${rendaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      trend: '+5.1%',
      desc: isAnnual ? 'entradas no ano' : 'entradas no mês',
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
      title: isAnnual ? 'Gastos Variáveis (Ano)' : 'Gastos Variáveis',
      value: `R$ ${variableExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Activity,
      trend: '+3.5%',
      desc: 'estilo de vida',
      trendUpIsBad: true,
    },
    {
      title: isAnnual ? 'Resultado Anual' : 'Resultado do Mês',
      value: `${resultadoMes < 0 ? '-' : ''}R$ ${Math.abs(resultadoMes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Target,
      color: resultadoMes >= 0 ? 'text-[#03f2ff]' : 'text-rose-500',
      desc: 'sobra livre no caixa',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {kpis.map((kpi, i) => (
        <Card
          key={i}
          className="border-border/50 bg-card/50 backdrop-blur shadow-subtle hover:shadow-md transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate mr-2">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl lg:text-2xl font-bold truncate ${kpi.color || ''}`}>
              {kpi.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate">
              {kpi.trend && (
                <span
                  className={
                    kpi.trend.startsWith('+') && !kpi.trendUpIsBad
                      ? 'text-[#03f2ff]'
                      : kpi.trend.startsWith('-') && kpi.trendUpIsBad
                        ? 'text-[#03f2ff]'
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
