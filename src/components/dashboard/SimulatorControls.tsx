import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

interface SimulatorControlsProps {
  aporte: number
  setAporte: (v: number) => void
  retorno: number
  setRetorno: (v: number) => void
  rendaDesejada: number
  setRendaDesejada: (v: number) => void
  currentAge: number
  retirementAge: number
}

export default function SimulatorControls({
  aporte,
  setAporte,
  retorno,
  setRetorno,
  rendaDesejada,
  setRendaDesejada,
  currentAge,
  retirementAge,
}: SimulatorControlsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Aporte Mensal</Label>
          <span className="font-mono text-sm font-medium">R$ {aporte.toLocaleString('pt-BR')}</span>
        </div>
        <Slider
          value={[aporte]}
          min={0}
          max={20000}
          step={100}
          onValueChange={([v]) => setAporte(v)}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Taxa Anual Esperada</Label>
          <span className="font-mono text-sm font-medium">{retorno}% a.a.</span>
        </div>
        <Slider
          value={[retorno]}
          min={1}
          max={15}
          step={0.5}
          onValueChange={([v]) => setRetorno(v)}
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <Label>Idade Projetada p/ Liberdade</Label>
          <span className="font-mono text-sm font-medium text-primary">
            {retirementAge === Infinity ? 'Sem previsão' : `${Math.ceil(retirementAge)} anos`}
          </span>
        </div>
        <Progress
          value={retirementAge === Infinity ? 0 : Math.min((currentAge / retirementAge) * 100, 100)}
          className="h-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Cálculo automático baseado na sua idade atual ({currentAge} anos).
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-border/50">
        <Label>Renda Passiva Desejada (R$/mês)</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm font-mono">R$</span>
          <Input
            type="number"
            value={rendaDesejada}
            onChange={(e) => setRendaDesejada(Number(e.target.value))}
            className="font-mono"
            step="500"
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Alvo estimado de patrimônio: R${' '}
          {Math.round((rendaDesejada * 12) / (retorno / 100)).toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  )
}
