import { useState } from 'react'
import { CreditCard as CardIcon, Calendar, Edit2, Archive, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { CreditCard } from '@/stores/useAppStore'

export function CreditCardList() {
  const { creditCards, setCreditCards, transactions, setTransactions } = useAppStore()
  const { toast } = useToast()
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)

  const activeCards = creditCards.filter((c) => !c.isArchived)

  const archiveCard = (id: string) => {
    setCreditCards(creditCards.map((c) => (c.id === id ? { ...c, isArchived: true } : c)))
    toast({
      title: 'Cartão Arquivado',
      description: 'O cartão foi ocultado das visões principais.',
    })
  }

  const deleteCard = (id: string) => {
    const card = creditCards.find((c) => c.id === id)
    setCreditCards(creditCards.filter((c) => c.id !== id))

    if (card) {
      // Cascade delete associated invoices/transactions
      setTransactions(transactions.filter((t) => t.cardId !== card.id && t.account !== card.bank))
    }

    toast({
      title: 'Cartão Excluído',
      description: 'Cartão e faturas pendentes associadas foram removidos permanentemente.',
      variant: 'destructive',
    })
  }

  const saveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingCard) return
    const fd = new FormData(e.currentTarget)
    const updated = {
      ...editingCard,
      bank: fd.get('bank') as string,
      brand: fd.get('brand') as string,
      totalLimit: Number(fd.get('limit')),
      dueDate: Number(fd.get('dueDate')),
    }
    setCreditCards(creditCards.map((c) => (c.id === updated.id ? updated : c)))
    setEditingCard(null)
    toast({ title: 'Cartão Atualizado' })
  }

  if (activeCards.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/10 h-full min-h-[200px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center text-center p-6">
          <CardIcon className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
          <p className="font-medium text-foreground">Nenhum cartão ativo registrado</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Cadastre seus cartões para acompanhar limites e melhor dia de compra.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCards.map((card) => {
          const usedLimit = card.totalLimit - card.availableLimit
          const percent = card.totalLimit > 0 ? (usedLimit / card.totalLimit) * 100 : 0

          return (
            <Card
              key={card.id}
              className="border-border/50 hover:border-primary/20 transition-colors relative group"
            >
              <CardContent className="p-5">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setEditingCard(card)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-amber-500"
                    onClick={() => archiveCard(card.id)}
                  >
                    <Archive className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteCard(card.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <CardIcon className="w-4 h-4 text-primary" />
                      {card.bank}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {card.brand} •••• {card.lastDigits}
                    </p>
                  </div>
                  <div className="bg-secondary/20 px-2 py-1 rounded text-xs font-medium mr-16">
                    Vence dia {card.dueDate}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Limite Disponível</span>
                    <span className="font-medium">
                      R$ {card.availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Progress value={percent} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Usado: R$ {usedLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span>
                      Total: R${' '}
                      {card.totalLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                  <Calendar className="w-3.5 h-3.5" />
                  Melhor dia para compra: dia {card.bestPurchaseDay}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!editingCard} onOpenChange={(o) => !o && setEditingCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cartão de Crédito</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <form className="space-y-4" onSubmit={saveEdit}>
              <div className="space-y-2">
                <Label>Banco Emissor</Label>
                <Input name="bank" defaultValue={editingCard.bank} required />
              </div>
              <div className="space-y-2">
                <Label>Bandeira</Label>
                <Input name="brand" defaultValue={editingCard.brand} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Limite Global (R$)</Label>
                  <Input
                    name="limit"
                    type="number"
                    step="0.01"
                    defaultValue={editingCard.totalLimit}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dia de Vencimento</Label>
                  <Input
                    name="dueDate"
                    type="number"
                    min="1"
                    max="31"
                    defaultValue={editingCard.dueDate}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
