import useAppStore from '@/stores/useAppStore'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import KpiCards from '../components/dashboard/KpiCards'
import Simulator from '../components/dashboard/Simulator'
import AlertsPanel from '../components/dashboard/AlertsPanel'
import { CreditCardWidget } from '../components/dashboard/CreditCardWidget'
import { SpendingChart } from '../components/dashboard/SpendingChart'
import { GoalWidget } from '../components/dashboard/GoalWidget'

export default function Index() {
  const { timeframe, setTimeframe, currentContext } = useAppStore()

  const isBusiness = currentContext === 'business'

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {isBusiness ? 'Visão Empresarial' : 'Visão Geral'}
          </h1>
          <p className="text-muted-foreground">
            {isBusiness 
              ? 'Gerencie o fluxo de caixa e a saúde financeira do seu negócio.' 
              : 'Bem-vindo de volta. Acompanhe seu progresso rumo à independência.'}
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={timeframe}
          onValueChange={(v) => v && setTimeframe(v as 'monthly' | 'annual')}
          className="bg-muted/50 p-1 rounded-lg self-start sm:self-auto"
        >
          <ToggleGroupItem value="monthly" className="px-4 text-xs h-8">
            Mensal
          </ToggleGroupItem>
          <ToggleGroupItem value="annual" className="px-4 text-xs h-8">
            Anual
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Simulator />
          <SpendingChart />
        </div>
        <div className="flex flex-col gap-6">
          <AlertsPanel />
          <GoalWidget />
          <CreditCardWidget />
        </div>
      </div>
    </div>
  )
}
