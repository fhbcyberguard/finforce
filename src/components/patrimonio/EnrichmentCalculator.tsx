import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function EnrichmentCalculator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calculadora de Enriquecimento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Patrimônio Inicial (R$)</Label>
            <Input type="number" defaultValue={100000} />
          </div>
          <div className="space-y-2">
            <Label>Aporte Mensal (R$)</Label>
            <Input type="number" defaultValue={2000} />
          </div>
          <div className="space-y-2">
            <Label>Taxa Anual (%)</Label>
            <Input type="number" defaultValue={8.5} />
          </div>
          <div className="space-y-2">
            <Label>Período (Anos)</Label>
            <Input type="number" defaultValue={20} />
          </div>
        </div>
        <Button className="w-full mt-4">Calcular Projeção</Button>
      </CardContent>
    </Card>
  )
}
