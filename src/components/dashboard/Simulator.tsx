import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'
import { Typewriter } from '../Typewriter'
import SimulatorControls from './SimulatorControls'
import SimulatorChart from './SimulatorChart'
import { Button } from '@/components/ui/button'

export default function Simulator() {
  const [aporte, setAporte] = useState(2000)
  const [retorno, setRetorno] = useState(8.5)
  const [idade, setIdade] = useState(55)

  // CBT Question Generator based on inputs
  const getInsight = () => {
    if (idade < 40)
      return `Aposentar aos ${idade} exige sacrifício. Como está seu equilíbrio entre vida e poupança hoje? Cuidado com o burnout.`
    if (aporte > 10000)
      return `Ótimo aporte de R$ ${aporte.toLocaleString()}! O que você deixaria de fazer hoje para manter esse ritmo sem sacrificar sua saúde mental?`
    if (retorno > 10)
      return `Uma taxa de ${retorno}% ao ano é agressiva. Você tem um plano de contingência caso o mercado passe por uma longa crise?`
    if (idade > 70)
      return `Uma aposentadoria aos ${idade} pode trazer mais conforto hoje. Você está priorizando a qualidade de vida presente de forma consciente?`
    return `Como um aumento de 5% no seu aporte (R$ ${(aporte * 0.05).toFixed(0)}) hoje afetaria seu nível de estresse em 10 anos?`
  }

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Simulador: Ponto de Liberdade</CardTitle>
            <CardDescription>
              Projete o cruzamento entre seu patrimônio e custo de vida.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => {}} className="hidden md:flex">
            Salvar Cenário
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">
          <div className="md:col-span-4 h-full flex flex-col justify-center">
            <SimulatorControls
              aporte={aporte}
              setAporte={setAporte}
              retorno={retorno}
              setRetorno={setRetorno}
              idade={idade}
              setIdade={setIdade}
            />
          </div>
          <div className="md:col-span-8">
            <SimulatorChart aporte={aporte} retorno={retorno} idade={idade} />
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
