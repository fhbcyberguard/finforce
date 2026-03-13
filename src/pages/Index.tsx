import useAppStore from '@/stores/useAppStore'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import KpiCards from '../components/dashboard/KpiCards'
import Simulator from '../components/dashboard/Simulator'
import AlertsPanel from '../components/dashboard/AlertsPanel'
import { CreditCardWidget } from '../components/dashboard/CreditCardWidget'
import { SpendingChart } from '../components/dashboard/SpendingChart'
import { GoalWidget } from '../components/dashboard/GoalWidget'
import { SpendingByPersonChart } from '../components/dashboard/SpendingByPersonChart'

export default function Index() {
  const { timeframe, setTimeframe, currentContext, selectedYear, setSelectedYear, transactions } =
    useAppStore()

  const isBusiness = currentContext === 'business'

  const availableYears = Array.from(new Set(transactions.map((t) => t.date.substring(0, 4)))).sort(
    (a, b) => b.localeCompare(a),
  )
  if (!availableYears.includes(new Date().getFullYear().toString())) {
    availableYears.unshift(new Date().getFullYear().toString())
  }

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start sm:self-auto">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 w-[100px] text-xs bg-muted/50 border-0 focus:ring-1">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup
            type="single"
            value={timeframe}
            onValueChange={(v) => v && setTimeframe(v as 'monthly' | 'annual')}
            className="bg-muted/50 p-1 rounded-lg"
          >
            <ToggleGroupItem value="monthly" className="px-4 text-xs h-8">
              Mensal
            </ToggleGroupItem>
            <ToggleGroupItem value="annual" className="px-4 text-xs h-8">
              Anual
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Simulator />
          <SpendingChart />
          <SpendingByPersonChart />
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
