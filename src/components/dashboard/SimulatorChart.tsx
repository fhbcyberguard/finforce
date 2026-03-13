import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface SimulatorChartProps {
  aporte: number
  retorno: number
  idade: number
}

export default function SimulatorChart({ aporte, retorno, idade }: SimulatorChartProps) {
  const currentAge = 35
  const currentWealth = 342500
  const targetPassiveIncome = 15000 // R$ 15k/month desired

  const data = useMemo(() => {
    const arr = []
    let wealth = currentWealth
    const monthlyRate = Math.pow(1 + retorno / 100, 1 / 12) - 1

    // Simplistic projection
    for (let age = currentAge; age <= currentAge + 30; age++) {
      arr.push({
        age,
        patrimonio: Math.round(wealth),
        meta: Math.round((targetPassiveIncome * 12) / (retorno / 100)), // Target to generate passive income
      })
      // compound for 12 months
      for (let m = 0; m < 12; m++) {
        wealth = wealth * (1 + monthlyRate) + aporte
      }
    }
    return arr
  }, [aporte, retorno, idade])

  const chartConfig = {
    patrimonio: { label: 'Patrimônio', color: 'hsl(var(--primary))' },
    meta: { label: 'Ponto de Liberdade', color: 'hsl(var(--destructive))' },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ComposedChart data={data} margin={{ top: 20, left: 0, right: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillPatrimonio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-patrimonio)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-patrimonio)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="age"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(v) => `${v} anos`}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `R$ ${(v / 1000000).toFixed(1)}M`}
          width={80}
          className="text-xs"
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area
          type="monotone"
          dataKey="patrimonio"
          stroke="var(--color-patrimonio)"
          strokeWidth={3}
          fill="url(#fillPatrimonio)"
        />
        <Line
          type="step"
          dataKey="meta"
          stroke="var(--color-meta)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
