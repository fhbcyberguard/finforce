import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Edit2, Trash2, MoreVertical, Repeat, Plus } from 'lucide-react'
import { Transaction } from '@/stores/useAppStore'

interface TransactionTableProps {
  transactions: Transaction[]
  accounts: any[]
  creditCards: any[]
  categories: any[]
  members?: any[]
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function TransactionTable({
  transactions,
  accounts,
  creditCards,
  categories,
  members,
  onEdit,
  onDelete,
  onAdd,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="p-16 text-center flex flex-col items-center justify-center animate-in fade-in">
        <p className="text-lg font-medium text-foreground mb-2">Nenhuma transação encontrada</p>
        <p className="text-muted-foreground mb-6">Não há registros para o período selecionado.</p>
        <Button onClick={onAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Adicionar Transação
        </Button>
      </div>
    )
  }

  return (
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
        {transactions.map((tx) => {
          const isGain =
            tx.type === 'Revenue' || tx.type === 'Aporte' || tx.category.includes('Renda')
          const isTransfer = tx.type === 'Transfer'
          const amountClass = isGain
            ? 'text-emerald-500'
            : isTransfer
              ? 'text-primary'
              : 'text-rose-500'
          const amountPrefix = isGain ? '+' : isTransfer ? '' : '-'
          const catObj = categories.find((c) => c.name === tx.category)

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
                      className={`text-[10px] font-normal ${tx.expenseType === 'fixed' ? 'text-rose-500 bg-rose-500/5' : 'text-orange-500 bg-orange-500/5'}`}
                    >
                      {tx.expenseType === 'fixed' ? 'Custo Fixo' : 'Custo Variável'}
                    </Badge>
                  )}
                  {tx.account && tx.account !== 'none' && (
                    <span className="text-[10px] text-muted-foreground">
                      💳 {accounts.find((a) => a.id === tx.account)?.name || tx.account}
                    </span>
                  )}
                  {tx.member_id &&
                    members &&
                    members.length > 0 &&
                    (() => {
                      const m = members.find((x) => x.id === tx.member_id)
                      if (!m) return null
                      return (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-md border flex items-center gap-1"
                          style={{
                            color: m.color || '#64748b',
                            borderColor: `${m.color || '#64748b'}50`,
                            backgroundColor: `${m.color || '#64748b'}10`,
                          }}
                        >
                          👤 {m.name}
                        </span>
                      )
                    })()}
                  {tx.profile && tx.profile !== 'none' && !tx.member_id && (
                    <span className="text-[10px] text-primary/80 font-medium">👤 {tx.profile}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="text-[10px] font-normal flex items-center gap-1.5 w-fit border-border/50"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: catObj?.color || '#64748b' }}
                  />
                  {tx.category}
                </Badge>
              </TableCell>
              <TableCell
                className={`text-right font-mono font-medium whitespace-nowrap ${amountClass}`}
              >
                {amountPrefix} R${' '}
                {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                    <DropdownMenuItem onClick={() => onEdit(tx)}>
                      <Edit2 className="w-4 h-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10"
                      onClick={() => onDelete(tx.id)}
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
  )
}
