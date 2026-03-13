import { useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PieChart, AlertCircle } from 'lucide-react'

export default function Orcamento() {
  const { profiles, transactions, selectedYear, timeframe } = useAppStore()

  const profileSpending = useMemo(() => {
    const now = new Date()
    const yearToUse = selectedYear || now.getFullYear().toString()
    const currentMonth = `${yearToUse}-${now.toISOString().slice(5, 7)}`

    const currentExpenses = transactions.filter((t) => {
      // Exclude gains and transfers from budget calculation
      if (t.amount >= 0 || t.type === 'Transfer') return false
      if (timeframe === 'annual') return t.date.startsWith(yearToUse)
      return t.date.startsWith(currentMonth)
    })

    return profiles.map((profile) => {
      const spent = currentExpenses
        .filter((t) => t.profile === profile.name)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      const limit = timeframe === 'annual' ? profile.limit * 12 : profile.limit
      const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0

      return { ...profile, spent, limit, percent }
    })
  }, [profiles, transactions, selectedYear, timeframe])

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#03f2ff]">Orçamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe os limites de gastos definidos para cada membro.
        </p>
      </div>

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
                    R$ {p.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / R$ {p.limit.toLocaleString('pt-BR')}
                  </span>
                </div>
                <Progress
                  value={p.percent}
                  className="h-3 bg-muted"
                  indicatorClassName={p.percent > 90 ? 'bg-destructive' : 'bg-[#03f2ff]'}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{p.percent.toFixed(1)}% utilizado</p>
                  {p.percent >= 100 && (
                    <span className="text-[10px] flex items-center gap-1 text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded-full animate-pulse">
                      <AlertCircle className="w-3 h-3" /> Limite Excedido
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {profileSpending.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/10 border border-dashed rounded-lg">
            Nenhum perfil cadastrado para acompanhamento de orçamento.
          </div>
        )}
      </div>
    </div>
  )
}
