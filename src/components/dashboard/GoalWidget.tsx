import { Target, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { MOCK_GOALS } from '@/lib/mockData'

export function GoalWidget() {
  const goals = MOCK_GOALS || []

  return (
    <Card className="h-full border-border/50">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Metas e Sonhos
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="h-8 text-xs gap-1">
            <Link to="/metas">
              Gerenciar <ChevronRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        {goals.slice(0, 2).map((goal) => {
          const percent = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium truncate max-w-[150px]">{goal.name}</span>
                <span className="font-bold text-primary">
                  R$ {goal.currentValue.toLocaleString('pt-BR')}
                </span>
              </div>
              <Progress value={percent} className="h-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wide">
                <span>{percent.toFixed(1)}% alcançado</span>
                <span>Alvo: R$ {goal.targetValue.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          )
        })}
        {goals.length === 0 && (
          <div className="text-center p-4 text-sm text-muted-foreground border border-dashed rounded-md">
            Nenhuma meta cadastrada.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
