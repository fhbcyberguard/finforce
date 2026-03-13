import { useState, useEffect } from 'react'
import useAppStore, { Goal } from '@/stores/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Target, Plus, Trash2, Calendar as CalIcon, Calculator, Edit2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'
import { differenceInMonths, addMonths, format } from 'date-fns'

export default function Metas() {
  const { goals, setGoals } = useAppStore()
  const [open, setOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const [calcMode, setCalcMode] = useState<'date' | 'deposit'>('date')
  const [name, setName] = useState('')
  const [targetVal, setTargetVal] = useState('')
  const [currentVal, setCurrentVal] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [monthlyDep, setMonthlyDep] = useState('')

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name)
      setTargetVal(editingGoal.targetValue.toString())
      setCurrentVal(editingGoal.currentValue.toString())
      setTargetDate(editingGoal.targetDate)
      setMonthlyDep(editingGoal.monthlyDeposit.toString())
      setCalcMode('date')
      setOpen(true)
    } else if (!open) {
      setName('')
      setTargetVal('')
      setCurrentVal('')
      setTargetDate('')
      setMonthlyDep('')
    }
  }, [editingGoal, open])

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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

    const newGoal = {
      id: editingGoal ? editingGoal.id : Math.random().toString(),
      name,
      targetValue: Number(targetVal),
      currentValue: Number(currentVal),
      targetDate: calculatedTargetDate,
      monthlyDeposit: calculatedMonthlyDep,
    }

    if (editingGoal) {
      setGoals(goals.map((g) => (g.id === editingGoal.id ? newGoal : g)))
      toast({ title: 'Meta Atualizada', description: 'Seu plano foi modificado com sucesso.' })
    } else {
      setGoals([...goals, newGoal])
      toast({ title: 'Meta Criada', description: 'Seu novo plano foi salvo com sucesso.' })
    }

    setOpen(false)
    setEditingGoal(null)
  }

  const confirmDelete = () => {
    setGoals(goals.filter((g) => g.id !== goalToDelete))
    toast({ title: 'Meta Removida', description: 'A meta foi excluída do seu painel.' })
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Metas e Sonhos</h1>
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
            <div className="space-y-2">
              <Label>Nome da Meta / Sonho</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Viagem, Carro Novo"
              />
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
              <Button type="submit" className="w-full">
                {editingGoal ? 'Salvar Alterações' : 'Salvar Meta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percent = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0
          const remaining = goal.targetValue - goal.currentValue
          const monthsToGoal =
            remaining > 0 && goal.monthlyDeposit > 0
              ? Math.ceil(remaining / goal.monthlyDeposit)
              : 0
          const years = Math.floor(monthsToGoal / 12)
          const months = monthsToGoal % 12
          const timeStr =
            remaining <= 0
              ? 'Concluída'
              : monthsToGoal > 0
                ? `${years > 0 ? `${years}a ` : ''}${months}m`
                : 'Sem previsão'

          return (
            <Card key={goal.id} className="border-border/50 flex flex-col group overflow-hidden">
              <CardContent className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Target className="w-5 h-5" />
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
                      onClick={() => setGoalToDelete(goal.id)}
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
              <div className="bg-muted/30 p-3 border-t flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Aporte Sugerido:</span>
                  <span className="font-medium text-foreground">
                    R$ {goal.monthlyDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    /mês
                  </span>
                </div>
                <div className="flex justify-between mt-1 pt-1 border-t border-border/50">
                  <span>Tempo Estimado:</span>
                  <span className="font-medium text-primary">{timeStr}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <ImpulseControlDialog
        open={!!goalToDelete}
        onOpenChange={(o) => !o && setGoalToDelete(null)}
        onConfirm={confirmDelete}
        title="Desistir da Meta?"
        description="Você está prestes a excluir este planejamento."
        reflectionText="Esta meta deixou de ser importante ou precisa de um novo plano? Pense nos seus valores de longo prazo."
        confirmText="Sim, Excluir"
      />
    </div>
  )
}
