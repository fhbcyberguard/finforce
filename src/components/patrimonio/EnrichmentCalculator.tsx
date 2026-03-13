import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Target, TrendingUp, Calculator } from 'lucide-react'

export default function EnrichmentCalculator() {
  const [target, setTarget] = useState('1000000')
  const [current, setCurrent] = useState('342500')
  const [contribution, setContribution] = useState('2000')
  const [rate, setRate] = useState('10')
  const [months, setMonths] = useState<number | null>(null)

  const calculate = () => {
    const FV = parseFloat(target)
    let PV = parseFloat(current)
    const PMT = parseFloat(contribution)
    const r = parseFloat(rate) / 100 / 12

    let n = 0
    // Simple loop approach to solve for N to avoid complex log formulas with both PV and PMT
    while (PV < FV && n < 1200) {
      // cap at 100 years
      PV = PV * (1 + r) + PMT
      n++
    }
    setMonths(n)
  }

  return (
    <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Calculadora de Enriquecimento</CardTitle>
            <CardDescription>
              Descubra em quanto tempo você atingirá seu objetivo financeiro.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Valor Alvo (R$)</Label>
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="font-mono bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label>Patrimônio Atual (R$)</Label>
            <Input
              type="number"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="font-mono bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label>Aporte Mensal (R$)</Label>
            <Input
              type="number"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              className="font-mono bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label>Taxa Anual (%)</Label>
            <Input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="font-mono bg-background"
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full gap-2">
          <Calculator className="w-4 h-4" /> Calcular Tempo
        </Button>

        {months !== null && (
          <div className="mt-6 p-6 rounded-lg bg-background border border-border text-center space-y-2 animate-fade-in">
            <p className="text-muted-foreground">Tempo Estimado para o Alvo:</p>
            <h3 className="text-4xl font-bold text-primary">
              {Math.floor(months / 12)} anos e {months % 12} meses
            </h3>
            <p className="text-sm italic text-muted-foreground mt-4">
              Juros compostos são a oitava maravilha do mundo. Continue aportando!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
