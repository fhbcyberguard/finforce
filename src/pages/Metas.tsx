import { useState, useEffect, useMemo } from 'react'
import useAppStore, { Goal } from '@/stores/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Calendar as CalIcon, Calculator, Edit2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'
import { differenceInMonths, addMonths, format, differenceInYears } from 'date-fns'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { IconPicker } from '@/components/ui/icon-picker'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { AreaChart, Area, ReferenceLine, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { GOAL_DELETION_PHRASES, ADD_GOAL_PHRASES, getRandomPhrase } from '@/lib/reflections'

export default function Metas() {
  const { user, profile } = useAuth()
  const { goals, setGoals, currentContext, isSyncing } = useAppStore()
  const [open, setOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const [deleteReflection, setDeleteReflection] = useState('')
  const [successAction, setSuccessAction] = useState<{
    title: string
    description: string
    reflection: string
  } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [calcMode, setCalcMode] = useState<'date' | 'deposit'>('date')
  const [name, setName] = useState('')
  const [targetVal, setTargetVal] = useState('')
  const [currentVal, setCurrentVal] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [monthlyDep, setMonthlyDep] = useState('')
  const [icon, setIcon] = useState('Target')

  const currentAge = useMemo(() => {
    if (profile?.birth_date) {
      return differenceInYears(new Date(), new Date(profile.birth_date))
    }
    return 35
  }, [profile])

  const generalGoals = useMemo(() => {
    return goals.filter((g) => {
      const n = g.name.toLowerCase()
      return !(
        n.includes('aposentadoria') ||
        n.includes('independência') ||
        n.includes('independencia') ||
        n.includes('liberdade') ||
        n.includes('longo prazo')
      )
    })
  }, [goals])

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name)
      setTargetVal(editingGoal.targetValue.toString())
      setCurrentVal(editingGoal.currentValue.toString())
      setTargetDate(editingGoal.targetDate)
      setMonthlyDep(editingGoal.monthlyDeposit.toString())
      setIcon(editingGoal.icon || 'Target')
      setCalcMode('date')
      setOpen(true)
    } else if (!open) {
      setName('')
      setTargetVal('')
      setCurrentVal('')
      setTargetDate('')
      setMonthlyDep('')
      setIcon('Target')
    }
  }, [editingGoal, open])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)

    const calculatedTargetDate =
      calcMode === 'date'
        ? targetDate
        : format(
            addMonths(
              new Date(),
              Math.ceil((Number(targetVal) - Number(currentVal)) / Number(monthlyDep)),
            ),
            'yyyy-MM-dd',
          )

    const calculatedMonthlyDep =
      calcMode === 'deposit'
        ? Number(monthlyDep)
        : (Number(targetVal) - Number(currentVal)) /
          Math.max(1, differenceInMonths(new Date(targetDate), new Date()))

    const payload: any = {
      user_id: user.id,
      name,
      target_value: Number(targetVal),
      current_value: Number(currentVal),
      target_date: calculatedTargetDate,
      monthly_contribution: calculatedMonthlyDep,
      icon,
    }

    if (editingGoal) {
      const { error } = await supabase.from('goals').update(payload).eq('id', editingGoal.id)
      if (!error) {
        setGoals(
          goals.map((g) =>
            g.id === editingGoal.id
              ? {
                  ...g,
                  name,
                  targetValue: Number(targetVal),
                  currentValue: Number(currentVal),
                  targetDate: calculatedTargetDate,
                  monthlyDeposit: calculatedMonthlyDep,
                  icon,
                }
              : g,
          ),
        )
        toast({ title: 'Meta Atualizada', description: 'Seu plano foi modificado com sucesso.' })
        setOpen(false)
        setEditingGoal(null)
      } else {
        toast({ title: 'Erro', description: 'Não foi possível atualizar.', variant: 'destructive' })
      }
    } else {
      const { data, error } = await supabase.from('goals').insert(payload).select().single()
      if (!error && data) {
        const newGoal = {
          id: data.id,
          name: data.name,
          targetValue: Number(data.target_value),
          currentValue: Number(data.current_value),
          targetDate: data.target_date || calculatedTargetDate,
          monthlyDeposit: Number(data.monthly_contribution),
          icon: data.icon || 'Target',
          context: currentContext,
        }
        setGoals([newGoal, ...goals])
        setOpen(false)
        setEditingGoal(null)
        setSuccessAction({
          title: 'Meta Criada com Sucesso!',
          description: 'Parabéns pelo seu novo planejamento financeiro.',
          reflection: getRandomPhrase(ADD_GOAL_PHRASES),
        })
      } else {
        toast({ title: 'Erro', description: 'Não foi possível salvar.', variant: 'destructive' })
      }
    }

    setIsSaving(false)
  }

  const confirmDelete = async () => {
    if (!goalToDelete) return
    const { error } = await supabase.from('goals').delete().eq('id', goalToDelete)
    if (!error) {
      setGoals(goals.filter((g) => g.id !== goalToDelete))
      toast({ title: 'Meta Removida', description: 'A meta foi excluída do seu painel.' })
    } else {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
    setGoalToDelete(null)
  }

  if (isSyncing) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
        </div>
      </div>
    )
  }

  const diff = Number(targetVal) - Number(currentVal)
  let calculatedMsg = ''
  if (calcMode === 'date' && targetDate && diff > 0) {
    const months = differenceInMonths(new Date(targetDate), new Date())
    if (months > 0) calculatedMsg = `Aporte necessário: R$ ${(diff / months).toFixed(2)} /mês`
  } else if (calcMode === 'deposit' && monthlyDep && Number(monthlyDep) > 0 && diff > 0) {
    const months = diff / Number(monthlyDep)
    const date = addMonths(new Date(), Math.ceil(months))
    calculatedMsg = `Conclusão estimada: ${format(date, 'MM/yyyy')}`
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Metas e Sonhos
          </h1>
          <p className="text-muted-foreground">Planeje e calcule o tempo para suas conquistas.</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingGoal(null)
            setOpen(true)
          }}
        >
          <Plus className="w-4 h-4" /> Nova Meta
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) setEditingGoal(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Editar Meta' : 'Planejar Nova Meta'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label>Ícone</Label>
                <IconPicker value={icon} onChange={setIcon} />
              </div>
              <div className="space-y-2 flex-1">
                <Label>Nome da Meta / Sonho</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Viagem, Carro Novo"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Alvo (R$)</Label>
                <Input
                  type="number"
                  required
                  value={targetVal}
                  onChange={(e) => setTargetVal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Atual (R$)</Label>
                <Input
                  type="number"
                  required
                  value={currentVal}
                  onChange={(e) => setCurrentVal(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-2 border-t">
              <Label className="mb-2 block">O que você deseja calcular?</Label>
              <Tabs
                value={calcMode}
                onValueChange={(v: any) => setCalcMode(v)}
                className="w-full mb-4"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="date">Descobrir Aporte</TabsTrigger>
                  <TabsTrigger value="deposit">Descobrir Tempo</TabsTrigger>
                </TabsList>
              </Tabs>
              {calcMode === 'date' ? (
                <div className="space-y-2">
                  <Label>Data Desejada</Label>
                  <Input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Aporte Mensal (R$)</Label>
                  <Input
                    type="number"
                    required
                    value={monthlyDep}
                    onChange={(e) => setMonthlyDep(e.target.value)}
                  />
                </div>
              )}
              {calculatedMsg && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md flex items-center gap-2 text-primary font-medium text-sm">
                  <Calculator className="w-4 h-4" />
                  {calculatedMsg}
                </div>
              )}
            </div>
            <DialogFooter className="mt-6 pt-4">
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editingGoal ? 'Salvar Alterações' : 'Salvar Meta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generalGoals.map((goal) => {
          const percent = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0
          const remaining = goal.targetValue - goal.currentValue
          const monthsToGoal =
            remaining > 0 && goal.monthlyDeposit > 0 ? remaining / goal.monthlyDeposit : 0
          const years = Math.floor(monthsToGoal / 12)
          const months = Math.ceil(monthsToGoal % 12)
          const timeStr =
            remaining <= 0
              ? 'Concluída'
              : monthsToGoal > 0
                ? `${years > 0 ? `${years}a ` : ''}${months}m`
                : 'Sem previsão'

          const ageAtCompletion = currentAge + monthsToGoal / 12

          const chartData = []
          let curr = goal.currentValue
          const totalYearsProj = Math.min(Math.max(Math.ceil(monthsToGoal / 12), 1), 30)
          for (let i = 0; i <= totalYearsProj; i++) {
            chartData.push({ age: currentAge + i, value: Math.round(curr) })
            curr += goal.monthlyDeposit * 12
            if (curr > goal.targetValue && i >= totalYearsProj - 1) {
              curr = goal.targetValue
            }
          }

          return (
            <Card key={goal.id} className="border-border/50 flex flex-col group overflow-hidden">
              <CardContent className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <DynamicIcon name={goal.icon || 'Target'} className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingGoal(goal)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setGoalToDelete(goal.id)
                        setDeleteReflection(getRandomPhrase(GOAL_DELETION_PHRASES))
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <CalIcon className="w-3.5 h-3.5" />
                    <span>Alvo: {format(new Date(goal.targetDate), 'MMM yyyy')}</span>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm items-end">
                    <span className="font-bold text-xl">
                      R$ {goal.currentValue.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-muted-foreground">
                      / R$ {goal.targetValue.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <Progress value={percent} className="h-2.5" />
                  <p className="text-xs text-right text-muted-foreground">{percent.toFixed(1)}%</p>
                </div>
              </CardContent>
              <div className="bg-muted/10 p-4 border-t flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Aporte Sugerido:</span>
                  <span className="font-medium text-foreground">
                    R$ {goal.monthlyDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    /mês
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-0.5">Tempo Estimado</p>
                    <p className="font-medium text-foreground">{timeStr}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground mb-0.5">Idade na Conclusão</p>
                    <p className="font-medium text-primary">
                      {remaining <= 0
                        ? 'Alcançado'
                        : monthsToGoal > 0
                          ? `${Math.ceil(ageAtCompletion)} anos`
                          : '-'}
                    </p>
                  </div>
                </div>

                {monthsToGoal > 0 && remaining > 0 && (
                  <div className="mt-2 h-24 w-full">
                    <ChartContainer
                      config={{ value: { label: 'Projeção', color: 'hsl(var(--primary))' } }}
                      className="h-full w-full"
                    >
                      <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`fill-${goal.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="age"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `${v}a`}
                          fontSize={10}
                          className="text-muted-foreground"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ReferenceLine
                          y={goal.targetValue}
                          stroke="hsl(var(--destructive))"
                          strokeDasharray="3 3"
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="var(--color-value)"
                          fill={`url(#fill-${goal.id})`}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
        {generalGoals.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed rounded-lg bg-muted/10 text-muted-foreground">
            Você ainda não possui metas registradas. Planeje seus sonhos clicando em "Nova Meta".
          </div>
        )}
      </div>

      <ImpulseControlDialog
        open={!!goalToDelete}
        onOpenChange={(o) => !o && setGoalToDelete(null)}
        onConfirm={confirmDelete}
        title="Desistir da Meta?"
        description="Você está prestes a excluir este planejamento."
        reflectionText={deleteReflection}
        confirmText="Sim, Excluir"
      />

      <ImpulseControlDialog
        open={!!successAction}
        onOpenChange={(o) => {
          if (!o && successAction) setSuccessAction(null)
        }}
        onConfirm={() => setSuccessAction(null)}
        title={successAction?.title || ''}
        description={successAction?.description || ''}
        reflectionText={successAction?.reflection || ''}
        confirmText="Continuar"
        mode="success"
      />
    </div>
  )
}
