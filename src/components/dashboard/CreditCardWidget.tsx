import { CreditCard, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/useAppStore'

export function CreditCardWidget() {
  const { creditCards } = useAppStore()
  const cards = creditCards.filter((c) => !c.isArchived)

  const totalLimit = cards.reduce((acc, c) => acc + c.totalLimit, 0)
  const availableLimit = cards.reduce((acc, c) => acc + c.availableLimit, 0)
  const usedLimit = totalLimit - availableLimit
  const percent = totalLimit > 0 ? (usedLimit / totalLimit) * 100 : 0

  return (
    <Card className="h-full border-border/50">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Resumo de Cartões
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="h-8 text-xs gap-1">
            <Link to="/contas">
              Gerenciar <ChevronRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Limite Disponível Global</span>
            <span className="font-bold">
              R$ {availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <Progress value={percent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Usado: R$ {usedLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span>
              Total: R$ {totalLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Cartões Principais
          </h4>
          {cards.slice(0, 3).map((card) => (
            <div
              key={card.id}
              className="flex justify-between items-center p-2 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-background rounded-md shadow-sm border border-border/50">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{card.bank}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">•••• {card.lastDigits}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">Dia {card.dueDate}</p>
                <p className="text-[10px] text-muted-foreground">Vencimento</p>
              </div>
            </div>
          ))}
          {cards.length === 0 && (
            <div className="text-center p-3 text-sm text-muted-foreground border border-dashed rounded-md">
              Nenhum cartão ativo.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
