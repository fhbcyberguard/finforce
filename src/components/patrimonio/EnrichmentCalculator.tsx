import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function EnrichmentCalculator() {
  const [initial, setInitial] = useState(100000)
  const [monthly, setMonthly] = useState(2000)
  const [rate, setRate] = useState(8.5)
  const [target, setTarget] = useState(1000000)
  const [result, setResult] = useState<{ months: number; years: number } | null>(null)

  const calculate = () => {
    const r = Math.pow(1 + rate / 100, 1 / 12) - 1
    const pmt = monthly
    const pv = initial
    const fv = target

    if (pv >= fv) {
      setResult({ months: 0, years: 0 })
      return
    }

    if (r === 0) {
      const months = (fv - pv) / pmt
      setResult({ months: Math.max(0, Math.ceil(months)), years: Math.max(0, months / 12) })
      return
    }

    const num = (fv + pmt / r) / (pv + pmt / r)
    if (num <= 0) {
      setResult({ months: 0, years: 0 })
      return
    }

    const months = Math.log(num) / Math.log(1 + r)
    setResult({
      months: Math.max(0, Math.ceil(months)),
      years: Math.max(0, +(months / 12).toFixed(1)),
    })
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Calculadora de Enriquecimento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Patrimônio Inicial (R$)</Label>
            <Input
              type="number"
              value={initial}
              onChange={(e) => setInitial(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Aporte Mensal (R$)</Label>
            <Input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Taxa Anual (%)</Label>
            <Input
              type="number"
              value={rate}
              step="0.1"
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Valor Alvo (R$)</Label>
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </div>
        </div>
        <Button className="w-full" onClick={calculate}>
          Calcular Tempo Estimado
        </Button>

        {result !== null && (
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">
              Tempo estimado para atingir R$ {target.toLocaleString('pt-BR')}:
            </p>
            <p className="text-3xl font-bold text-primary">
              {result.years} anos{' '}
              <span className="text-lg font-medium text-muted-foreground">
                ({result.months} meses)
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
