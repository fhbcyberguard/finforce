import { useState, useMemo } from 'react'
import useAppStore, { Transaction } from '@/stores/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
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
} from 'lucide-react'
import { MOCK_CATEGORIES } from '@/lib/mockData'
import { useToast } from '@/hooks/use-toast'
import { CsvImportDialog } from '@/components/fluxo/CsvImportDialog'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'

export default function FluxoCaixa() {
  const { transactions, setTransactions, profiles, searchQuery } = useAppStore()
  const [openAdd, setOpenAdd] = useState(false)
  const [openImport, setOpenImport] = useState(false)
  const [isPix, setIsPix] = useState(false)
  const [fileName, setFileName] = useState('')
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  // TCC Trigger State
  const [pendingLargeExpense, setPendingLargeExpense] = useState<Transaction | null>(null)

  const { toast } = useToast()

  const resetForm = () => {
    setEditingTx(null)
    setFileName('')
    setIsPix(false)
  }

  const handleSave = (txToSave: Transaction) => {
    if (editingTx) {
      setTransactions(transactions.map((t) => (t.id === editingTx.id ? txToSave : t)))
      toast({
        title: 'Transação atualizada',
        description: 'O registro foi modificado com sucesso.',
      })
    } else {
      setTransactions([txToSave, ...transactions])
      toast({ title: 'Transação adicionada', description: 'O fluxo de caixa foi atualizado.' })
    }
    setOpenAdd(false)
    resetForm()
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const type = fd.get('type') as string
    let amount = Number(fd.get('amount'))

    if (type === 'Expense' || type === 'Pix' || type === 'Transfer') amount = -Math.abs(amount)
    else amount = Math.abs(amount)

    const newTx: Transaction = {
      id: editingTx ? editingTx.id : Math.random().toString(),
      date: editingTx ? editingTx.date : new Date().toISOString().split('T')[0],
      description: fd.get('description') as string,
      amount,
      category: fd.get('category') as string,
      type,
      account: fd.get('account') as string,
      recurrence: fd.get('recurrence') as string,
      hasAttachment: !!fileName || (editingTx?.hasAttachment ?? false),
      profile: fd.get('profile') as string,
    }

    // TCC Trigger Condition: Large Expense
    if (amount < -1000 && !editingTx) {
      setPendingLargeExpense(newTx)
      setOpenAdd(false) // Hide main form temporarily
    } else {
      handleSave(newTx)
    }
  }

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
    toast({ title: 'Transação removida', description: 'O registro foi apagado.' })
  }

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx)
    setIsPix(tx.type === 'Pix')
    setOpenAdd(true)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'Revenue':
        return <ArrowUpRight className="w-4 h-4 text-emerald-500" />
      case 'Expense':
        return <ArrowDownRight className="w-4 h-4 text-rose-500" />
      case 'Pix':
        return <Receipt className="w-4 h-4 text-teal-400" />
      case 'Transfer':
        return <ArrowRightLeft className="w-4 h-4 text-blue-500" />
      default:
        return <ArrowDownRight className="w-4 h-4" />
    }
  }

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions
    const lower = searchQuery.toLowerCase()
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(lower) ||
        t.category.toLowerCase().includes(lower) ||
        (t.profile && t.profile.toLowerCase().includes(lower)) ||
        t.account.toLowerCase().includes(lower),
    )
  }, [transactions, searchQuery])

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">Visão detalhada de entradas e saídas.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <Button variant="outline" className="gap-2" onClick={() => setOpenImport(true)}>
            <Upload className="w-4 h-4" /> Importar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast({ title: 'Exportando PDF...' })}>
                Relatório em PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: 'Exportando CSV...' })}>
                Dados em CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => {
              resetForm()
              setOpenAdd(true)
            }}
          >
            <Plus className="w-4 h-4" /> Nova Transação
          </Button>

          <Dialog
            open={openAdd}
            onOpenChange={(o) => {
              setOpenAdd(o)
              if (!o) resetForm()
            }}
          >
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{editingTx ? 'Editar Transação' : 'Registrar Transação'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      name="type"
                      required
                      onValueChange={(v) => setIsPix(v === 'Pix')}
                      defaultValue={editingTx?.type || 'Expense'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Expense">Despesa</SelectItem>
                        <SelectItem value="Revenue">Receita</SelectItem>
                        <SelectItem value="Pix">Pix (Comprovante)</SelectItem>
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
                    placeholder="Ex: Conta de Luz"
                    required
                    defaultValue={editingTx?.description || ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      name="category"
                      required
                      defaultValue={editingTx?.category || 'Moradia > Luz'}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {Object.entries(MOCK_CATEGORIES).map(([parent, subs]) => (
                          <SelectGroup key={parent}>
                            <SelectLabel className="text-primary">{parent}</SelectLabel>
                            {subs.map((sub) => (
                              <SelectItem key={sub} value={`${parent} > ${sub}`}>
                                {parent} &gt; {sub}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 items-end">
                  <div className="space-y-2">
                    <Label>Conta Origem/Destino</Label>
                    <Select name="account" required defaultValue={editingTx?.account || 'Nubank'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nubank">Nubank</SelectItem>
                        <SelectItem value="Itaú">Itaú</SelectItem>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Recorrência</Label>
                    <Select name="recurrence" defaultValue={editingTx?.recurrence || 'none'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Uma vez</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
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
                  <Button type="submit" className="w-full">
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
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-secondary/20">{getIcon(tx.type)}</div>
                  <div>
                    <p className="font-medium text-sm sm:text-base flex items-center gap-2">
                      {tx.description}
                      {tx.recurrence !== 'none' && (
                        <Repeat className="w-3 h-3 text-muted-foreground" />
                      )}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {tx.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{tx.account}</span>
                      <span className="text-xs text-muted-foreground">
                        • {new Date(tx.date).toLocaleDateString('pt-BR')}
                      </span>
                      {tx.profile && (
                        <span className="text-xs text-primary/70 font-medium ml-1">
                          [{tx.profile}]
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`font-mono font-medium ${tx.amount > 0 ? 'text-emerald-500' : ''}`}
                    >
                      {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2)}
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
            ))}
            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                Nenhuma transação encontrada.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CsvImportDialog open={openImport} onOpenChange={setOpenImport} />

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
        reflectionText="Este gasto está acima da sua média. Ele está alinhado com seu propósito financeiro?"
        confirmText="Confirmar Gasto"
        destructive={false}
      />
    </div>
  )
}
