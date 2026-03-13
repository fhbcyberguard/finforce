import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

const monthlyData = [
  { name: 'Sem 1', Alimentação: 400, Moradia: 1200, Lazer: 300 },
  { name: 'Sem 2', Alimentação: 350, Moradia: 0, Lazer: 450 },
  { name: 'Sem 3', Alimentação: 500, Moradia: 150, Lazer: 200 },
  { name: 'Sem 4', Alimentação: 450, Moradia: 100, Lazer: 600 },
]

const annualData = [
  { name: 'Tri 1', Alimentação: 4800, Moradia: 14400, Lazer: 3600 },
  { name: 'Tri 2', Alimentação: 5200, Moradia: 14400, Lazer: 4200 },
  { name: 'Tri 3', Alimentação: 4900, Moradia: 14500, Lazer: 3100 },
  { name: 'Tri 4', Alimentação: 6100, Moradia: 15000, Lazer: 5000 },
]

export function SpendingChart() {
  const [view, setView] = useState('monthly')
  const data = view === 'monthly' ? monthlyData : annualData

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Análise Macro de Gastos</CardTitle>
        <Tabs value={view} onValueChange={setView}>
          <TabsList className="h-8">
            <TabsTrigger value="monthly" className="text-xs px-3">
              Mensal
            </TabsTrigger>
            <TabsTrigger value="annual" className="text-xs px-3">
              Anual
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ChartContainer
            config={{
              Alimentação: { label: 'Alimentação', color: 'hsl(var(--primary))' },
              Moradia: { label: 'Moradia', color: 'hsl(var(--secondary))' },
              Lazer: { label: 'Lazer', color: 'hsl(var(--accent))' },
            }}
            className="h-full w-full"
          >
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Bar
                dataKey="Moradia"
                fill="var(--color-Moradia)"
                radius={[0, 0, 4, 4]}
                stackId="a"
              />
              <Bar dataKey="Alimentação" fill="var(--color-Alimentação)" stackId="a" />
              <Bar dataKey="Lazer" fill="var(--color-Lazer)" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
