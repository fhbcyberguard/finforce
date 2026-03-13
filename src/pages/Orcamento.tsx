import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'
import { supabase } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { PieChart, AlertCircle, Wallet, TrendingUp, TrendingDown } from 'lucide-react'

export default function Orcamento() {
  const { user } = useAuth()
  const { isSyncing, profiles, selectedYear, selectedMonth, timeframe, currentContext } =
    useAppStore()

  const [loading, setLoading] = useState(true)
  const [overallBudget, setOverallBudget] = useState({
    income: 0,
    spent: 0,
    balance: 0,
    percent: 0,
  })
  const [profileSpending, setProfileSpending] = useState<any[]>([])

  useEffect(() => {
    async function fetchBudget() {
      if (!user || isSyncing) return
      setLoading(true)

      const year = selectedYear || new Date().getFullYear().toString()
      const monthStr = (selectedMonth + 1).toString().padStart(2, '0')

      let startDate, endDate
      if (timeframe === 'annual') {
        startDate = `${year}-01-01`
        endDate = `${year}-12-31`
      } else {
        startDate = `${year}-${monthStr}-01`
        const lastDay = new Date(Number(year), selectedMonth + 1, 0).getDate()
        endDate = `${year}-${monthStr}-${lastDay}`
      }

      const { data: txs } = await supabase
        .from('transactions')
        .select('amount, type, category, profile, context')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)

      const filtered = (txs || []).filter(
        (t) => t.context === currentContext && t.type !== 'Transfer',
      )

      const calcBudget = (tList: any[]) => {
        const income = tList
          .filter((t) => t.amount > 0 || t.type === 'Revenue' || t.category.includes('Renda'))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        const spent = tList
          .filter((t) => t.amount < 0 && t.type !== 'Revenue' && !t.category.includes('Renda'))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        const balance = income - spent
        const percent = income > 0 ? (spent / income) * 100 : spent > 0 ? 100 : 0

        return { income, spent, balance, percent: Math.min(percent, 100) }
      }

      setOverallBudget(calcBudget(filtered))

      const pSpending = profiles
        .map((p) => {
          const pTxs = filtered.filter((t) => t.profile === p.name || t.profile === p.id)
          const stats = calcBudget(pTxs)
          return { ...p, ...stats }
        })
        .filter((p) => p.income > 0 || p.spent > 0)

      const unassignedTxs = filtered.filter((t) => !t.profile || t.profile === 'none')
      if (unassignedTxs.length > 0) {
        const stats = calcBudget(unassignedTxs)
        if (stats.income > 0 || stats.spent > 0) {
          pSpending.push({ id: 'unassigned', name: 'Não atribuído', role: '', limit: 0, ...stats })
        }
      }

      setProfileSpending(pSpending)
      setLoading(false)
    }

    fetchBudget()
  }, [user, isSyncing, selectedYear, selectedMonth, timeframe, currentContext, profiles])

  if (isSyncing || loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[150px] w-full rounded-xl" />
          <Skeleton className="h-[150px] w-full rounded-xl" />
          <Skeleton className="h-[150px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

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
