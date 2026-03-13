import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { name: 'Renda Fixa', value: 45 },
  { name: 'Ações BR', value: 25 },
  { name: 'Exterior', value: 20 },
  { name: 'FIIs', value: 10 },
]

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
]

export default function AllocationChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Alocação Atual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ChartContainer
            config={{
              value: { label: 'Alocação', color: 'hsl(var(--primary))' },
            }}
            className="h-full"
          >
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
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
