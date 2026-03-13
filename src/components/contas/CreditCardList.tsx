import { CreditCard as CardIcon, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export interface CreditCardType {
  id: string
  bank: string
  brand: string
  lastDigits: string
  totalLimit: number
  availableLimit: number
  bestPurchaseDay: number
  dueDate: number
}

interface CreditCardListProps {
  cards: CreditCardType[]
}

export function CreditCardList({ cards }: CreditCardListProps) {
  if (cards.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/10 h-full min-h-[200px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center text-center p-6">
          <CardIcon className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
          <p className="font-medium text-foreground">Nenhum cartão registrado</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Cadastre seus cartões para acompanhar limites, melhor dia de compra e faturas em um só
            lugar.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card) => {
        const usedLimit = card.totalLimit - card.availableLimit
        const percent = card.totalLimit > 0 ? (usedLimit / card.totalLimit) * 100 : 0

        return (
          <Card
            key={card.id}
            className="border-border/50 hover:border-primary/20 transition-colors"
          >
            <CardContent className="p-5">
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
                <div className="bg-secondary/20 px-2 py-1 rounded text-xs font-medium">
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
  )
}
