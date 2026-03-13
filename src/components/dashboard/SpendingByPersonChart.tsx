import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import useAppStore from '@/stores/useAppStore'
import { ChartColorEditor } from './ChartColorEditor'

const COLORS = ['#2EC4B6', '#59C3C3', '#F4D03F', '#E74C3C', '#8E44AD', '#3498DB']

export function SpendingByPersonChart() {
  const { transactions, timeframe, categoryColors, currentContext, selectedYear } = useAppStore()

  const { pieData, config, chartProfiles, editorCategories } = useMemo(() => {
    const now = new Date()
    const yearToUse = selectedYear || now.getFullYear().toString()
    const currentMonth = `${yearToUse}-${now.toISOString().slice(5, 7)}`

    const expenses = transactions.filter((t) => t.amount < 0 && t.type !== 'Transfer')

    const currentExpenses = expenses.filter((t) => {
      if (timeframe === 'annual') return t.date.startsWith(yearToUse)
      return t.date.startsWith(currentMonth)
    })

    const profileMap: Record<string, number> = {}
    currentExpenses.forEach((t) => {
      const profileName = t.profile || 'Não atribuído'
      profileMap[profileName] = (profileMap[profileName] || 0) + Math.abs(t.amount)
    })

    const pieData = Object.entries(profileMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const allProfiles = Array.from(
      new Set(currentExpenses.map((t) => t.profile || 'Não atribuído')),
    )

    const config: any = {}
    allProfiles.forEach((prof, idx) => {
      config[prof] = {
        label: prof,
        color: categoryColors[prof] || COLORS[idx % COLORS.length],
      }
    })
    config.value = { label: 'Valor' }

    // Prepare derived categorizations securely inside useMemo
    const chartProfiles = Object.keys(config).filter((k) => k !== 'value')
    const editorCategories = chartProfiles.map((p) => ({
      name: p,
      color: config[p].color,
    }))

    return { pieData, config, chartProfiles, editorCategories }
  }, [transactions, timeframe, categoryColors, selectedYear])

  const title =
    currentContext === 'business' ? 'Gastos por Colaborador' : 'Gastos por Membro Familiar'

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <ChartColorEditor categories={editorCategories} />
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {chartProfiles.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-muted/10">
              Nenhum dado de gasto por pessoa disponível.
            </div>
          ) : (
            <ChartContainer config={config} className="h-full w-full">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={config[entry.name]?.color}
                      stroke="#1E3A5F"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
