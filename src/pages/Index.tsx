import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
import { Skeleton } from '@/components/ui/skeleton'
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
    isSyncing,
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
  const hasTransactions = transactions.length > 0

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

  if (isSyncing) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center">
            <ToggleGroup
              type="single"
              value={timeframe}
              onValueChange={(v) => v && setTimeframe(v as 'monthly' | 'annual')}
              className="bg-muted/50 p-1 rounded-lg grid grid-cols-2 sm:flex w-full sm:w-auto"
            >
              <ToggleGroupItem value="monthly" className="text-xs h-8">
                Mensal
              </ToggleGroupItem>
              <ToggleGroupItem value="annual" className="text-xs h-8">
                Anual
              </ToggleGroupItem>
            </ToggleGroup>

            <Button
              variant={showComparison ? 'secondary' : 'outline'}
              size="sm"
              className="h-10 bg-muted/50 border-0 focus:ring-1 hover:bg-muted w-full sm:w-auto"
              onClick={() => setShowComparison(!showComparison)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Comparar
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full">
            {timeframe === 'monthly' && (
              <div className="flex flex-1 sm:flex-none items-center justify-between bg-muted/50 rounded-md p-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm shrink-0"
                  onClick={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(v) => setSelectedMonth(Number(v))}
                >
                  <SelectTrigger className="h-8 w-full sm:w-[100px] text-xs bg-transparent border-0 focus:ring-0 justify-center text-center">
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
                  className="h-8 w-8 rounded-sm shrink-0"
                  onClick={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-9 w-[100px] sm:w-[90px] text-xs bg-muted/50 border-0 focus:ring-1 shrink-0">
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
          </div>
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

      {!hasTransactions ? (
        <div className="flex flex-col items-center justify-center p-10 mt-6 border border-dashed border-border/60 rounded-xl bg-muted/10 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhuma transação registrada ainda</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Seu painel está vazio. Comece a registrar suas receitas e despesas para visualizar o
            resumo financeiro, gráficos e projeções no tempo.
          </p>
          <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/transacoes">Ir para Fluxo de Caixa</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
      )}
    </div>
  )
}
