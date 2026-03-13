import { Cell, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function AllocationChart({ className }: { className?: string }) {
  const data = [
    { name: 'Renda Fixa', value: 45000, fill: 'var(--color-rendafixa)' },
    { name: 'Tesouro Direto', value: 25000, fill: 'var(--color-tesouro)' },
    { name: 'Variável', value: 23500, fill: 'var(--color-variavel)' },
  ]

  const config = {
    rendafixa: { label: 'Renda Fixa', color: 'hsl(var(--chart-1))' },
    tesouro: { label: 'Tesouro Direto', color: 'hsl(var(--chart-2))' },
    variavel: { label: 'Variável', color: 'hsl(var(--chart-3))' },
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Alocação Atual</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pb-2">
        <ChartContainer config={config} className="h-[250px] w-full">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={2}
              stroke="hsl(var(--card))"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  className="hover:opacity-80 transition-opacity outline-none"
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} className="mt-4" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
