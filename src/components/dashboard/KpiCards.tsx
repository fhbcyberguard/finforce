import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, DollarSign, Target } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export default function KpiCards() {
  const { timeframe, selectedYear } = useAppStore()
  const { user } = useAuth()

  const [realAccounts, setRealAccounts] = useState<any[]>([])
  const [realTransactions, setRealTransactions] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const [{ data: accData }, { data: txData }] = await Promise.all([
        supabase.from('accounts').select('balance').eq('user_id', user.id),
        supabase.from('transactions').select('amount, type, date').eq('user_id', user.id),
      ])
      if (accData) setRealAccounts(accData)
      if (txData) setRealTransactions(txData)
    }

    fetchData()

    const accSub = supabase
      .channel('accounts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'accounts', filter: `user_id=eq.${user.id}` },
        fetchData,
      )
      .subscribe()

    const txSub = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        fetchData,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(accSub)
      supabase.removeChannel(txSub)
    }
  }, [user])

  const now = new Date()
  const yearToUse = selectedYear || now.getFullYear().toString()
  const currentMonth = `${yearToUse}-${now.toISOString().slice(5, 7)}`
  const isAnnual = timeframe === 'annual'

  const filteredTransactions = realTransactions.filter((t) => {
    if (isAnnual) return t.date.startsWith(yearToUse)
    return t.date.startsWith(currentMonth)
  })

  // Dynamic values calculated directly from Supabase responses
  const patrimony = realAccounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0)

  const rendaMensal = filteredTransactions
    .filter(
      (t) =>
        t.type !== 'Transfer' &&
        t.type !== 'transfer' &&
        (t.type === 'Revenue' || t.type === 'income' || t.amount > 0),
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const despesaMensal = Math.abs(
    filteredTransactions
      .filter(
        (t) =>
          t.type !== 'Transfer' &&
          t.type !== 'transfer' &&
          (t.type === 'Expense' || t.type === 'expense' || t.amount < 0),
      )
      .reduce((sum, t) => sum + t.amount, 0),
  )

  const resultadoMes = rendaMensal - despesaMensal

  const kpis = [
    {
      title: 'Patrimônio Total',
      value: `R$ ${patrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Wallet,
      color: 'text-[#01f2ff]',
      desc: 'saldo em contas',
    },
    {
      title: isAnnual ? 'Total de Receitas (Ano)' : 'Total de Receitas',
      value: `R$ ${rendaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      desc: isAnnual ? 'entradas no ano' : 'entradas no mês',
    },
    {
      title: isAnnual ? 'Total de Despesas (Ano)' : 'Total de Despesas',
      value: `R$ ${despesaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      desc: isAnnual ? 'saídas no ano' : 'saídas no mês',
    },
    {
      title: isAnnual ? 'Resultado Anual' : 'Resultado do Mês',
      value: `${resultadoMes < 0 ? '-' : ''}R$ ${Math.abs(resultadoMes).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Target,
      color: resultadoMes >= 0 ? 'text-[#01f2ff]' : 'text-rose-500',
      desc: 'sobra livre no caixa',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, i) => (
        <Card
          key={i}
          className="border-border/50 bg-card/50 backdrop-blur shadow-subtle hover:shadow-md transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate mr-2">
              {kpi.title}
            </CardTitle>
            <kpi.icon className={cn('h-4 w-4 shrink-0', kpi.color || 'text-[#016ad9]')} />
          </CardHeader>
          <CardContent>
            <div className={cn('text-xl lg:text-2xl font-bold truncate', kpi.color)}>
              {kpi.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate">
              {kpi.desc}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
