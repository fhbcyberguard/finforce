import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface SimulatorChartProps {
  aporte: number
  retorno: number
  idade: number
  rendaDesejada: number
}

export default function SimulatorChart({
  aporte,
  retorno,
  idade,
  rendaDesejada,
}: SimulatorChartProps) {
  const targetWealth = useMemo(() => {
    return Math.round((rendaDesejada * 12) / (retorno / 100))
  }, [rendaDesejada, retorno])

  const data = useMemo(() => {
    const currentAge = 35
    const years = Math.max(idade - currentAge, 5)
    let patrimonio = 100000 // initial base
    const result = []

    const monthlyRate = Math.pow(1 + retorno / 100, 1 / 12) - 1

    for (let i = 0; i <= years; i++) {
      if (i > 0) {
        for (let m = 0; m < 12; m++) {
          patrimonio = patrimonio * (1 + monthlyRate) + aporte
        }
      }
      result.push({
        age: currentAge + i,
        patrimonio: Math.round(patrimonio),
      })
    }

    return result
  }, [aporte, retorno, idade])

  return (
    <div className="h-[300px] w-full mt-4 md:mt-0">
      <ChartContainer
        config={{
          patrimonio: { label: 'Patrimônio Projetado', color: 'hsl(var(--primary))' },
        }}
        className="h-full w-full"
      >
        <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillPatrimonio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-patrimonio)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-patrimonio)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="age"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} anos`}
            className="text-xs text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            className="text-xs text-muted-foreground"
            width={70}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ReferenceLine
            y={targetWealth}
            stroke="hsl(var(--destructive))"
            strokeDasharray="3 3"
            label={{
              position: 'insideTopLeft',
              value: 'Alvo de Liberdade',
              fill: 'hsl(var(--destructive))',
              fontSize: 10,
            }}
          />
          <Area
            type="monotone"
            dataKey="patrimonio"
            stroke="var(--color-patrimonio)"
            fillOpacity={1}
            fill="url(#fillPatrimonio)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
