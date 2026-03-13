import { useState } from 'react'
import useAppStore, { CreditCard } from '@/stores/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, CreditCard as CreditCardIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { EditCreditCardDialog } from './EditCreditCardDialog'

export function CreditCardList() {
  const { creditCards, setCreditCards, accounts } = useAppStore()
  const { toast } = useToast()
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (!error) {
      setCreditCards(creditCards.filter((c) => c.id !== id))
      toast({ title: 'Cartão removido' })
    } else {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      {creditCards.map((card) => (
        <Card
          key={card.id}
          className="border-border/50 hover:bg-muted/50 transition-colors group relative overflow-hidden"
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5"
            style={{ backgroundColor: card.color || '#126eda' }}
          />
          <CardContent className="p-4 pl-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="bg-muted p-3 rounded-full"
                style={{
                  backgroundColor: card.color ? `${card.color}15` : undefined,
                  color: card.color || '#126eda',
                }}
              >
                <CreditCardIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">
                  {card.name}
                  {card.lastDigits && (
                    <span className="text-muted-foreground ml-1 font-normal text-sm">
                      (•••• {card.lastDigits})
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Vencimento: {card.dueDate} • Fechamento: {card.closingDate}
                </p>
              </div>
            </div>
            <div className="text-right mr-16 md:mr-0 transition-transform group-hover:md:-translate-x-20">
              <p className="font-mono font-medium text-sm">
                Limite: R$ {card.totalLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">
                Conta: {accounts.find((a) => a.id === card.accountId)?.name || 'Nenhuma'}
              </p>
            </div>
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => setEditingCard(card)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={() => handleDelete(card.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {creditCards.length === 0 && (
        <div className="text-center p-8 text-sm text-muted-foreground border border-dashed rounded-md bg-muted/10">
          Nenhum cartão de crédito cadastrado.
        </div>
      )}
      <EditCreditCardDialog
        card={editingCard}
        open={!!editingCard}
        onOpenChange={(o) => !o && setEditingCard(null)}
      />
    </div>
  )
}
