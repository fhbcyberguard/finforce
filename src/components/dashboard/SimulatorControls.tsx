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
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Aporte Mensal</Label>
          <span className="font-mono text-sm font-semibold text-primary">
            R$ {aporte.toLocaleString('pt-BR')}
          </span>
        </div>
        <Slider
          value={[aporte]}
          onValueChange={(v) => setAporte(v[0])}
          max={10000}
          step={100}
          className="py-2"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Taxa de Retorno (a.a.)</Label>
          <span className="font-mono text-sm font-semibold text-primary">{retorno}%</span>
        </div>
        <Slider
          value={[retorno]}
          onValueChange={(v) => setRetorno(v[0])}
          min={2}
          max={18}
          step={0.5}
          className="py-2"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Idade Alvo de Aposentadoria</Label>
          <span className="font-mono text-sm font-semibold text-primary">{idade} Anos</span>
        </div>
        <Slider
          value={[idade]}
          onValueChange={(v) => setIdade(v[0])}
          min={40}
          max={75}
          step={1}
          className="py-2"
        />
      </div>
    </div>
  )
}
