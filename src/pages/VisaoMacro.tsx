import { useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { BarChart2, PieChart as PieChartIcon, Activity } from 'lucide-react'

export default function VisaoMacro() {
  const { transactions, accounts, categoryColors } = useAppStore()

  // 1. Cash Flow (last 6 months)
  const cashFlowData = useMemo(() => {
    const monthMap: Record<string, { name: string; Receitas: number; Despesas: number }> = {}

    // Group transactions by month (YYYY-MM)
    transactions.forEach((t) => {
      if (t.type === 'Transfer' || t.type === 'Aporte') return
      const period = t.date.substring(0, 7)
      if (!monthMap[period]) monthMap[period] = { name: period, Receitas: 0, Despesas: 0 }

      const isGain = t.type === 'Revenue' || t.category.includes('Renda')
      if (isGain) {
        monthMap[period].Receitas += Math.abs(t.amount)
      } else {
        monthMap[period].Despesas += Math.abs(t.amount)
      }
    })

    return Object.values(monthMap)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-6)
  }, [transactions])

  const cashFlowConfig = {
    Receitas: { label: 'Receitas', color: 'hsl(var(--primary))' },
    Despesas: { label: 'Despesas', color: 'hsl(var(--destructive))' },
  }

  // 2. Expenses by Category (all time)
  const pieDataConfig = useMemo(() => {
    const expenses = transactions.filter(
      (t) =>
        t.amount < 0 &&
        t.type !== 'Transfer' &&
        t.type !== 'Aporte' &&
        !(t.type === 'Revenue' || t.category.includes('Renda')),
    )
    const catMap: Record<string, number> = {}

    expenses.forEach((t) => {
      const cat = t.category.split(' > ')[0] || 'Outros'
      catMap[cat] = (catMap[cat] || 0) + Math.abs(t.amount)
    })

    const pieData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const COLORS = ['#03F2FF', '#59C3C3', '#F4D03F', '#E74C3C', '#8E44AD', '#3498DB']
    const config: Record<string, any> = { value: { label: 'Valor' } }

    pieData.forEach((d, i) => {
      config[d.name] = {
        label: d.name,
        color: categoryColors[d.name] || COLORS[i % COLORS.length],
      }
    })

    return { pieData, config }
  }, [transactions, categoryColors])

  // 3. Accounts Balance
  const accountsDataConfig = useMemo(() => {
    const barData = accounts
      .map((a) => ({
        name: a.name,
        Saldo: a.balance,
      }))
      .sort((a, b) => b.Saldo - a.Saldo)

    const config = {
      Saldo: { label: 'Saldo', color: 'hsl(var(--primary))' },
    }

    return { barData, config }
  }, [accounts])

  return (
    <div className="space-y-6 animate-slide-in-up pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Visão Macro</h1>
        <p className="text-muted-foreground">
          Análise global do seu comportamento financeiro e patrimonial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Area Chart */}
        <Card className="col-span-1 lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-primary" />
              Fluxo de Caixa (Últimos 6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {cashFlowData.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed rounded-md bg-muted/10 text-muted-foreground">
                  Sem dados de fluxo de caixa.
                </div>
              ) : (
                <ChartContainer config={cashFlowConfig} className="h-full w-full">
                  <AreaChart
                    data={cashFlowData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      className="text-muted-foreground"
                      tickFormatter={(v) => {
                        const [y, m] = v.split('-')
                        return `${m}/${y.slice(2)}`
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      className="text-muted-foreground"
                      tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="Receitas"
                      stroke="var(--color-Receitas)"
                      fill="var(--color-Receitas)"
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Despesas"
                      stroke="var(--color-Despesas)"
                      fill="var(--color-Despesas)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Category Pie Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {pieDataConfig.pieData.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed rounded-md bg-muted/10 text-muted-foreground">
                  Sem dados de despesas.
                </div>
              ) : (
                <ChartContainer config={pieDataConfig.config} className="h-full w-full">
                  <PieChart>
                    <Pie
                      data={pieDataConfig.pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {pieDataConfig.pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={pieDataConfig.config[entry.name]?.color}
                          stroke="var(--background)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <ChartLegend
                      content={<ChartLegendContent />}
                      className="flex-wrap justify-center"
                    />
                  </PieChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Accounts Balance Bar Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart2 className="w-5 h-5 text-primary" />
              Saldo por Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {accountsDataConfig.barData.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed rounded-md bg-muted/10 text-muted-foreground">
                  Nenhuma conta cadastrada.
                </div>
              ) : (
                <ChartContainer config={accountsDataConfig.config} className="h-full w-full">
                  <BarChart
                    data={accountsDataConfig.barData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
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
                    <Bar dataKey="Saldo" fill="var(--color-Saldo)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
