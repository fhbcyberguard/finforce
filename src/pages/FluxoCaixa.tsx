import { useState, useMemo, useEffect } from 'react'
import useAppStore, { Transaction } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DataImportDialog } from '@/components/fluxo/DataImportDialog'
import { TransactionTable } from '@/components/fluxo/TransactionTable'
import { TransactionSummaries } from '@/components/fluxo/TransactionSummaries'
import { TransactionFormDialog } from '@/components/fluxo/TransactionFormDialog'

export default function FluxoCaixa() {
  const { user } = useAuth()
  const {
    isSyncing,
    transactions,
    setTransactions,
    accounts,
    creditCards,
    goals,
    setGoals,
    categories,
    searchQuery,
    timeframe,
    setTimeframe,
    selectedYear,
    selectedMonth,
    currentContext,
  } = useAppStore()

  const [openAdd, setOpenAdd] = useState(false)
  const [openImport, setOpenImport] = useState(false)
  const [importType, setImportType] = useState<'csv' | 'ofx' | null>(null)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user) return
      const { data } = await supabase.from('members').select('*').eq('is_archived', false)
      if (data) setFamilyMembers(data)
    }
    fetchMembers()
  }, [user])

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

  const handleFormSubmit = async (txData: any) => {
    if (!user) return

    const type = txData.type
    let amount = Number(txData.amount)
    amount =
      type === 'Revenue' || type === 'Aporte' || type === 'Transfer'
        ? Math.abs(amount)
        : -Math.abs(amount)

    const category =
      type === 'Aporte'
        ? `Metas > ${goals.find((g) => g.id === txData.goal_id)?.name || 'Geral'}`
        : txData.category

    const member_id = txData.member_id === 'none' ? null : txData.member_id

    const newTx: any = {
      user_id: user.id,
      description: txData.description,
      amount,
      category,
      type,
      date: new Date(`${txData.date}T12:00:00Z`).toISOString(),
      expense_type: txData.expenseType || null,
      goal_id: type === 'Aporte' ? txData.goal_id : null,
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
              ? { ...t, ...newTx, id: editingTx.id, date: txData.date, members: data?.members }
              : t,
          ),
        )
        toast({ title: 'Transação atualizada' })
        setOpenAdd(false)
        setEditingTx(null)
      }
    } else {
      const { data, error } = await supabase
        .from('transactions')
        .insert(newTx)
        .select('*, members(name, color)')
        .single()

      if (!error && data) {
        const t = { ...newTx, id: data.id, date: txData.date, members: data.members }
        commitToUI(t)
        toast({ title: 'Transação adicionada' })
        setOpenAdd(false)
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
              className="bg-[#126eda] text-white hover:bg-[#126eda]/90"
              onClick={() => {
                setEditingTx(null)
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
              onEdit={(tx) => {
                setEditingTx(tx)
                setOpenAdd(true)
              }}
              onDelete={handleDelete}
              onAdd={() => {
                setEditingTx(null)
                setOpenAdd(true)
              }}
            />
          </div>
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={openAdd}
        onOpenChange={(o) => {
          setOpenAdd(o)
          if (!o) setEditingTx(null)
        }}
        editingTx={editingTx}
        onSubmit={handleFormSubmit}
        goals={goals}
        categories={categories}
        familyMembers={familyMembers}
      />

      <DataImportDialog open={openImport} onOpenChange={setOpenImport} importType={importType} />
    </div>
  )
}
