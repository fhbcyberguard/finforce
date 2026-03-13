import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'

interface SimulatorControlsProps {
  aporte: number
  setAporte: (v: number) => void
  retorno: number
  setRetorno: (v: number) => void
  idade: number
  setIdade: (v: number) => void
  rendaDesejada: number
  setRendaDesejada: (v: number) => void
}

export default function SimulatorControls({
  aporte,
  setAporte,
  retorno,
  setRetorno,
  idade,
  setIdade,
  rendaDesejada,
  setRendaDesejada,
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

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Idade de Aposentadoria / Liberdade</Label>
          <span className="font-mono text-sm font-medium">{idade} anos</span>
        </div>
        <Slider value={[idade]} min={30} max={80} step={1} onValueChange={([v]) => setIdade(v)} />
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
