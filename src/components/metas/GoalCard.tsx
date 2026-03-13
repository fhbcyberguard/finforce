import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar as CalIcon, Edit2, Trash2 } from 'lucide-react'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { Goal } from '@/stores/useAppStore'
import { format } from 'date-fns'
import { AreaChart, Area, ReferenceLine, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export function GoalCard({
  goal,
  currentAge,
  onEdit,
  onDelete,
}: {
  goal: Goal
  currentAge: number
  onEdit: () => void
  onDelete: () => void
}) {
  const percent = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0
  const remaining = goal.targetValue - goal.currentValue
  const monthsToGoal =
    remaining > 0 && goal.monthlyDeposit > 0 ? remaining / goal.monthlyDeposit : 0
  const years = Math.floor(monthsToGoal / 12)
  const months = Math.ceil(monthsToGoal % 12)
  const timeStr =
    remaining <= 0
      ? 'Concluída'
      : monthsToGoal > 0
        ? `${years > 0 ? `${years}a ` : ''}${months}m`
        : 'Sem previsão'
  const ageAtCompletion = currentAge + monthsToGoal / 12

  const chartData = []
  let curr = goal.currentValue
  const totalYearsProj = Math.min(Math.max(Math.ceil(monthsToGoal / 12), 1), 30)
  for (let i = 0; i <= totalYearsProj; i++) {
    chartData.push({ age: currentAge + i, value: Math.round(curr) })
    curr += goal.monthlyDeposit * 12
    if (curr > goal.targetValue && i >= totalYearsProj - 1) curr = goal.targetValue
  }

  const baseColor = goal.color || 'hsl(var(--primary))'

  return (
    <Card className="border-border/50 flex flex-col group overflow-hidden">
      <CardContent className="p-5 flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${baseColor}20`, color: baseColor }}
          >
            <DynamicIcon name={goal.icon || 'Target'} className="w-5 h-5" />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{goal.name}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <CalIcon className="w-3.5 h-3.5" />
            <span>Alvo: {format(new Date(goal.targetDate), 'MMM yyyy')}</span>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm items-end">
            <span className="font-bold text-xl">
              R$ {goal.currentValue.toLocaleString('pt-BR')}
            </span>
            <span className="text-muted-foreground">
              / R$ {goal.targetValue.toLocaleString('pt-BR')}
            </span>
          </div>
          <Progress
            value={percent}
            className="h-2.5"
            indicatorClassName="bg-current"
            style={{ color: baseColor }}
          />
          <p className="text-xs text-right text-muted-foreground">{percent.toFixed(1)}%</p>
        </div>
      </CardContent>
      <div className="bg-muted/10 p-4 border-t flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Aporte Sugerido:</span>
          <span className="font-medium">
            R$ {goal.monthlyDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
          <div>
            <p className="text-muted-foreground mb-0.5">Tempo Estimado</p>
            <p className="font-medium">{timeStr}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground mb-0.5">Idade na Conclusão</p>
            <p className="font-medium" style={{ color: baseColor }}>
              {remaining <= 0
                ? 'Alcançado'
                : monthsToGoal > 0
                  ? `${Math.ceil(ageAtCompletion)} anos`
                  : '-'}
            </p>
          </div>
        </div>
        {monthsToGoal > 0 && remaining > 0 && (
          <div className="mt-2 h-24 w-full">
            <ChartContainer
              config={{ value: { label: 'Projeção', color: baseColor } }}
              className="h-full w-full"
            >
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`fill-${goal.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={baseColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={baseColor} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="age"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}a`}
                  fontSize={10}
                  className="text-muted-foreground"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReferenceLine
                  y={goal.targetValue}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={baseColor}
                  fill={`url(#fill-${goal.id})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </div>
    </Card>
  )
}
