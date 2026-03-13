import { useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PieChart, AlertCircle, Wallet, TrendingUp, TrendingDown } from 'lucide-react'

export default function Orcamento() {
  const { profiles, transactions, selectedYear, selectedMonth, timeframe, currentContext } =
    useAppStore()

  const { overallBudget, profileSpending } = useMemo(() => {
    const now = new Date()
    const yearToUse = selectedYear || now.getFullYear().toString()
    const currentMonth = `${yearToUse}-${(selectedMonth + 1).toString().padStart(2, '0')}`

    const currentTx = transactions.filter((t) => {
      // Ignore internal transfers for budget calculation
      if (t.type === 'Transfer') return false
      if (timeframe === 'annual') return t.date.startsWith(yearToUse)
      return t.date.startsWith(currentMonth)
    })

    const calcBudget = (txs: typeof currentTx) => {
      const income = txs
        .filter((t) => t.amount > 0 || t.type === 'Revenue' || t.category.includes('Renda'))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      const spent = txs
        .filter((t) => t.amount < 0 && t.type !== 'Revenue' && !t.category.includes('Renda'))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      const balance = income - spent
      const percent = income > 0 ? (spent / income) * 100 : spent > 0 ? 100 : 0

      return { income, spent, balance, percent: Math.min(percent, 100) }
    }

    const overallBudget = calcBudget(currentTx)

    const profileSpending = profiles
      .map((profile) => {
        const pTxs = currentTx.filter((t) => t.profile === profile.name || t.profile === profile.id)
        const stats = calcBudget(pTxs)
        return { ...profile, ...stats }
      })
      .filter((p) => p.income > 0 || p.spent > 0) // Only show profiles with activity

    // Handle unassigned transactions if any
    const unassignedTxs = currentTx.filter((t) => !t.profile)
    if (unassignedTxs.length > 0) {
      const stats = calcBudget(unassignedTxs)
      if (stats.income > 0 || stats.spent > 0) {
        profileSpending.push({
          id: 'unassigned',
          name: 'Não atribuído',
          role: '',
          limit: 0,
          ...stats,
        } as any)
      }
    }

    return { overallBudget, profileSpending }
  }, [profiles, transactions, selectedYear, selectedMonth, timeframe])

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#03f2ff]">
          Orçamentos e Saldos
        </h1>
        <p className="text-muted-foreground">
          Acompanhe o orçamento dinâmico calculado com base nas receitas e despesas.
        </p>
      </div>

      <Card className="border-border/50 border-l-4 border-l-[#03f2ff] bg-muted/10 shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#03f2ff]" />
            Orçamento Total ({currentContext === 'business' ? 'Empresa' : 'Família'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold">
                  R$ {overallBudget.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-muted-foreground font-medium">Saldo Disponível</span>
              </div>
              <Progress
                value={overallBudget.percent}
                className="h-3 bg-background border border-border/50"
                indicatorClassName={overallBudget.percent > 90 ? 'bg-destructive' : 'bg-[#03f2ff]'}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground font-medium">
                  {overallBudget.percent.toFixed(1)}% das receitas utilizado
                </p>
                {overallBudget.balance < 0 && (
                  <span className="text-[10px] flex items-center gap-1 text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded-full animate-pulse">
                    <AlertCircle className="w-3 h-3" /> Déficit
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-6 md:gap-8 flex-wrap bg-background/50 p-4 rounded-lg border border-border/50">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Receitas
                </p>
                <p className="font-bold text-emerald-500 text-lg">
                  R$ {overallBudget.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Despesas
                </p>
                <p className="font-bold text-rose-500 text-lg">
                  R$ {overallBudget.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileSpending.map((p) => (
          <Card
            key={p.id}
            className="border-border/50 hover:border-[#03f2ff]/50 transition-colors group"
          >
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">{p.name}</CardTitle>
              <PieChart className="w-5 h-5 text-[#03f2ff] opacity-70 group-hover:opacity-100 transition-opacity" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">
                    R$ {p.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-xs text-muted-foreground flex flex-col items-end font-medium">
                    <span className="text-emerald-500">
                      + R$ {p.income.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-rose-500">
                      - R$ {p.spent.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                <Progress
                  value={p.percent}
                  className="h-2 bg-muted"
                  indicatorClassName={p.percent > 90 ? 'bg-destructive' : 'bg-[#03f2ff]'}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{p.percent.toFixed(1)}% utilizado</p>
                  {p.balance < 0 && (
                    <span className="text-[10px] flex items-center gap-1 text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded-full animate-pulse">
                      <AlertCircle className="w-3 h-3" /> Negativo
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {profileSpending.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/10 border border-dashed rounded-lg">
            Nenhuma movimentação para calcular orçamentos no período selecionado.
          </div>
        )}
      </div>
    </div>
  )
}
