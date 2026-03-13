import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lightbulb, Clock, Save } from 'lucide-react'
import { Typewriter } from '../Typewriter'
import SimulatorControls from './SimulatorControls'
import SimulatorChart from './SimulatorChart'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'

export default function Simulator() {
  const { assets, simulatorSettings, setSimulatorSettings } = useAppStore()
  const { toast } = useToast()

  const [aporte, setAporte] = useState(simulatorSettings.aporte)
  const [retorno, setRetorno] = useState(simulatorSettings.retorno)
  const [idade, setIdade] = useState(simulatorSettings.idade)
  const [rendaDesejada, setRendaDesejada] = useState(simulatorSettings.rendaDesejada)

  useEffect(() => {
    setAporte(simulatorSettings.aporte)
    setRetorno(simulatorSettings.retorno)
    setIdade(simulatorSettings.idade)
    setRendaDesejada(simulatorSettings.rendaDesejada)
  }, [simulatorSettings])

  const patrimony = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets])

  const { freedomText, hasReached } = useMemo(() => {
    const monthlyRate = Math.pow(1 + retorno / 100, 1 / 12) - 1
    const target = Math.round((rendaDesejada * 12) / (retorno / 100))

    let monthsToFreedom = 0
    if (patrimony < target) {
      if (monthlyRate > 0) {
        const num = (target + aporte / monthlyRate) / (patrimony + aporte / monthlyRate)
        if (num > 0) {
          monthsToFreedom = Math.log(num) / Math.log(1 + monthlyRate)
        }
      } else {
        monthsToFreedom = (target - patrimony) / (aporte || 1)
      }
    }

    const years = Math.floor(monthsToFreedom / 12)
    const months = Math.ceil(monthsToFreedom % 12)

    return {
      freedomText: patrimony >= target ? 'Você já alcançou!' : `${years} anos e ${months} meses`,
      hasReached: patrimony >= target,
    }
  }, [aporte, retorno, rendaDesejada, patrimony])

  const handleSaveScenario = () => {
    setSimulatorSettings({ aporte, retorno, idade, rendaDesejada })
    toast({
      title: 'Cenário Salvo',
      description: 'Suas projeções de independência financeira foram atualizadas e persisitdas.',
    })
  }

  // CBT Question Generator
  const getInsight = () => {
    if (idade < 40)
      return `Aposentar-se aos ${idade} anos exige sacrifício extremo agora. Cuidado com o burnout. Está valendo a pena?`
    if (aporte > 10000)
      return `Um aporte de R$ ${aporte.toLocaleString()} é alto! O que você está deixando de viver hoje para manter esse ritmo?`
    if (retorno > 10)
      return `Uma taxa de ${retorno}% a.a. é agressiva e traz risco. Você tem um plano B para cenários de crise na economia?`
    if (rendaDesejada > 30000)
      return `Uma renda de R$ ${rendaDesejada.toLocaleString()} exige um patrimônio massivo. Essa necessidade de luxo reflete seus valores reais?`
    return `Como um aumento de 5% no seu aporte (R$ ${(aporte * 0.05).toFixed(0)}) hoje afetaria sua tranquilidade em 10 anos?`
  }

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Simulador: Ponto de Liberdade</CardTitle>
            <CardDescription>
              Projete o cruzamento entre seu patrimônio e custo de vida desejado.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleSaveScenario} className="gap-2">
            <Save className="w-4 h-4" />
            Salvar Cenário
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-primary flex items-center gap-2">
              <Clock className="w-5 h-5" /> Tempo de Liberdade Estimado
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Projeção baseada no patrimônio de R$ {patrimony.toLocaleString('pt-BR')} e aporte de
              R$ {aporte.toLocaleString('pt-BR')}
            </p>
          </div>
          <div
            className={`text-2xl md:text-3xl font-bold text-left sm:text-right ${hasReached ? 'text-emerald-500' : 'text-primary'}`}
          >
            {freedomText}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start flex-1">
          <div className="md:col-span-4 h-full flex flex-col">
            <SimulatorControls
              aporte={aporte}
              setAporte={setAporte}
              retorno={retorno}
              setRetorno={setRetorno}
              idade={idade}
              setIdade={setIdade}
              rendaDesejada={rendaDesejada}
              setRendaDesejada={setRendaDesejada}
            />
          </div>
          <div className="md:col-span-8">
            <SimulatorChart
              aporte={aporte}
              retorno={retorno}
              idade={idade}
              rendaDesejada={rendaDesejada}
            />
          </div>
        </div>

        <div className="mt-auto p-4 rounded-lg bg-secondary/10 border border-secondary/20">
          <div className="flex gap-3 items-start">
            <Lightbulb className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-foreground/80 leading-relaxed">
              <Typewriter text={`Gatilho de Reflexão: ${getInsight()}`} speed={40} />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
