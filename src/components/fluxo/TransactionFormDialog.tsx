import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Transaction, Goal, Category } from '@/stores/useAppStore'

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTx: Transaction | null
  onSubmit: (txData: any) => Promise<void>
  goals: Goal[]
  categories: Category[]
  familyMembers: any[]
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  editingTx,
  onSubmit,
  goals,
  categories,
  familyMembers,
}: TransactionFormDialogProps) {
  const [formType, setFormType] = useState('Expense')
  const [selectedGoalId, setSelectedGoalId] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState('none')

  useEffect(() => {
    if (open) {
      setFormType(editingTx?.type || 'Expense')
      setSelectedGoalId(editingTx?.goalId || '')
      setSelectedMemberId(editingTx?.member_id || 'none')
    } else {
      setFormType('Expense')
      setSelectedGoalId('')
      setSelectedMemberId('none')
    }
  }, [open, editingTx])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await onSubmit({
      date: fd.get('date'),
      type: formType,
      amount: fd.get('amount'),
      description: fd.get('description'),
      category: formType === 'Aporte' ? '' : fd.get('category'),
      expenseType: fd.get('expenseType'),
      member_id: selectedMemberId,
      profile: fd.get('profile'),
      goal_id: selectedGoalId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTx ? 'Editar Transação' : 'Registrar Transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                name="date"
                type="date"
                required
                defaultValue={editingTx?.date || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select name="type" required value={formType} onValueChange={(v) => setFormType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Expense">Despesa</SelectItem>
                  <SelectItem value="Revenue">Receita</SelectItem>
                  <SelectItem value="Aporte">Aporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                required
                defaultValue={editingTx ? Math.abs(editingTx.amount) : ''}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input name="description" required defaultValue={editingTx?.description || ''} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {formType === 'Aporte' ? (
              <div className="space-y-2">
                <Label>Meta</Label>
                <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a meta" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select name="category" defaultValue={editingTx?.category || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {formType !== 'Revenue' && formType !== 'Aporte' && (
              <div className="space-y-2">
                <Label>Classificação</Label>
                <Select name="expenseType" defaultValue={editingTx?.expenseType || 'variable'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="variable">Variável</SelectItem>
                    <SelectItem value="fixed">Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Membro</Label>
              <Select name="member_id" value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um membro..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {familyMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full bg-[#126eda] text-white hover:bg-[#126eda]/90">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
