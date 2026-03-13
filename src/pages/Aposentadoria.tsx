import { useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Target, TrendingUp, Calendar } from 'lucide-react'

export default function Aposentadoria() {
  const { goals } = useAppStore()

  const retirementGoals = useMemo(() => {
    return goals.filter((g) => {
      const name = g.name.toLowerCase()
      return (
        name.includes('aposentadoria') ||
        name.includes('independência') ||
        name.includes('independencia') ||
        name.includes('liberdade') ||
        name.includes('longo prazo')
      )
    })
  }, [goals])

  return (
    <div className="space-y-6 animate-slide-in-up pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
          Plano de Aposentadoria
        </h1>
        <p className="text-muted-foreground">
          Monitore suas metas de longo prazo e garanta sua independência financeira.
        </p>
      </div>

      {retirementGoals.length === 0 ? (
        <Card className="border-border/50 bg-muted/10 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum plano de aposentadoria encontrado</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Crie uma meta com o nome "Aposentadoria" ou "Independência Financeira" na página de
              Metas para acompanhá-la aqui.
            </p>
            <Button asChild>
              <Link to="/metas">Criar Plano de Aposentadoria</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {retirementGoals.map((goal) => {
            const percent = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0
            const dateStr = goal.targetDate
              ? new Date(goal.targetDate).toLocaleDateString('pt-BR')
              : 'Sem data'

            return (
              <Card
                key={goal.id}
                className="border-border/50 hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {goal.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso do Patrimônio</span>
                      <span className="font-bold">{percent.toFixed(1)}%</span>
                    </div>
                    <Progress value={percent} className="h-3" />
                    <div className="flex justify-between text-sm pt-1">
                      <span className="font-semibold text-primary">
                        R$ {goal.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-muted-foreground">
                        Alvo: R${' '}
                        {goal.targetValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Data Alvo
                      </span>
                      <p className="font-medium">{dateStr}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" /> Aporte Mensal
                      </span>
                      <p className="font-medium text-emerald-500">
                        R${' '}
                        {goal.monthlyDeposit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
