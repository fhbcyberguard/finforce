import useAppStore from '@/stores/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, CreditCard as CreditCardIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function CreditCardList() {
  const { creditCards, setCreditCards, accounts } = useAppStore()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (!error) {
      setCreditCards(creditCards.filter((c) => c.id !== id))
      toast({ title: 'Cartão removido', description: 'O cartão foi excluído com sucesso.' })
    } else {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      {creditCards.map((card) => (
        <Card
          key={card.id}
          className="border-border/50 hover:bg-muted/50 transition-colors group relative"
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#126eda]/10 p-3 rounded-full">
                <CreditCardIcon className="w-5 h-5 text-[#126eda]" />
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
                  Vencimento: dia {card.dueDate} • Fechamento: dia {card.closingDate}
                </p>
              </div>
            </div>
            <div className="text-right mr-8 md:mr-0 transition-transform group-hover:md:-translate-x-12">
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
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
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
          Nenhum cartão de crédito cadastrado no momento.
        </div>
      )}
    </div>
  )
}
