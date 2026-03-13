import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calculator, Loader2 } from 'lucide-react'
import { ColorPicker } from '@/components/ui/color-picker'
import { IconPicker } from '@/components/ui/icon-picker'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { Goal } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { differenceInMonths, addMonths, format } from 'date-fns'
import { getRandomPhrase, ADD_GOAL_PHRASES } from '@/lib/reflections'

export function GoalEditDialog({
  editingGoal,
  open,
  onOpenChange,
  onSuccess,
}: {
  editingGoal: Goal | null
  open: boolean
  onOpenChange: (o: boolean) => void
  onSuccess: (a: any) => void
}) {
  const { user } = useAuth()
  const { goals, setGoals, currentContext } = useAppStore()
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [calcMode, setCalcMode] = useState<'date' | 'deposit'>('date')
  const [name, setName] = useState('')
  const [targetVal, setTargetVal] = useState('')
  const [currentVal, setCurrentVal] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [monthlyDep, setMonthlyDep] = useState('')
  const [icon, setIcon] = useState('Target')
  const [color, setColor] = useState('#016ad9')

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name)
      setTargetVal(editingGoal.targetValue.toString())
      setCurrentVal(editingGoal.currentValue.toString())
      setTargetDate(editingGoal.targetDate)
      setMonthlyDep(editingGoal.monthlyDeposit.toString())
      setIcon(editingGoal.icon || 'Target')
      setColor(editingGoal.color || '#016ad9')
      setCalcMode('date')
    } else if (open) {
      setName('')
      setTargetVal('')
      setCurrentVal('')
      setTargetDate('')
      setMonthlyDep('')
      setIcon('Target')
      setColor('#016ad9')
    }
  }, [editingGoal, open])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)

    const calDate =
      calcMode === 'date'
        ? targetDate
        : format(
            addMonths(
              new Date(),
              Math.ceil((Number(targetVal) - Number(currentVal)) / Number(monthlyDep)),
            ),
            'yyyy-MM-dd',
          )
    const calDep =
      calcMode === 'deposit'
        ? Number(monthlyDep)
        : (Number(targetVal) - Number(currentVal)) /
          Math.max(1, differenceInMonths(new Date(targetDate), new Date()))

    const payload: any = {
      user_id: user.id,
      name,
      target_value: Number(targetVal),
      current_value: Number(currentVal),
      target_date: calDate,
      monthly_contribution: calDep,
      icon,
      color,
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
                  targetDate: calDate,
                  monthlyDeposit: calDep,
                  icon,
                  color,
                }
              : g,
          ),
        )
        toast({ title: 'Meta Atualizada' })
        onOpenChange(false)
      } else toast({ title: 'Erro', variant: 'destructive' })
    } else {
      const { data, error } = await supabase.from('goals').insert(payload).select().single()
      if (!error && data) {
        setGoals([
          {
            id: data.id,
            name: data.name,
            targetValue: Number(data.target_value),
            currentValue: Number(data.current_value),
            targetDate: data.target_date || calDate,
            monthlyDeposit: Number(data.monthly_contribution),
            icon: data.icon || 'Target',
            color: data.color,
            context: currentContext,
          },
          ...goals,
        ])
        onSuccess({
          title: 'Meta Criada com Sucesso!',
          description: 'Parabéns pelo planejamento.',
          reflection: getRandomPhrase(ADD_GOAL_PHRASES),
        })
        onOpenChange(false)
      } else toast({ title: 'Erro', variant: 'destructive' })
    }
    setIsSaving(false)
  }

  const diff = Number(targetVal) - Number(currentVal)
  let calculatedMsg = ''
  if (calcMode === 'date' && targetDate && diff > 0)
    calculatedMsg = `Aporte necessário: R$ ${(diff / Math.max(1, differenceInMonths(new Date(targetDate), new Date()))).toFixed(2)} /mês`
  else if (calcMode === 'deposit' && monthlyDep && Number(monthlyDep) > 0 && diff > 0)
    calculatedMsg = `Conclusão estimada: ${format(addMonths(new Date(), Math.ceil(diff / Number(monthlyDep))), 'MM/yyyy')}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <div className="space-y-2">
              <Label>Cor</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Nome da Meta</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
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
            <Label className="mb-2 block">Cálculo</Label>
            <Tabs
              value={calcMode}
              onValueChange={(v: any) => setCalcMode(v)}
              className="w-full mb-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="date">Por Data</TabsTrigger>
                <TabsTrigger value="deposit">Por Aporte</TabsTrigger>
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
              <div className="mt-4 p-3 bg-primary/10 border text-primary flex items-center gap-2 rounded-md text-sm">
                <Calculator className="w-4 h-4" />
                {calculatedMsg}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}{' '}
              {editingGoal ? 'Salvar Alterações' : 'Salvar Meta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
