import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface SimulatorControlsProps {
  aporte: number
  setAporte: (v: number) => void
  retorno: number
  setRetorno: (v: number) => void
  idade: number
  setIdade: (v: number) => void
}

export default function SimulatorControls({
  aporte,
  setAporte,
  retorno,
  setRetorno,
  idade,
  setIdade,
}: SimulatorControlsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Aporte Mensal</Label>
          <span className="font-mono text-sm font-medium">R$ {aporte.toLocaleString('pt-BR')}</span>
        </div>
        <Slider
          value={[aporte]}
          min={100}
          max={20000}
          step={100}
          onValueChange={([v]) => setAporte(v)}
        />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
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
        <div className="flex justify-between">
          <Label>Idade de Aposentadoria</Label>
          <span className="font-mono text-sm font-medium">{idade} anos</span>
        </div>
        <Slider value={[idade]} min={30} max={80} step={1} onValueChange={([v]) => setIdade(v)} />
      </div>
    </div>
  )
}
