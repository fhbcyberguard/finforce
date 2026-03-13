import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import useAppStore from '@/stores/useAppStore'
import { ChartColorEditor } from './ChartColorEditor'

// High Contrast Palette: Teal, Green, Gold
const COLORS = [
  '#2EC4B6', // Teal
  '#59C3C3', // Light Teal/Green
  '#F4D03F', // Gold
  '#E74C3C', // Red
  '#8E44AD', // Purple
  '#3498DB', // Blue
]

export function SpendingChart() {
  const [view, setView] = useState('bar')
  const { transactions, timeframe, categoryColors, selectedYear } = useAppStore()

  const { barData, pieData, config, chartCats, editorCategories } = useMemo(() => {
    const now = new Date()
    const yearToUse = selectedYear || now.getFullYear().toString()
    const currentMonth = `${yearToUse}-${now.toISOString().slice(5, 7)}`

    const expenses = transactions.filter((t) => {
      const isGain = t.type === 'Revenue' || t.category.includes('Renda')
      return t.amount < 0 && t.type !== 'Transfer' && !isGain
    })

    const currentExpenses = expenses.filter((t) => {
      if (timeframe === 'annual') return t.date.startsWith(yearToUse)
      return t.date.startsWith(currentMonth)
    })

    // Pie data uses current timeframe
    const catMap: Record<string, number> = {}
    currentExpenses.forEach((t) => {
      const topCat = t.category.split(' > ')[0] || 'Outros'
      catMap[topCat] = (catMap[topCat] || 0) + Math.abs(t.amount)
    })
    const pieData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Bar data uses historical periods based on timeframe
    const monthMap: Record<string, Record<string, number>> = {}
    const barSource =
      timeframe === 'annual' ? expenses.filter((t) => t.date.startsWith(yearToUse)) : expenses

    barSource.forEach((t) => {
      const topCat = t.category.split(' > ')[0] || 'Outros'
      const period = t.date.substring(0, 7)
      if (!monthMap[period]) monthMap[period] = { name: period }
      monthMap[period][topCat] = (monthMap[period][topCat] || 0) + Math.abs(t.amount)
    })

    const barData = Object.values(monthMap)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(timeframe === 'annual' ? -12 : -6)

    // Config
    const allCats = Array.from(
      new Set(currentExpenses.map((t) => t.category.split(' > ')[0] || 'Outros')),
    )
    const config: any = {}
    allCats.forEach((cat, idx) => {
      config[cat] = {
        label: cat,
        color: categoryColors[cat] || COLORS[idx % COLORS.length],
      }
    })
    config.value = { label: 'Valor' }

    // Prepare derived categorizations securely inside useMemo
    const chartCats = Object.keys(config).filter((k) => k !== 'value')
    const editorCategories = chartCats.map((cat) => ({
      name: cat,
      color: config[cat].color,
    }))

    return { barData, pieData, config, chartCats, editorCategories }
  }, [transactions, timeframe, categoryColors, selectedYear])

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          Análise de Gastos ({timeframe === 'annual' ? 'Anual' : 'Mensal'})
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={setView}>
            <TabsList className="h-8">
              <TabsTrigger value="bar" className="text-xs px-3">
                Barras
              </TabsTrigger>
              <TabsTrigger value="pie" className="text-xs px-3">
                Pizza
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ChartColorEditor categories={editorCategories} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {chartCats.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-muted/10">
              Nenhuma despesa registrada no período.
            </div>
          ) : view === 'bar' ? (
            <ChartContainer config={config} className="h-full w-full">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  className="text-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  className="text-muted-foreground"
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
                {chartCats.map((cat) => (
                  <Bar key={cat} dataKey={cat} fill={config[cat].color} stackId="a" />
                ))}
              </BarChart>
            </ChartContainer>
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
