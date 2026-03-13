import { Card, CardContent } from '@/components/ui/card'
import { Calculator } from 'lucide-react'

export default function EnrichmentCalculator() {
  return (
    <Card className="border-dashed border-2 bg-muted/10">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">Calculadora de Enriquecimento</h3>
        <p className="text-muted-foreground max-w-md">
          Em breve você poderá projetar cenários avançados de juros compostos com aportes dinâmicos
          e diferentes indexadores.
        </p>
      </CardContent>
    </Card>
  )
}
