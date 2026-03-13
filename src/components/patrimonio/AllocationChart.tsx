import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import useAppStore from '@/stores/useAppStore'

const COLORS = [
  '#2EC4B6', // Teal
  '#59C3C3', // Light Teal/Green
  '#F4D03F', // Gold
  '#E74C3C', // Red
  '#8E44AD', // Purple
]

export default function AllocationChart({ className }: { className?: string }) {
  const { assets } = useAppStore()

  const dataMap = assets.reduce(
    (acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + asset.value
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(dataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Alocação Atual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-muted/10">
              Sem ativos para alocação.
            </div>
          ) : (
            <ChartContainer
              config={{ value: { label: 'Valor', color: COLORS[0] } }}
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#1E3A5F"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
