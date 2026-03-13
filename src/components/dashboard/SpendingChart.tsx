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
  const { transactions } = useAppStore()

  const { barData, pieData, config } = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount < 0 && t.type !== 'Transfer')

    // Pie data
    const catMap: Record<string, number> = {}
    expenses.forEach((t) => {
      const topCat = t.category.split(' > ')[0] || 'Outros'
      catMap[topCat] = (catMap[topCat] || 0) + Math.abs(t.amount)
    })
    const pieData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Bar data
    const monthMap: Record<string, Record<string, number>> = {}
    expenses.forEach((t) => {
      const topCat = t.category.split(' > ')[0] || 'Outros'
      const month = t.date.substring(0, 7)
      if (!monthMap[month]) monthMap[month] = { name: month }
      monthMap[month][topCat] = (monthMap[month][topCat] || 0) + Math.abs(t.amount)
    })
    const barData = Object.values(monthMap)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-6)

    // Config
    const allCats = Array.from(new Set(expenses.map((t) => t.category.split(' > ')[0] || 'Outros')))
    const config: any = {}
    allCats.forEach((cat, idx) => {
      config[cat] = { label: cat, color: COLORS[idx % COLORS.length] }
    })
    config.value = { label: 'Valor' }

    return { barData, pieData, config }
  }, [transactions])

  const chartCats = Object.keys(config).filter((k) => k !== 'value')

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Análise de Gastos (Real-time)</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {chartCats.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-muted/10">
              Nenhuma despesa registrada.
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
                {chartCats.map((cat, i) => (
                  <Bar key={cat} dataKey={cat} fill={COLORS[i % COLORS.length]} stackId="a" />
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
                  {pieData.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={config[entry.name]?.color || COLORS[idx % COLORS.length]}
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
