import { useState, useMemo, useEffect } from 'react'
import useAppStore, { Transaction } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Upload, Download, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DataImportDialog } from '@/components/fluxo/DataImportDialog'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'
import { TransactionTable } from '@/components/fluxo/TransactionTable'
import { TransactionSummaries } from '@/components/fluxo/TransactionSummaries'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

export default function FluxoCaixa() {
  const { user } = useAuth()
  const {
    isSyncing,
    transactions,
    setTransactions,
    profiles,
    accounts,
    creditCards,
    goals,
    setGoals,
    categories,
    searchQuery,
    timeframe,
    setTimeframe,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    currentContext,
  } = useAppStore()
  const [openAdd, setOpenAdd] = useState(false)
  const [openImport, setOpenImport] = useState(false)
  const [importType, setImportType] = useState<'csv' | 'ofx' | null>(null)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const { toast } = useToast()

  // Form State
  const [formType, setFormType] = useState('Expense')
  const [isPix, setIsPix] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState('none')
  const [selectedCard, setSelectedCard] = useState('none')
  const [selectedGoalId, setSelectedGoalId] = useState('')
  const [recurrenceType, setRecurrenceType] = useState('none')

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user) return
      const { data } = await supabase.from('members').select('*').eq('is_archived', false)
      if (data) setFamilyMembers(data)
    }
    fetchMembers()
  }, [user])

  const resetForm = () => {
    setEditingTx(null)
    setIsPix(false)
    setFormType('Expense')
    setSelectedAccount('none')
    setSelectedCard('none')
    setSelectedGoalId('')
    setRecurrenceType('none')
  }

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx)
    setIsPix(tx.type === 'Pix')
    setFormType(tx.type)
    setOpenAdd(true)
  }

  const filteredTransactions = useMemo(() => {
    const y = selectedYear || new Date().getFullYear().toString()
    const m = (selectedMonth + 1).toString().padStart(2, '0')
    const curr = `${y}-${m}`
    let l = transactions.filter((t) =>
      timeframe === 'monthly' ? t.date.startsWith(curr) : t.date.startsWith(y),
    )
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      l = l.filter(
        (t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q),
      )
    }
    return l.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, searchQuery, timeframe, selectedYear, selectedMonth])

  const summaries = useMemo(() => {
    let income = 0,
      expense = 0
    filteredTransactions.forEach((t) => {
      if (t.type === 'Transfer') return
      const isGain = t.type === 'Revenue' || t.type === 'Aporte' || t.category.includes('Renda')
      if (isGain) income += Math.abs(t.amount)
      else expense += Math.abs(t.amount)
    })
    return { income, expense, balance: income - expense }
  }, [filteredTransactions])

  const commitToUI = (tx: Transaction) => {
    if (tx.type === 'Aporte' && tx.goalId) {
      const g = goals.find((x) => x.id === tx.goalId)
      if (g)
        setGoals(
          goals.map((x) =>
            x.id === g.id ? { ...x, currentValue: x.currentValue + tx.amount } : x,
          ),
        )
    }
    setTransactions([tx, ...transactions])
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    const fd = new FormData(e.currentTarget)
    const type = fd.get('type') as string
    let amount = Number(fd.get('amount'))
    amount =
      type === 'Revenue' || type === 'Aporte' || type === 'Transfer'
        ? Math.abs(amount)
        : -Math.abs(amount)
    const category =
      type === 'Aporte'
        ? `Metas > ${goals.find((g) => g.id === selectedGoalId)?.name || 'Geral'}`
        : (fd.get('category') as string)

    const memberVal = fd.get('member_id') as string
    const member_id = memberVal === 'none' ? null : memberVal

    const newTx: any = {
      user_id: user.id,
      description: fd.get('description') as string,
      amount,
      category,
      type,
      date: new Date(`${fd.get('date')}T12:00:00Z`).toISOString(),
      expense_type: fd.get('expenseType') || null,
      account: selectedAccount === 'none' ? null : selectedAccount,
      card_id: selectedCard === 'none' ? null : selectedCard,
      recurrence: recurrenceType,
      installments: recurrenceType === 'installment' ? Number(fd.get('installments')) : null,
      profile: fd.get('profile') === 'none' ? null : fd.get('profile'),
      goal_id: type === 'Aporte' ? selectedGoalId : null,
      bank_broker: fd.get('bankBroker') || null,
      asset_name: fd.get('assetName') || null,
      context: currentContext,
      member_id,
    }

    if (editingTx) {
      const { data, error } = await supabase
        .from('transactions')
        .update(newTx)
        .eq('id', editingTx.id)
        .select('*, members(name, color)')
        .single()

      if (!error) {
        setTransactions(
          transactions.map((t) =>
            t.id === editingTx.id
              ? {
                  ...t,
                  ...newTx,
                  id: editingTx.id,
                  date: fd.get('date') as string,
                  members: data?.members,
                }
              : t,
          ),
        )
        toast({ title: 'Transação atualizada' })
        setOpenAdd(false)
        resetForm()
      }
    } else {
      const { data, error } = await supabase
        .from('transactions')
        .insert(newTx)
        .select('*, members(name, color)')
        .single()

      if (!error && data) {
        const t = { ...newTx, id: data.id, date: fd.get('date') as string, members: data.members }
        commitToUI(t)
        toast({ title: 'Transação adicionada' })
        setOpenAdd(false)
        resetForm()
      }
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) setTransactions(transactions.filter((t) => t.id !== id))
  }

  if (isSyncing) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Fluxo de Caixa
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <ToggleGroup
              type="single"
              value={timeframe}
              onValueChange={(v) => v && setTimeframe(v as 'monthly' | 'annual')}
              className="bg-muted/50 p-1 rounded-lg"
            >
              <ToggleGroupItem value="monthly">Mensal</ToggleGroupItem>
              <ToggleGroupItem value="annual">Anual</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" /> Importar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setImportType('ofx')
                    setOpenImport(true)
                  }}
                >
                  OFX
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="bg-[#126eda] text-white"
              onClick={() => {
                resetForm()
                setOpenAdd(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Nova Transação
            </Button>
          </div>
        </div>
      </div>

      <TransactionSummaries {...summaries} />

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto">
            <TransactionTable
              transactions={filteredTransactions}
              accounts={accounts}
              creditCards={creditCards}
              categories={categories}
              members={familyMembers}
              onEdit={openEdit}
              onDelete={handleDelete}
              onAdd={() => {
                resetForm()
                setOpenAdd(true)
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={openAdd}
        onOpenChange={(o) => {
          setOpenAdd(o)
          if (!o) resetForm()
        }}
      >
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTx ? 'Editar Transação' : 'Registrar Transação'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
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
                <Select
                  name="type"
                  required
                  onValueChange={(v) => {
                    setIsPix(v === 'Pix')
                    setFormType(v)
                  }}
                  defaultValue={editingTx?.type || 'Expense'}
                >
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
                      <SelectValue />
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
                      <SelectValue />
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
                <Select name="member_id" defaultValue={editingTx?.member_id || 'none'}>
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
              <Button type="submit" className="w-full bg-[#126eda] text-white">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <DataImportDialog open={openImport} onOpenChange={setOpenImport} importType={importType} />
    </div>
  )
}
