import { useState, useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { BarChart3, ChevronLeft, ChevronRight } from 'lucide-react'
import KpiCards from '../components/dashboard/KpiCards'
import Simulator from '../components/dashboard/Simulator'
import AlertsPanel from '../components/dashboard/AlertsPanel'
import { CreditCardWidget } from '../components/dashboard/CreditCardWidget'
import { SpendingChart } from '../components/dashboard/SpendingChart'
import { GoalWidget } from '../components/dashboard/GoalWidget'
import { SpendingByPersonChart } from '../components/dashboard/SpendingByPersonChart'
import { HistoricalComparison } from '../components/dashboard/HistoricalComparison'

export default function Index() {
  const {
    timeframe,
    setTimeframe,
    currentContext,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    transactions,
  } = useAppStore()
  const [showComparison, setShowComparison] = useState(false)

  const isBusiness = currentContext === 'business'

  // Memoize to prevent Radix Select from recreating internal refs unnecessarily
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(transactions.map((t) => t.date.substring(0, 4)))).sort(
      (a, b) => b.localeCompare(a),
    )
    const currentYear = new Date().getFullYear().toString()
    if (!years.includes(currentYear)) {
      years.unshift(currentYear)
    }
    return years
  }, [transactions])

  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

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
          <Button
            variant={showComparison ? 'secondary' : 'outline'}
            size="sm"
            className="h-9 bg-muted/50 border-0 focus:ring-1 hover:bg-muted"
            onClick={() => setShowComparison(!showComparison)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Comparar
          </Button>

          {timeframe === 'monthly' && (
            <div className="flex items-center bg-muted/50 rounded-md p-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-sm"
                onClick={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(v) => setSelectedMonth(Number(v))}
              >
                <SelectTrigger className="h-8 w-[80px] text-xs bg-transparent border-0 focus:ring-0">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-sm"
                onClick={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 w-[90px] text-xs bg-muted/50 border-0 focus:ring-1">
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

      <Collapsible open={showComparison} onOpenChange={setShowComparison}>
        <CollapsibleContent>
          <div className="pb-6">
            <HistoricalComparison />
          </div>
        </CollapsibleContent>
      </Collapsible>

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
