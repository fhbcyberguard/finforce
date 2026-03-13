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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  Plus,
  Repeat,
  Upload,
  Download,
  MoreVertical,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  BarChart2,
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
    selectedMonth,
    setSelectedMonth,
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
  const [pendingLargeExpense, setPendingLargeExpense] = useState<Transaction | null>(null)

  const { toast } = useToast()

  const allCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES
  const availableCategories = allCategories.filter((c) => c.type === formType)
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

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
          if (editingTx.goalId) setSelectedGoalId(editingTx.goalId)
          else {
            const match = goals.find((g) => editingTx.category.includes(g.name))
            if (match) setSelectedGoalId(match.id)
          }
        }
      } else {
        resetForm()
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

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear((parseInt(selectedYear) - 1).toString())
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear((parseInt(selectedYear) + 1).toString())
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const filteredTransactions = useMemo(() => {
    const yearToUse = selectedYear || new Date().getFullYear().toString()
    const monthStr = (selectedMonth + 1).toString().padStart(2, '0')
    const currentMonth = `${yearToUse}-${monthStr}`

    let list = transactions.filter((t) => {
      if (timeframe === 'monthly') return t.date.startsWith(currentMonth)
      if (timeframe === 'annual') return t.date.startsWith(yearToUse)
      return true
    })

    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower) ||
          (t.profile && t.profile.toLowerCase().includes(lower)) ||
          (t.account && t.account.toLowerCase().includes(lower)),
      )
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, searchQuery, timeframe, selectedYear, selectedMonth])

  const summaries = useMemo(() => {
    let income = 0
    let expense = 0
    filteredTransactions.forEach((t) => {
      if (t.type === 'Transfer') return
      const isGain = t.type === 'Revenue' || t.type === 'Aporte' || t.category.includes('Renda')
      if (isGain) income += Math.abs(t.amount)
      else expense += Math.abs(t.amount)
    })
    return { income, expense, balance: income - expense }
  }, [filteredTransactions])

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
    const rows = filteredTransactions.map((tx) => {
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
    link.setAttribute('download', `transacoes_finforce_${selectedYear}_${selectedMonth + 1}.csv`)
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
        setTransactions(
          transactions.map((t) => (t.id === editingTx.id ? { ...txToSave, id: editingTx.id } : t)),
        )
        toast({
          title: 'Transação atualizada',
          description: 'O registro foi modificado com sucesso.',
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
        setTransactions([{ ...txToSave, id: data.id }, ...transactions])
        toast({ title: 'Transação adicionada', description: 'O fluxo de caixa foi atualizado.' })
      }
    }
    setOpenAdd(false)
    resetForm()
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const type = fd.get('type') as string
    const isGain = type === 'Revenue' || type === 'Aporte'
    let amount = Number(fd.get('amount'))
    if (!isGain && type !== 'Transfer') amount = -Math.abs(amount)
    else amount = Math.abs(amount)

    let category = ''
    if (type === 'Aporte') {
      const goal = goals.find((g) => g.id === selectedGoalId)
      category = `Metas > ${goal?.name || 'Geral'}`
    } else category = fd.get('category') as string

    const rawExpenseType = fd.get('expenseType') as 'fixed' | 'variable' | null
    const newTx: Transaction = {
      id: editingTx ? editingTx.id : '',
      date: fd.get('date') as string,
      description: fd.get('description') as string,
      amount,
      category,
      type,
      account: selectedAccount === 'none' ? '' : selectedAccount,
      cardId: selectedCard === 'none' ? undefined : selectedCard,
      goalId: type === 'Aporte' ? selectedGoalId : undefined,
      recurrence: recurrenceType,
      installments: recurrenceType === 'installment' ? Number(fd.get('installments')) : undefined,
      hasAttachment: !!fileName || (editingTx?.hasAttachment ?? false),
      profile: fd.get('profile') as string,
      expenseType: !isGain && type !== 'Transfer' ? rawExpenseType || 'variable' : undefined,
      bankBroker: type === 'Aporte' ? (fd.get('bankBroker') as string) : undefined,
      assetName: type === 'Aporte' ? (fd.get('assetName') as string) : undefined,
    }

    if (amount < -1000 && !editingTx && !isGain && type !== 'Transfer') {
      setPendingLargeExpense(newTx)
      setOpenAdd(false)
    } else handleSave(newTx)
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
    }
  }

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx)
    setIsPix(tx.type === 'Pix')
    setFormType(tx.type)
    setOpenAdd(true)
  }

  const availableYears = Array.from(new Set(transactions.map((t) => t.date.substring(0, 4)))).sort(
    (a, b) => b.localeCompare(a),
  )
  if (!availableYears.includes(new Date().getFullYear().toString()))
    availableYears.unshift(new Date().getFullYear().toString())

  const isGainType = formType === 'Revenue' || formType === 'Aporte'

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Visão Empresarial
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Gerencie o fluxo de caixa e a saúde financeira do seu negócio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-start sm:items-center">
          <div className="flex w-full sm:w-auto gap-2">
            {timeframe === 'monthly' && (
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 flex-1 sm:flex-none h-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(v) => setSelectedMonth(Number(v))}
                >
                  <SelectTrigger className="h-8 flex-1 sm:w-[110px] text-xs border-0 bg-transparent focus:ring-0 px-1 shadow-none">
                    <SelectValue />
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
                  className="h-8 w-8 shrink-0"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-10 w-[90px] text-xs shrink-0 bg-muted/50 border-0">
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

          <div className="flex w-full sm:w-auto gap-2">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none gap-2 bg-muted/50 border-0 h-10"
            >
              <BarChart2 className="w-4 h-4" /> Comparar
            </Button>

            <ToggleGroup
              type="single"
              value={timeframe}
              onValueChange={(v) => v && setTimeframe(v as 'monthly' | 'annual')}
              className="bg-muted/50 p-1 rounded-lg flex-1 sm:flex-none h-10"
            >
              <ToggleGroupItem value="monthly" className="flex-1 sm:px-4 text-xs h-8">
                Mensal
              </ToggleGroupItem>
              <ToggleGroupItem value="annual" className="flex-1 sm:px-4 text-xs h-8">
                Anual
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-start sm:justify-end mt-1 sm:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none h-10">
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

            <Button
              variant="outline"
              className="gap-2 flex-1 sm:flex-none h-10"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 text-[#126eda]" /> Exportar
            </Button>

            <Button
              className="gap-2 w-full sm:w-auto bg-[#126eda] text-white hover:bg-[#126eda]/90 h-10"
              onClick={() => {
                resetForm()
                setOpenAdd(true)
              }}
            >
              <Plus className="w-4 h-4" /> Nova Transação
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Receitas</p>
              <p className="text-2xl font-bold text-emerald-500">
                R$ {summaries.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-full">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Despesas</p>
              <p className="text-2xl font-bold text-rose-500">
                R$ {summaries.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-rose-500/10 p-3 rounded-full">
              <TrendingDown className="w-5 h-5 text-rose-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Saldo do Período</p>
              <p
                className={`text-2xl font-bold ${summaries.balance >= 0 ? 'text-primary' : 'text-rose-500'}`}
              >
                R$ {summaries.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center animate-in fade-in">
                <p className="text-lg font-medium text-foreground mb-2">
                  Nenhuma transação encontrada
                </p>
                <p className="text-muted-foreground mb-6">
                  Não há registros para o período selecionado.
                </p>
                <Button
                  onClick={() => {
                    resetForm()
                    setOpenAdd(true)
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Adicionar Transação
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => {
                    const isGain =
                      tx.type === 'Revenue' || tx.type === 'Aporte' || tx.category.includes('Renda')
                    const isTransfer = tx.type === 'Transfer'
                    const amountClass = isGain
                      ? 'text-emerald-500'
                      : isTransfer
                        ? 'text-primary'
                        : 'text-rose-500'
                    const amountPrefix = isGain ? '+' : isTransfer ? '' : '-'

                    return (
                      <TableRow key={tx.id} className="group">
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            {tx.description}
                            {tx.recurrence !== 'none' && tx.recurrence !== 'installment' && (
                              <Repeat className="w-3 h-3 text-muted-foreground" />
                            )}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {tx.expenseType && (
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-normal ${tx.expenseType === 'fixed' ? 'text-rose-500 border-rose-500/40 bg-rose-500/5' : 'text-orange-500 border-orange-500/40 bg-orange-500/5'}`}
                              >
                                {tx.expenseType === 'fixed' ? 'Custo Fixo' : 'Custo Variável'}
                              </Badge>
                            )}
                            {tx.type === 'Aporte' && tx.bankBroker && (
                              <span className="text-[10px] text-muted-foreground">
                                🏦 {tx.bankBroker}
                              </span>
                            )}
                            {tx.account && (
                              <span className="text-[10px] text-muted-foreground">
                                💳 {tx.account}
                              </span>
                            )}
                            {tx.profile && (
                              <span className="text-[10px] text-primary/80 font-medium">
                                👤 {tx.profile}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-normal border-border/50"
                          >
                            {tx.category}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-mono font-medium whitespace-nowrap ${amountClass}`}
                        >
                          {amountPrefix} R${' '}
                          {Math.abs(tx.amount).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
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
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onClick={() => handleDelete(tx.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
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
                placeholder={formType === 'Aporte' ? 'Ex: Aporte Mensal' : 'Ex: Conta de Luz'}
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
                    <Label>Destino do Aporte</Label>
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
                      placeholder="Ex: NuInvest"
                      defaultValue={editingTx?.bankBroker || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ativo</Label>
                    <Input
                      name="assetName"
                      placeholder="Ex: PETR4"
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
                  <Label>Classificação</Label>
                  <Select name="expenseType" defaultValue={editingTx?.expenseType || 'variable'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="variable">Gasto Variável</SelectItem>
                      <SelectItem value="fixed">Gasto Fixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-end">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label>Recorrência</Label>
                <Select name="recurrence" value={recurrenceType} onValueChange={setRecurrenceType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Uma vez</SelectItem>
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
                    defaultValue={editingTx?.installments || ''}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-end">
              <div className="space-y-2">
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
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
                <Label>Anexo</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full relative overflow-hidden"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*,.pdf'
                    input.onchange = (e) => {
                      const t = e.target as HTMLInputElement
                      if (t.files?.length) setFileName(t.files[0].name)
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />{' '}
                  {fileName ? (
                    <span className="truncate max-w-[250px]">{fileName}</span>
                  ) : (
                    'Anexar Recibo'
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

      <DataImportDialog open={openImport} onOpenChange={setOpenImport} importType={importType} />

      <ImpulseControlDialog
        open={!!pendingLargeExpense}
        onOpenChange={(o) => {
          if (!o && pendingLargeExpense) setPendingLargeExpense(null)
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
