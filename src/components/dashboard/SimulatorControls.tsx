import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface SimulatorControlsProps {
  aporte: number
  setAporte: (val: number) => void
  retorno: number
  setRetorno: (val: number) => void
  idade: number
  setIdade: (val: number) => void
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
          <Label htmlFor="aporte" className="text-base">
            Aporte Mensal
          </Label>
          <span className="text-sm font-mono font-medium text-primary">
            R$ {aporte.toLocaleString('pt-BR')}
          </span>
        </div>
        <Slider
          id="aporte"
          min={100}
          max={20000}
          step={100}
          value={[aporte]}
          onValueChange={(val) => setAporte(val[0])}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="retorno" className="text-base">
            Retorno Anual Estimado
          </Label>
          <span className="text-sm font-mono font-medium text-primary">{retorno.toFixed(1)}%</span>
        </div>
        <Slider
          id="retorno"
          min={2}
          max={15}
          step={0.1}
          value={[retorno]}
          onValueChange={(val) => setRetorno(val[0])}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="idade" className="text-base">
            Idade Alvo da Independência
          </Label>
          <span className="text-sm font-mono font-medium text-primary">{idade} anos</span>
        </div>
        <Slider
          id="idade"
          min={30}
          max={80}
          step={1}
          value={[idade]}
          onValueChange={(val) => setIdade(val[0])}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  )
}
