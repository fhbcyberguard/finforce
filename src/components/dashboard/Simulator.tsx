import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lightbulb, Clock, Save, AlertTriangle } from 'lucide-react'
import { Typewriter } from '../Typewriter'
import SimulatorControls from './SimulatorControls'
import SimulatorChart from './SimulatorChart'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { differenceInYears } from 'date-fns'

export default function Simulator() {
  const { assets, accounts, simulatorSettings, setSimulatorSettings } = useAppStore()
  const { toast } = useToast()
  const { profile } = useAuth()

  const currentAge = useMemo(() => {
    if (profile?.birth_date) {
      return differenceInYears(new Date(), new Date(profile.birth_date))
    }
    return 35 // fallback
  }, [profile])

  const [aporte, setAporte] = useState(simulatorSettings.aporte)
  const [retorno, setRetorno] = useState(simulatorSettings.retorno)
  const [rendaDesejada, setRendaDesejada] = useState(simulatorSettings.rendaDesejada)

  useEffect(() => {
    setAporte(simulatorSettings.aporte)
    setRetorno(simulatorSettings.retorno)
    setRendaDesejada(simulatorSettings.rendaDesejada)
  }, [simulatorSettings])

  const patrimony = useMemo(() => {
    return (
      assets.reduce((sum, a) => sum + a.value, 0) + accounts.reduce((sum, a) => sum + a.balance, 0)
    )
  }, [assets, accounts])

  const { freedomText, hasReached, isStalled, retirementAge } = useMemo(() => {
    const monthlyRate = Math.pow(1 + retorno / 100, 1 / 12) - 1
    const target = Math.round((rendaDesejada * 12) / (retorno / 100))

    if (patrimony >= target) {
      return {
        freedomText: 'Você já alcançou!',
        hasReached: true,
        isStalled: false,
        retirementAge: currentAge,
      }
    }

    let monthsToFreedom = Infinity

    if (aporte > 0) {
      if (monthlyRate > 0) {
        const num = (target + aporte / monthlyRate) / (patrimony + aporte / monthlyRate)
        if (num > 0) {
          monthsToFreedom = Math.log(num) / Math.log(1 + monthlyRate)
        }
      } else {
        monthsToFreedom = (target - patrimony) / aporte
      }
    }

    if (aporte <= 0 || monthsToFreedom === Infinity) {
      return {
        freedomText: 'Aporte necessário',
        hasReached: false,
        isStalled: true,
        retirementAge: Infinity,
      }
    }

    const years = Math.floor(monthsToFreedom / 12)
    const months = Math.ceil(monthsToFreedom % 12)

    return {
      freedomText: `${years} anos e ${months} meses`,
      hasReached: false,
      isStalled: false,
      retirementAge: currentAge + monthsToFreedom / 12,
    }
  }, [aporte, retorno, rendaDesejada, patrimony, currentAge])

  const handleSaveScenario = () => {
    setSimulatorSettings({ aporte, retorno, rendaDesejada })
    toast({
      title: 'Plano Salvo',
      description: 'Suas projeções do Plano de Aposentadoria foram atualizadas.',
    })
  }

  // CBT Question Generator
  const getInsight = () => {
    if (aporte <= 0)
      return `Sem aportes, seu patrimônio depende apenas do tempo e rendimento. Você está confortável em pausar seus investimentos agora?`
    if (retirementAge < 40 && retirementAge > currentAge)
      return `Aposentar-se aos ${Math.ceil(retirementAge)} anos exige sacrifício extremo agora. Cuidado com o burnout. Está valendo a pena?`
    if (aporte > 10000)
      return `Um aporte de R$ ${aporte.toLocaleString()} é alto! O que você está deixando de viver hoje para manter esse ritmo?`
    if (retorno > 10)
      return `Uma taxa de ${retorno}% a.a. é agressiva e traz risco. Você tem um plano B para cenários de crise na economia?`
    if (rendaDesejada > 30000)
      return `Uma renda de R$ ${rendaDesejada.toLocaleString()} exige um patrimônio massivo. Essa necessidade de luxo reflete seus valores reais?`
    return `Como um aumento de 5% no seu aporte (R$ ${(aporte * 0.05).toFixed(0)}) hoje afetaria sua tranquilidade em 10 anos?`
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Plano de Aposentadoria</CardTitle>
            <CardDescription>
              Projete o cruzamento entre seu patrimônio e custo de vida desejado.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleSaveScenario} className="gap-2">
            <Save className="w-4 h-4" />
            Salvar Plano
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div
          className={`bg-primary/5 border p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isStalled ? 'border-amber-500/50 bg-amber-500/5' : 'border-primary/20'}`}
        >
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              {isStalled ? (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              ) : (
                <Clock className="w-5 h-5 text-primary" />
              )}
              <span className={isStalled ? 'text-amber-600 dark:text-amber-500' : 'text-primary'}>
                Tempo de Liberdade Estimado
              </span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Projeção baseada no patrimônio atual de R$ {patrimony.toLocaleString('pt-BR')} e
              aportes.
            </p>
          </div>
          <div
            className={`text-2xl md:text-3xl font-bold text-left sm:text-right ${hasReached ? 'text-primary' : isStalled ? 'text-muted-foreground' : 'text-primary'}`}
          >
            {freedomText}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 flex flex-col">
            <SimulatorControls
              aporte={aporte}
              setAporte={setAporte}
              retorno={retorno}
              setRetorno={setRetorno}
              rendaDesejada={rendaDesejada}
              setRendaDesejada={setRendaDesejada}
              currentAge={currentAge}
              retirementAge={retirementAge}
            />
          </div>
          <div className="md:col-span-8 relative">
            {isStalled && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-lg">
                <div className="bg-background border shadow-lg p-4 rounded-lg text-center max-w-[280px]">
                  <p className="text-sm font-medium text-muted-foreground">Gráfico indisponível</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ajuste o valor do aporte para visualizar a projeção patrimonial no tempo.
                  </p>
                </div>
              </div>
            )}
            <SimulatorChart
              aporte={aporte}
              retorno={retorno}
              currentAge={currentAge}
              retirementAge={retirementAge}
              rendaDesejada={rendaDesejada}
              patrimony={patrimony}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
          <div className="flex gap-3 items-start">
            <Lightbulb className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-foreground/80 leading-relaxed min-h-[40px]">
              <Typewriter text={`Gatilho de Reflexão: ${getInsight()}`} speed={30} />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
