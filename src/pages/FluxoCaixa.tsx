import { useState, useMemo, useEffect } from 'react'
import useAppStore, { Transaction, DEFAULT_CATEGORIES } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Receipt,
  Repeat,
  ArrowRightLeft,
  Upload,
  Paperclip,
  Download,
  MoreVertical,
  Edit2,
  Trash2,
  CreditCard,
  Target,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DataImportDialog } from '@/components/fluxo/DataImportDialog'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

export default function FluxoCaixa() {
  const { user } = useAuth()
  const {
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
  } = useAppStore()

  const [openAdd, setOpenAdd] = useState(false)
  const [openImport, setOpenImport] = useState(false)
  const [importType, setImportType] = useState<'csv' | 'ofx' | null>(null)
  const [isPix, setIsPix] = useState(false)
  const [formType, setFormType] = useState('Expense')
  const [fileName, setFileName] = useState('')
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  const [selectedAccount, setSelectedAccount] = useState<string>('none')
  const [selectedCard, setSelectedCard] = useState<string>('none')
  const [selectedGoalId, setSelectedGoalId] = useState<string>('')
  const [recurrenceType, setRecurrenceType] = useState('none')

  // TCC Trigger State
  const [pendingLargeExpense, setPendingLargeExpense] = useState<Transaction | null>(null)

  const { toast } = useToast()

  const allCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES
  const availableCategories = allCategories.filter((c) => c.type === formType)

  const resetForm = () => {
    setEditingTx(null)
    setFileName('')
    setIsPix(false)
    setFormType('Expense')
    setSelectedAccount('none')
    setSelectedCard('none')
    setSelectedGoalId('')
    setRecurrenceType('none')
  }

  useEffect(() => {
    if (openAdd) {
      if (editingTx) {
        setFormType(editingTx.type)
        setIsPix(editingTx.type === 'Pix')

        const hasAcc = editingTx.account && editingTx.account !== 'none'
        const foundAcc = hasAcc
          ? accounts.find((a) => a.id === editingTx.account || a.bank === editingTx.account)
          : null
        setSelectedAccount(foundAcc ? foundAcc.id : hasAcc ? editingTx.account : 'none')

        setSelectedCard(editingTx.cardId || 'none')
        setRecurrenceType(editingTx.recurrence || 'none')

        if (editingTx.type === 'Aporte') {
          if (editingTx.goalId) {
            setSelectedGoalId(editingTx.goalId)
          } else {
            const match = goals.find((g) => editingTx.category.includes(g.name))
            if (match) setSelectedGoalId(match.id)
          }
        }
      } else {
        setFormType('Expense')
        setSelectedAccount('none')
        setSelectedCard('none')
        setSelectedGoalId('')
        setRecurrenceType('none')
      }
    }
  }, [openAdd, editingTx, accounts, goals])

  const handleCardChange = (cardId: string) => {
    setSelectedCard(cardId)
    if (cardId !== 'none') {
      const card = creditCards.find((c) => c.id === cardId)
      if (card && card.accountId && card.accountId !== 'none') {
        setSelectedAccount(card.accountId)
      }
    }
  }

  const handleExport = () => {
    const headers = [
      'Data',
      'Descrição',
      'Valor',
      'Tipo',
      'Categoria',
      'Perfil Responsável',
      'Conta/Cartão',
      'Banco/Investidora',
      'Ativo',
    ]

    const rows = transactions.map((tx) => {
      const accStr = accounts.find((a) => a.id === tx.account)?.bank || tx.account || ''
      const cardStr = creditCards.find((c) => c.id === tx.cardId)?.name || ''
      const accOrCard = cardStr ? (accStr ? `${accStr} (${cardStr})` : cardStr) : accStr

      return [
        tx.date,
        `"${tx.description}"`,
        tx.amount.toString(),
        tx.type,
        `"${tx.category}"`,
        `"${tx.profile || ''}"`,
        `"${accOrCard}"`,
        `"${tx.bankBroker || ''}"`,
        `"${tx.assetName || ''}"`,
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transacoes_finflow.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ title: 'Exportação Concluída', description: 'O arquivo CSV foi baixado com sucesso.' })
  }

  const handleSave = async (txToSave: Transaction) => {
    if (!user) return

    const dbPayload: any = {
      user_id: user.id,
      description: txToSave.description,
      amount: txToSave.amount,
      type: txToSave.type,
      category: txToSave.category,
      date: new Date(`${txToSave.date}T12:00:00Z`).toISOString(),
      expense_type: txToSave.expenseType,
      account: txToSave.account || null,
      card_id: txToSave.cardId || null,
      recurrence: txToSave.recurrence,
      installments: txToSave.installments || null,
      has_attachment: txToSave.hasAttachment,
      profile: txToSave.profile,
      goal_id: txToSave.goalId || null,
      bank_broker: txToSave.bankBroker || null,
      asset_name: txToSave.assetName || null,
    }

    if (editingTx) {
      const { error } = await supabase.from('transactions').update(dbPayload).eq('id', editingTx.id)
      if (!error) {
        if (txToSave.type === 'Aporte' && txToSave.goalId) {
          const diff = txToSave.amount - editingTx.amount
          if (diff !== 0) {
            const goal = goals.find((g) => g.id === txToSave.goalId)
            if (goal) {
              const newBalance = goal.currentValue + diff
              await supabase.from('goals').update({ current_value: newBalance }).eq('id', goal.id)
              setGoals(
                goals.map((g) => (g.id === goal.id ? { ...g, currentValue: newBalance } : g)),
              )
            }
          }
        }

        const updatedTx = { ...txToSave, id: editingTx.id }
        setTransactions(transactions.map((t) => (t.id === editingTx.id ? updatedTx : t)))
        toast({
          title: 'Transação atualizada',
          description: 'O registro foi modificado com sucesso.',
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Falha ao atualizar transação.',
          variant: 'destructive',
        })
      }
    } else {
      const { data, error } = await supabase
        .from('transactions')
        .insert(dbPayload)
        .select()
        .single()
      if (!error && data) {
        if (txToSave.type === 'Aporte' && txToSave.goalId) {
          const goal = goals.find((g) => g.id === txToSave.goalId)
          if (goal) {
            const newBalance = goal.currentValue + txToSave.amount
            await supabase.from('goals').update({ current_value: newBalance }).eq('id', goal.id)
            setGoals(goals.map((g) => (g.id === goal.id ? { ...g, currentValue: newBalance } : g)))
          }
        }

        const finalTx = { ...txToSave, id: data.id }
        setTransactions([finalTx, ...transactions])
        toast({ title: 'Transação adicionada', description: 'O fluxo de caixa foi atualizado.' })
      } else {
        toast({ title: 'Erro', description: 'Falha ao salvar transação.', variant: 'destructive' })
      }
    }
    setOpenAdd(false)
    resetForm()
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const type = fd.get('type') as string
    const date = fd.get('date') as string
    let amount = Number(fd.get('amount'))

    let category = ''

    const isGain = type === 'Revenue' || type === 'Aporte'

    if (!isGain && type !== 'Transfer') amount = -Math.abs(amount)
    else amount = Math.abs(amount)

    if (type === 'Aporte') {
      const goal = goals.find((g) => g.id === selectedGoalId)
      category = `Metas > ${goal?.name || 'Geral'}`
    } else {
      category = fd.get('category') as string
    }

    const rawExpenseType = fd.get('expenseType') as 'fixed' | 'variable' | null
    const expenseType = !isGain && type !== 'Transfer' ? rawExpenseType || 'variable' : undefined

    const accountField = selectedAccount === 'none' ? '' : selectedAccount
    const cardField = selectedCard === 'none' ? undefined : selectedCard
    const installments =
      recurrenceType === 'installment' ? Number(fd.get('installments')) : undefined

    const newTx: Transaction = {
      id: editingTx ? editingTx.id : '',
      date,
      description: fd.get('description') as string,
      amount,
      category,
      type,
      account: accountField,
      cardId: cardField,
      goalId: type === 'Aporte' ? selectedGoalId : undefined,
      recurrence: recurrenceType,
      installments,
      hasAttachment: !!fileName || (editingTx?.hasAttachment ?? false),
      profile: fd.get('profile') as string,
      expenseType,
      bankBroker: type === 'Aporte' ? (fd.get('bankBroker') as string) : undefined,
      assetName: type === 'Aporte' ? (fd.get('assetName') as string) : undefined,
    }

    if (amount < -1000 && !editingTx && !isGain && type !== 'Transfer') {
      setPendingLargeExpense(newTx)
      setOpenAdd(false)
    } else {
      handleSave(newTx)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    const tx = transactions.find((t) => t.id === id)
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) {
      if (tx?.type === 'Aporte' && tx.goalId) {
        const goal = goals.find((g) => g.id === tx.goalId)
        if (goal) {
          const newBalance = goal.currentValue - tx.amount
          await supabase.from('goals').update({ current_value: newBalance }).eq('id', goal.id)
          setGoals(goals.map((g) => (g.id === goal.id ? { ...g, currentValue: newBalance } : g)))
        }
      }
      setTransactions(transactions.filter((t) => t.id !== id))
      toast({ title: 'Transação removida', description: 'O registro foi apagado.' })
    } else {
      toast({ title: 'Erro', description: 'Falha ao apagar transação.', variant: 'destructive' })
    }
  }

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx)
    setIsPix(tx.type === 'Pix')
    setFormType(tx.type)
    setOpenAdd(true)
  }

  const getIconForType = (type: string, isGain: boolean) => {
    if (type === 'Aporte') return <Target className="w-4 h-4 text-primary" />
    if (isGain) return <ArrowUpRight className="w-4 h-4 text-emerald-500" />
    switch (type) {
      case 'Expense':
        return <ArrowDownRight className="w-4 h-4 text-rose-500" />
      case 'Pix':
        return <Receipt className="w-4 h-4 text-rose-500" />
      case 'Transfer':
        return <ArrowRightLeft className="w-4 h-4 text-primary" />
      default:
        return <ArrowDownRight className="w-4 h-4 text-rose-500" />
    }
  }

  const availableYears = Array.from(new Set(transactions.map((t) => t.date.substring(0, 4)))).sort(
    (a, b) => b.localeCompare(a),
  )
  if (!availableYears.includes(new Date().getFullYear().toString())) {
    availableYears.unshift(new Date().getFullYear().toString())
  }

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    const yearToUse = selectedYear || now.getFullYear().toString()
    const currentMonth = `${yearToUse}-${now.toISOString().slice(5, 7)}`

    let list = transactions.filter((t) => {
      if (timeframe === 'monthly') return t.date.startsWith(currentMonth)
      if (timeframe === 'annual') return t.date.startsWith(yearToUse)
      return true
    })

    if (!searchQuery) return list
    const lower = searchQuery.toLowerCase()
    return list.filter(
      (t) =>
        t.description.toLowerCase().includes(lower) ||
        t.category.toLowerCase().includes(lower) ||
        (t.profile && t.profile.toLowerCase().includes(lower)) ||
        (t.account && t.account.toLowerCase().includes(lower)),
    )
  }, [transactions, searchQuery, timeframe, selectedYear])

  const isGainType = formType === 'Revenue' || formType === 'Aporte'

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Transações</h1>
          <p className="text-muted-foreground">Visão detalhada de entradas e saídas.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-wrap items-start sm:items-center">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 w-[100px] text-xs">
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
            className="bg-muted/50 p-1 rounded-lg w-full sm:w-auto"
          >
            <ToggleGroupItem value="monthly" className="flex-1 sm:px-4 text-xs h-9">
              Mensal
            </ToggleGroupItem>
            <ToggleGroupItem value="annual" className="flex-1 sm:px-4 text-xs h-9">
              Anual
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex gap-2 w-full sm:w-auto flex-wrap justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
                  <Upload className="w-4 h-4" /> Importar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setImportType('ofx')
                    setOpenImport(true)
                  }}
                >
                  Importar OFX
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setImportType('csv')
                    setOpenImport(true)
                  }}
                >
                  Importar CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={handleExport}>
              <Download className="w-4 h-4 text-[#126eda]" /> Exportar
            </Button>

            <Button
              className="gap-2 w-full sm:w-auto bg-[#126eda] text-white hover:bg-[#126eda]/90"
              onClick={() => {
                resetForm()
                setOpenAdd(true)
              }}
            >
              <Plus className="w-4 h-4" /> Nova Transação
            </Button>
          </div>

          <Dialog
            open={openAdd}
            onOpenChange={(o) => {
              setOpenAdd(o)
              if (!o) resetForm()
            }}
          >
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>{editingTx ? 'Editar Transação' : 'Registrar Transação'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Expense">Despesa</SelectItem>
                        <SelectItem value="Revenue">Receita</SelectItem>
                        <SelectItem value="Aporte">Aporte (Investimentos/Metas)</SelectItem>
                        <SelectItem value="Pix">Pix</SelectItem>
                        <SelectItem value="Transfer">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      defaultValue={editingTx ? Math.abs(editingTx.amount) : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    name="description"
                    placeholder={
                      formType === 'Aporte' ? 'Ex: Aporte Mensal Viagem' : 'Ex: Conta de Luz'
                    }
                    required
                    defaultValue={editingTx?.description || ''}
                  />
                </div>

                <div
                  className={`grid ${formType === 'Aporte' ? 'grid-cols-1 sm:grid-cols-3' : isGainType || formType === 'Transfer' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
                >
                  {formType === 'Aporte' ? (
                    <>
                      <div className="space-y-2">
                        <Label>Destino do Aporte (Meta)</Label>
                        <Select value={selectedGoalId} onValueChange={setSelectedGoalId} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a meta" />
                          </SelectTrigger>
                          <SelectContent>
                            {goals.length === 0 ? (
                              <SelectItem value="none" disabled>
                                Nenhuma meta cadastrada
                              </SelectItem>
                            ) : (
                              goals.map((g) => (
                                <SelectItem key={g.id} value={g.id}>
                                  <div className="flex items-center gap-2">
                                    <DynamicIcon name={g.icon || 'Target'} className="w-4 h-4" />
                                    {g.name}
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Banco/Investidora</Label>
                        <Input
                          name="bankBroker"
                          placeholder="Ex: NuInvest, XP"
                          defaultValue={editingTx?.bankBroker || ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ativo</Label>
                        <Input
                          name="assetName"
                          placeholder="Ex: PETR4, Tesouro"
                          defaultValue={editingTx?.assetName || ''}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select name="category" required defaultValue={editingTx?.category || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {availableCategories.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>
                              <div className="flex items-center gap-2">
                                <DynamicIcon name={cat.icon} className="w-4 h-4" />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                          {availableCategories.length === 0 && (
                            <SelectItem value="Outros">Outros</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {!isGainType && formType !== 'Transfer' && (
                    <div className="space-y-2">
                      <Label>Classificação de Custo</Label>
                      <Select
                        name="expenseType"
                        defaultValue={editingTx?.expenseType || 'variable'}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="variable">Gasto Variável</SelectItem>
                          <SelectItem value="fixed">Gasto Fixo (Recorrente)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-end">
                  <div className="space-y-2 col-span-1">
                    <Label>Perfil Responsável</Label>
                    <Select
                      name="profile"
                      required
                      defaultValue={editingTx?.profile || profiles[0]?.name}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label>Recorrência</Label>
                    <Select
                      name="recurrence"
                      value={recurrenceType}
                      onValueChange={setRecurrenceType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Uma vez</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                        <SelectItem value="installment">Parcelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {recurrenceType === 'installment' && (
                    <div className="space-y-2 col-span-1 sm:col-span-2">
                      <Label>Quantidade de Parcelas</Label>
                      <Input
                        name="installments"
                        type="number"
                        min="2"
                        step="1"
                        required
                        placeholder="Ex: 12"
                        defaultValue={editingTx?.installments || ''}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-end">
                  <div className="space-y-2 col-span-1">
                    <Label>Conta Registrada (Opcional)</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nenhuma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        {accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.bank}
                          </SelectItem>
                        ))}
                        {selectedAccount &&
                          selectedAccount !== 'none' &&
                          !accounts.find((a) => a.id === selectedAccount) && (
                            <SelectItem value={selectedAccount}>{selectedAccount}</SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label>Cartão (Opcional)</Label>
                    <Select value={selectedCard} onValueChange={handleCardChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sem cartão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {creditCards.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name || c.bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isPix && (
                  <div className="space-y-2 pt-2">
                    <Label>Anexo do Comprovante</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full relative overflow-hidden"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*,.pdf'
                        input.onchange = (e) => {
                          const target = e.target as HTMLInputElement
                          if (target.files?.length) setFileName(target.files[0].name)
                        }
                        input.click()
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {fileName ? (
                        <span className="truncate max-w-[250px]">{fileName}</span>
                      ) : (
                        'Anexar Recibo PDF/Img'
                      )}
                    </Button>
                  </div>
                )}

                <DialogFooter className="mt-6 pt-4 border-t">
                  <Button
                    type="submit"
                    className="w-full bg-[#126eda] text-white hover:bg-[#126eda]/90"
                  >
                    {editingTx ? 'Salvar Alterações' : 'Salvar Transação'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
            {filteredTransactions.map((tx) => {
              const acc = accounts.find((a) => a.id === tx.account)
              const accName = acc ? acc.bank : tx.account
              const card = creditCards.find((c) => c.id === tx.cardId)
              const isGain =
                tx.type === 'Revenue' || tx.type === 'Aporte' || tx.category.includes('Renda')

              const amountClass = isGain
                ? tx.type === 'Aporte'
                  ? 'text-primary'
                  : 'text-emerald-500'
                : tx.type === 'Transfer'
                  ? 'text-primary'
                  : 'text-rose-500'
              const amountPrefix = isGain ? '+' : tx.type === 'Transfer' ? '' : '-'

              const catObj = allCategories.find(
                (c) => c.name === tx.category || tx.category.includes(c.name),
              )
              const catIcon = catObj ? catObj.icon : undefined

              return (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${isGain ? (tx.type === 'Aporte' ? 'bg-[#126eda]/10' : 'bg-emerald-500/10') : tx.type === 'Transfer' ? 'bg-[#126eda]/10' : 'bg-rose-500/10'}`}
                    >
                      {catIcon ? (
                        <DynamicIcon
                          name={catIcon}
                          className={`w-4 h-4 ${isGain ? (tx.type === 'Aporte' ? 'text-[#126eda]' : 'text-emerald-500') : tx.type === 'Transfer' ? 'text-[#126eda]' : 'text-rose-500'}`}
                        />
                      ) : (
                        getIconForType(tx.type, isGain)
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base flex items-center gap-2">
                        {tx.description}
                        {tx.recurrence !== 'none' && tx.recurrence !== 'installment' && (
                          <Repeat className="w-3 h-3 text-muted-foreground" />
                        )}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-normal flex items-center gap-1"
                        >
                          {tx.category}
                        </Badge>

                        {tx.type === 'Aporte' ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-normal border-[#126eda]/30 text-[#126eda] bg-[#126eda]/5"
                          >
                            Aporte
                          </Badge>
                        ) : isGain ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-normal border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                          >
                            Receita
                          </Badge>
                        ) : tx.type === 'Transfer' ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-normal border-primary/30 text-primary bg-primary/5"
                          >
                            Transferência
                          </Badge>
                        ) : tx.expenseType ? (
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-normal ${tx.expenseType === 'fixed' ? 'border-rose-500/40 text-rose-500 bg-rose-500/5' : 'border-orange-500/40 text-orange-500 bg-orange-500/5'}`}
                          >
                            {tx.expenseType === 'fixed' ? 'Custo Fixo' : 'Custo Variável'}
                          </Badge>
                        ) : null}

                        {tx.recurrence === 'installment' && tx.installments && (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-normal border-primary/30 text-primary bg-primary/5"
                          >
                            {tx.installments}x Parcelas
                          </Badge>
                        )}

                        {tx.type === 'Aporte' && tx.bankBroker && (
                          <span className="text-[10px] text-muted-foreground bg-muted border border-border/50 px-1.5 py-0.5 rounded">
                            🏦 {tx.bankBroker}
                          </span>
                        )}
                        {tx.type === 'Aporte' && tx.assetName && (
                          <span className="text-[10px] text-muted-foreground bg-muted border border-border/50 px-1.5 py-0.5 rounded">
                            📈 {tx.assetName}
                          </span>
                        )}

                        {accName && (
                          <span className="text-xs text-muted-foreground font-medium">
                            {accName}
                          </span>
                        )}
                        {card && (
                          <span className="text-[10px] text-muted-foreground bg-muted border border-border/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> {card.name || card.bank}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          • {new Date(tx.date).toLocaleDateString('pt-BR')}
                        </span>
                        {tx.profile && (
                          <span className="text-xs text-primary/80 font-medium ml-1">
                            [{tx.profile}]
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-mono font-medium ${amountClass}`}>
                        {amountPrefix} R${' '}
                        {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      {(tx.type === 'Pix' || tx.hasAttachment) && (
                        <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 mt-1">
                          <Paperclip className="w-3 h-3" /> anexo
                        </span>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(tx)}>
                          <Edit2 className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => handleDelete(tx.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground bg-muted/10 border border-dashed rounded-lg m-4">
                Nenhuma transação encontrada no período.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DataImportDialog open={openImport} onOpenChange={setOpenImport} importType={importType} />

      <ImpulseControlDialog
        open={!!pendingLargeExpense}
        onOpenChange={(o) => {
          if (!o && pendingLargeExpense) {
            setPendingLargeExpense(null)
          }
        }}
        onConfirm={() => {
          if (pendingLargeExpense) {
            handleSave(pendingLargeExpense)
            setPendingLargeExpense(null)
          }
        }}
        title="Alerta de Gasto Elevado"
        description="Você está registrando uma saída de valor substancial."
        reflectionText="Este gasto foge do seu padrão. Ele realmente reflete suas prioridades ou prejudica o Resultado do seu mês?"
        confirmText="Confirmar Gasto"
        destructive={false}
      />
    </div>
  )
}
