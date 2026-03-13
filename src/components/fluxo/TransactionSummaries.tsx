import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export function TransactionSummaries({
  income,
  expense,
  balance,
}: {
  income: number
  expense: number
  balance: number
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Receitas</p>
            <p className="text-2xl font-bold text-emerald-500">
              R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-primary' : 'text-rose-500'}`}>
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
