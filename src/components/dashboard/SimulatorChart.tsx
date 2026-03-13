import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

interface SimulatorChartProps {
  aporte: number
  retorno: number
  idade: number
}

export default function SimulatorChart({ aporte, retorno, idade }: SimulatorChartProps) {
  const chartData = useMemo(() => {
    const data = []
    let patrimonio = 0
    const currentAge = 30
    const anos = Math.max(1, idade - currentAge)
    const taxaMensal = Math.pow(1 + retorno / 100, 1 / 12) - 1

    for (let i = 0; i <= anos; i++) {
      data.push({
        ano: i + currentAge,
        patrimonio: Math.round(patrimonio),
      })

      for (let m = 0; m < 12; m++) {
        patrimonio = patrimonio * (1 + taxaMensal) + aporte
      }
    }
    return data
  }, [aporte, retorno, idade])

  if (!chartData || chartData.length === 0) return null

  return (
    <div className="h-[300px] w-full">
      <ChartContainer
        config={{
          patrimonio: {
            label: 'Patrimônio',
            color: 'hsl(var(--primary))',
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillPatrimonio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-patrimonio)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-patrimonio)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--muted-foreground)/0.2)"
            />
            <XAxis
              dataKey="ano"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value} anos`}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              className="text-xs text-muted-foreground"
              width={65}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="patrimonio"
              stroke="var(--color-patrimonio)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fillPatrimonio)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
