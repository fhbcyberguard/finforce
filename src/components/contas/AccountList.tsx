import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react'
import useAppStore, { Account } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export function AccountList({
  onEdit,
  onAdd,
}: {
  onEdit: (a: Account) => void
  onAdd: () => void
}) {
  const { accounts, setAccounts } = useAppStore()
  const { toast } = useToast()

  const deleteAccount = async (id: string) => {
    const { error } = await supabase.from('accounts').delete().eq('id', id)
    if (!error) {
      setAccounts(accounts.filter((a) => a.id !== id))
      toast({ title: 'Conta Removida' })
    } else toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5" /> Minhas Contas
        </CardTitle>
        <Button size="sm" variant="ghost" className="h-8 gap-1" onClick={onAdd}>
          <Plus className="w-3 h-3" /> Nova
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="group flex items-center justify-between p-3 pl-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{ backgroundColor: acc.color || '#016ad9' }}
            />
            <div>
              <p className="font-medium">{acc.name || acc.bank}</p>
              <p className="text-xs text-muted-foreground flex gap-2">
                <span>{acc.type}</span>
                {acc.agency && <span>• Ag: {acc.agency}</span>}
                {(acc.account_number || acc.account) && (
                  <span>• Cc: {acc.account_number || acc.account}</span>
                )}
              </p>
            </div>
            <div className="text-right transition-transform group-hover:-translate-x-16">
              <p className="font-mono font-medium">R$ {acc.balance.toFixed(2)}</p>
            </div>
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => onEdit(acc)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={() => deleteAccount(acc.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="text-center p-4 text-sm text-muted-foreground border border-dashed rounded-md">
            Nenhuma conta cadastrada.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
