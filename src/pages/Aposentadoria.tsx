import { useMemo, useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp, Landmark, Wallet, Plus, Activity, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { addMonths, format } from 'date-fns'

export default function Aposentadoria() {
  const { user } = useAuth()
  const { isSyncing, goals, setGoals, transactions, currentContext } = useAppStore()
  const { toast } = useToast()

  const [openAdd, setOpenAdd] = useState(false)
  const [name, setName] = useState('Independência Financeira')
  const [targetVal, setTargetVal] = useState('')
  const [currentVal, setCurrentVal] = useState('')
  const [monthlyDep, setMonthlyDep] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const retirementGoals = useMemo(() => {
    return goals.filter((g) => {
      const n = g.name.toLowerCase()
      return (
        n.includes('aposentadoria') ||
        n.includes('independência') ||
        n.includes('independencia') ||
        n.includes('liberdade') ||
        n.includes('longo prazo')
      )
    })
  }, [goals])

  const retirementGoalIds = useMemo(() => retirementGoals.map((g) => g.id), [retirementGoals])

  const { totalTarget, totalCurrent, totalMonthlyTarget } = useMemo(() => {
    return retirementGoals.reduce(
      (acc, g) => ({
        totalTarget: acc.totalTarget + g.targetValue,
        totalCurrent: acc.totalCurrent + g.currentValue,
        totalMonthlyTarget: acc.totalMonthlyTarget + g.monthlyDeposit,
      }),
      { totalTarget: 0, totalCurrent: 0, totalMonthlyTarget: 0 },
    )
  }, [retirementGoals])

  const currentMonthStr = new Date().toISOString().substring(0, 7)

  const { recentTransactions, monthlyActual } = useMemo(() => {
    const txs = transactions.filter(
      (t) => t.type === 'Aporte' && t.goalId && retirementGoalIds.includes(t.goalId),
    )

    const actual = txs
      .filter((t) => t.date.startsWith(currentMonthStr))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const recent = txs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    return { recentTransactions: recent, monthlyActual: actual }
  }, [transactions, retirementGoalIds, currentMonthStr])

  const progressPercent = totalTarget > 0 ? Math.min((totalCurrent / totalTarget) * 100, 100) : 0
  const monthlyPercent =
    totalMonthlyTarget > 0 ? Math.min((monthlyActual / totalMonthlyTarget) * 100, 100) : 0

  const handleSaveGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)

    const diff = Number(targetVal) - Number(currentVal)
    const monthsNeeded =
      diff > 0 && Number(monthlyDep) > 0 ? Math.ceil(diff / Number(monthlyDep)) : 0
    const targetDate = format(addMonths(new Date(), monthsNeeded), 'yyyy-MM-dd')

    const payload: any = {
      user_id: user.id,
      name,
      target_value: Number(targetVal),
      current_value: Number(currentVal),
      monthly_contribution: Number(monthlyDep),
      target_date: targetDate,
      icon: 'Landmark',
    }

    const { data, error } = await supabase.from('goals').insert(payload).select().single()

    setIsSaving(false)

    if (!error && data) {
      const newGoal = {
        id: data.id,
        name: data.name,
        targetValue: Number(data.target_value),
        currentValue: Number(data.current_value),
        monthlyDeposit: Number(data.monthly_contribution),
        targetDate: data.target_date || targetDate,
        icon: data.icon || 'Landmark',
        context: currentContext,
      }
      setGoals([newGoal, ...goals])
      toast({
        title: 'Plano criado',
        description: 'Seu plano de independência foi iniciado com sucesso.',
      })
      setOpenAdd(false)
      setName('Independência Financeira')
      setTargetVal('')
      setCurrentVal('')
      setMonthlyDep('')
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o plano.',
        variant: 'destructive',
      })
    }
  }

  if (isSyncing) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Aposentadoria & Independência
          </h1>
          <p className="text-muted-foreground">
            Gestão exclusiva das suas reservas de longo prazo e aportes mensais.
          </p>
        </div>
        {retirementGoals.length > 0 && (
          <Button className="gap-2" onClick={() => setOpenAdd(true)}>
            <Plus className="w-4 h-4" /> Novo Plano
          </Button>
        )}
      </div>

      {retirementGoals.length === 0 ? (
        <Card className="border-border/50 bg-muted/10 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Landmark className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum plano de longo prazo ativo</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Inicie seu planejamento de independência financeira para acompanhar sua reserva e
              evolução dos aportes.
            </p>
            <Button className="gap-2" onClick={() => setOpenAdd(true)}>
              <Plus className="w-4 h-4" /> Criar Plano de Aposentadoria
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-primary/5 w-32 h-32 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <Landmark className="w-5 h-5" />
                  Reserva Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-bold">
                      R$ {totalCurrent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">
                      / R$ {totalTarget.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                  <p className="text-xs text-right text-muted-foreground font-medium">
                    {progressPercent.toFixed(2)}% Concluído
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-emerald-500/5 w-32 h-32 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-500">
                  <TrendingUp className="w-5 h-5" />
                  Aportes do Mês
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-bold">
                      R$ {monthlyActual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">
                      / R${' '}
                      {totalMonthlyTarget.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <Progress
                    value={monthlyPercent}
                    className="h-3 bg-muted"
                    indicatorClassName={monthlyPercent >= 100 ? 'bg-emerald-500' : 'bg-emerald-400'}
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">
                      Progresso da meta mensal
                    </span>
                    <span className="text-muted-foreground font-medium">
                      {monthlyPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Aportes Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2 border border-dashed rounded-lg bg-muted/10">
                  <Wallet className="w-8 h-8 opacity-20" />
                  Nenhum aporte registrado ainda. Adicione transações do tipo "Aporte" direcionadas
                  a estes planos.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ativo / Instituição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {tx.description}
                          {tx.goalId && (
                            <Badge
                              variant="outline"
                              className="ml-2 text-[10px] font-normal border-primary/20 text-primary bg-primary/5"
                            >
                              {goals.find((g) => g.id === tx.goalId)?.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {tx.assetName && (
                              <span className="font-medium text-foreground">{tx.assetName}</span>
                            )}
                            {tx.bankBroker && <span>({tx.bankBroker})</span>}
                            {!tx.assetName && !tx.bankBroker && '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium text-emerald-500">
                          + R${' '}
                          {Math.abs(tx.amount).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Planejar Independência Financeira</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveGoal} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Plano</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Aposentadoria, Independência"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alvo Final (R$)</Label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={targetVal}
                  onChange={(e) => setTargetVal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Saldo Atual (R$)</Label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={currentVal}
                  onChange={(e) => setCurrentVal(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meta de Aporte Mensal (R$)</Label>
              <Input
                type="number"
                required
                min="0"
                value={monthlyDep}
                onChange={(e) => setMonthlyDep(e.target.value)}
              />
            </div>

            {targetVal &&
              currentVal &&
              monthlyDep &&
              Number(monthlyDep) > 0 &&
              Number(targetVal) > Number(currentVal) && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-md flex items-center gap-2 text-primary font-medium text-sm mt-2">
                  <Target className="w-4 h-4" />
                  Conclusão estimada:{' '}
                  {format(
                    addMonths(
                      new Date(),
                      Math.ceil((Number(targetVal) - Number(currentVal)) / Number(monthlyDep)),
                    ),
                    'MM/yyyy',
                  )}
                </div>
              )}

            <DialogFooter className="mt-6 pt-4">
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isSaving ? 'Salvando...' : 'Salvar Plano'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
