import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import useAppStore from '@/stores/useAppStore'
import { ChartColorEditor } from './ChartColorEditor'

// High Contrast Palette: Primary, Light Teal/Green, Gold
const COLORS = [
  '#03F2FF', // Primary
  '#59C3C3', // Light Teal/Green
  '#F4D03F', // Gold
  '#E74C3C', // Red
  '#8E44AD', // Purple
  '#3498DB', // Blue
]

export function SpendingChart() {
  const [view, setView] = useState('area')
  const { transactions, timeframe, categoryColors, selectedYear } = useAppStore()

  const { areaData, pieData, config, editorCategories } = useMemo(() => {
    const now = new Date()
    const yearToUse = selectedYear || now.getFullYear().toString()
    const currentMonth = `${yearToUse}-${now.toISOString().slice(5, 7)}`

    // Data for Area Chart (Balance over time)
    const monthMap: Record<
      string,
      { name: string; Receitas: number; Despesas: number; Saldo: number }
    > = {}
    const areaSource =
      timeframe === 'annual'
        ? transactions.filter((t) => t.date.startsWith(yearToUse))
        : transactions

    areaSource.forEach((t) => {
      const period = t.date.substring(0, 7) // YYYY-MM
      if (!monthMap[period]) monthMap[period] = { name: period, Receitas: 0, Despesas: 0, Saldo: 0 }

      const isGain = t.type === 'Revenue' || t.category.includes('Renda')
      if (isGain) {
        monthMap[period].Receitas += Math.abs(t.amount)
      } else if (t.type !== 'Transfer' && t.type !== 'Aporte') {
        monthMap[period].Despesas += Math.abs(t.amount)
      }
      monthMap[period].Saldo = monthMap[period].Receitas - monthMap[period].Despesas
    })

    const areaData = Object.values(monthMap)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(timeframe === 'annual' ? -12 : -6)

    // Data for Pie Chart (Current expenses distribution)
    const expenses = transactions.filter((t) => {
      const isGain = t.type === 'Revenue' || t.category.includes('Renda')
      return t.amount < 0 && t.type !== 'Transfer' && !isGain
    })

    const currentExpenses = expenses.filter((t) => {
      if (timeframe === 'annual') return t.date.startsWith(yearToUse)
      return t.date.startsWith(currentMonth)
    })

    const catMap: Record<string, number> = {}
    currentExpenses.forEach((t) => {
      const topCat = t.category.split(' > ')[0] || 'Outros'
      catMap[topCat] = (catMap[topCat] || 0) + Math.abs(t.amount)
    })

    const pieData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Config for Chart Container
    const config: any = {}
    const allCats = Array.from(
      new Set(currentExpenses.map((t) => t.category.split(' > ')[0] || 'Outros')),
    )

    allCats.forEach((cat, idx) => {
      config[cat] = {
        label: cat,
        color: categoryColors[cat] || COLORS[idx % COLORS.length],
      }
    })

    // Area series colors
    config.Receitas = { label: 'Receitas', color: '#10b981' } // Emerald
    config.Despesas = { label: 'Despesas', color: '#f43f5e' } // Rose
    config.Saldo = { label: 'Saldo', color: '#03F2FF' } // Primary Highlight
    config.value = { label: 'Valor' }

    const editorCategories = allCats.map((cat) => ({
      name: cat,
      color: config[cat].color,
    }))

    return { areaData, pieData, config, editorCategories }
  }, [transactions, timeframe, categoryColors, selectedYear])

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          Evolução Financeira ({timeframe === 'annual' ? 'Anual' : 'Mensal'})
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={setView}>
            <TabsList className="h-8">
              <TabsTrigger value="area" className="text-xs px-3">
                Fluxo
              </TabsTrigger>
              <TabsTrigger value="pie" className="text-xs px-3">
                Despesas
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ChartColorEditor categories={editorCategories} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {view === 'area' ? (
            areaData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-muted/10">
                Nenhum fluxo de caixa registrado.
              </div>
            ) : (
              <ChartContainer config={config} className="h-full w-full">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <Area
                    type="monotone"
                    dataKey="Receitas"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="Despesas"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="Saldo"
                    stroke="#03F2FF"
                    fill="#03F2FF"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ChartContainer>
            )
          ) : pieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-muted/10">
              Nenhuma despesa registrada no período.
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
