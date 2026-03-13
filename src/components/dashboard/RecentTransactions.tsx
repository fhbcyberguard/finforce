import { useMemo, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Receipt } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { supabase } from '@/lib/supabase/client'

export function RecentTransactions() {
  const { transactions } = useAppStore()
  const [members, setMembers] = useState<any[]>([])

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase.from('members').select('*')
      if (data) setMembers(data)
    }
    fetchMembers()
  }, [])

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [transactions])

  return (
    <Card className="h-full border-border/50 shadow-subtle hover:shadow-md transition-all">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Transações Recentes
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="h-8 text-xs gap-1">
            <Link to="/transacoes">
              Ver Todas <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {recent.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhuma transação recente.
            </div>
          ) : (
            recent.map((tx) => {
              const isGain =
                tx.type === 'Revenue' || tx.type === 'Aporte' || tx.category.includes('Renda')
              const isTransfer = tx.type === 'Transfer'
              const m = members.find((x) => x.id === tx.member_id)
              const memberName = m?.name || tx.members?.name
              const memberColor = m?.color || tx.members?.color || '#64748b'

              return (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="font-medium text-sm truncate max-w-[200px]">
                      {tx.description}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                      {memberName && (
                        <span
                          className="px-1.5 py-0.5 rounded-sm border font-medium flex items-center gap-1 leading-none"
                          style={{
                            color: memberColor,
                            borderColor: `${memberColor}50`,
                            backgroundColor: `${memberColor}10`,
                          }}
                        >
                          👤 {memberName}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`font-semibold whitespace-nowrap ml-4 ${
                      isGain ? 'text-emerald-500' : isTransfer ? 'text-primary' : 'text-rose-500'
                    }`}
                  >
                    {isGain ? '+' : isTransfer ? '' : '-'} R${' '}
                    {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
