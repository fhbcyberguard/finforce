import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAppStore from '@/stores/useAppStore'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'

const calculateMetrics = (transactions: any[], period: string) => {
  const periodTx = transactions.filter((t) => t.date.startsWith(period))

  const income = periodTx
    .filter((t) => t.type === 'Revenue' || t.category.includes('Renda'))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const expenses = Math.abs(
    periodTx
      .filter(
        (t) =>
          !(t.type === 'Revenue' || t.category.includes('Renda')) &&
          t.amount < 0 &&
          t.type !== 'Transfer',
      )
      .reduce((sum, t) => sum + t.amount, 0),
  )

  const balance = income - expenses

  return { income, expenses, balance }
}

export function HistoricalComparison() {
  const { transactions } = useAppStore()

  const availablePeriods = useMemo(() => {
    const periods = new Set<string>()
    transactions.forEach((t) => {
      periods.add(t.date.substring(0, 7))
    })
    const now = new Date()
    periods.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

    return Array.from(periods).sort((a, b) => b.localeCompare(a))
  }, [transactions])

  const [periodA, setPeriodA] = useState(availablePeriods[0] || '')
  const [periodB, setPeriodB] = useState(availablePeriods[1] || availablePeriods[0] || '')

  const formatPeriod = (p: string) => {
    if (!p) return ''
    const [year, month] = p.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    const str = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const metricsA = useMemo(() => calculateMetrics(transactions, periodA), [transactions, periodA])
  const metricsB = useMemo(() => calculateMetrics(transactions, periodB), [transactions, periodB])

  const renderComparison = (label: string, valA: number, valB: number, invertGoodBad = false) => {
    const diff = valA - valB
    const percent = valB !== 0 ? (diff / Math.abs(valB)) * 100 : valA > 0 ? 100 : 0

    const isPositive = diff > 0
    const isNeutral = diff === 0

    const isGood = invertGoodBad ? diff < 0 : diff > 0

    return (
      <div className="flex flex-col p-4 bg-muted/20 rounded-lg border border-border/50">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">{formatPeriod(periodA)}</div>
            <div className="font-semibold text-lg truncate">
              R${' '}
              {valA.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">{formatPeriod(periodB)}</div>
            <div className="font-medium text-muted-foreground truncate">
              R${' '}
              {valB.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm pt-3 border-t border-border/50">
          <span className="text-muted-foreground shrink-0">Variação:</span>
          {isNeutral ? (
            <span className="flex items-center text-muted-foreground">
              <MinusIcon className="w-4 h-4 mr-1" /> 0%
            </span>
          ) : (
            <span
              className={`flex flex-wrap items-center font-medium ${isGood ? 'text-[#03f2ff]' : 'text-rose-500'}`}
            >
              {isPositive ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              {Math.abs(percent).toFixed(1)}%
              <span className="ml-1 text-xs opacity-80">
                (R${' '}
                {Math.abs(diff).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                )
              </span>
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur shadow-subtle relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <CardHeader className="pb-4 border-b border-border/30">
        <CardTitle className="text-lg">Comparação de Períodos</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Período A (Atual)
            </label>
            <Select value={periodA} onValueChange={setPeriodA}>
              <SelectTrigger className="bg-background/50 h-10">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {availablePeriods.map((p) => (
                  <SelectItem key={p} value={p}>
                    {formatPeriod(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:flex items-center justify-center pt-6 text-muted-foreground/50">
            vs
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Período B (Referência)
            </label>
            <Select value={periodB} onValueChange={setPeriodB}>
              <SelectTrigger className="bg-background/50 h-10">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {availablePeriods.map((p) => (
                  <SelectItem key={p} value={p}>
                    {formatPeriod(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {renderComparison('Receitas', metricsA.income, metricsB.income)}
          {renderComparison('Despesas', metricsA.expenses, metricsB.expenses, true)}
          {renderComparison('Saldo Líquido', metricsA.balance, metricsB.balance)}
        </div>
      </CardContent>
    </Card>
  )
}
