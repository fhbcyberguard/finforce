import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { name: 'Renda Fixa', value: 45000, color: 'hsl(var(--chart-1))' },
  { name: 'Tesouro Direto', value: 25000, color: 'hsl(var(--chart-2))' },
  { name: 'Variável', value: 23500, color: 'hsl(var(--chart-3))' },
]

export default function AllocationChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Alocação</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          config={{
            'Renda Fixa': { label: 'Renda Fixa', color: 'hsl(var(--chart-1))' },
            'Tesouro Direto': { label: 'Tesouro Direto', color: 'hsl(var(--chart-2))' },
            Variável: { label: 'Renda Variável', color: 'hsl(var(--chart-3))' },
          }}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
