import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Receipt,
  Repeat,
  ArrowRightLeft,
  Upload,
} from 'lucide-react'
import { MOCK_TRANSACTIONS } from '@/lib/mockData'
import { useToast } from '@/hooks/use-toast'

export default function FluxoCaixa() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)
  const [openAdd, setOpenAdd] = useState(false)
  const [isPix, setIsPix] = useState(false)
  const { toast } = useToast()

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const type = fd.get('type') as string
    const amountStr = fd.get('amount') as string
    let amount = Number(amountStr)

    if (type === 'Expense' || type === 'Pix' || type === 'Transfer') {
      amount = -Math.abs(amount)
    } else {
      amount = Math.abs(amount)
    }

    const newTx = {
      id: Math.random().toString(),
      date: new Date().toISOString().split('T')[0],
      description: fd.get('description') as string,
      amount: amount,
      category: fd.get('category') as string,
      type: type,
      account: fd.get('account') as string,
    }
    setTransactions([newTx, ...transactions])
    setOpenAdd(false)
    toast({ title: 'Transação adicionada', description: 'O fluxo de caixa foi atualizado.' })
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

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">
            Visão detalhada de entradas e saídas (Motor Avançado).
          </p>
        </div>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    name="type"
                    required
                    onValueChange={(v) => setIsPix(v === 'Pix')}
                    defaultValue="Expense"
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
                  <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input name="description" placeholder="Ex: Conta de Luz" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria Pessoal</Label>
                  <Input name="category" placeholder="Ex: Moradia" required />
                </div>
                <div className="space-y-2">
                  <Label>Conta Origem/Destino</Label>
                  <Select name="account" required defaultValue="Nubank">
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
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recurrence"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="recurrence"
                    className="flex items-center gap-1 font-normal cursor-pointer"
                  >
                    <Repeat className="w-3 h-3" /> Transação Recorrente
                  </Label>
                </div>
                {isPix && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Upload className="w-3 h-3" /> Anexar Recibo
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-6 pt-4 border-t">
                <Button type="submit" className="w-full">
                  Salvar Transação
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-secondary/20">{getIcon(tx.type)}</div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{tx.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {tx.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{tx.account}</span>
                      <span className="text-xs text-muted-foreground">
                        • {new Date(tx.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-medium ${tx.amount > 0 ? 'text-emerald-500' : ''}`}>
                    {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2)}
                  </p>
                  {tx.type === 'Pix' && (
                    <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 mt-1">
                      <Receipt className="w-3 h-3" /> c/ recibo
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
