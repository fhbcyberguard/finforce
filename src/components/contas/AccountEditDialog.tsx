import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ColorPicker } from '@/components/ui/color-picker'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { Account } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export function AccountEditDialog({
  editingAcc,
  open,
  onOpenChange,
}: {
  editingAcc: Account | null
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { user } = useAuth()
  const { accounts, setAccounts, currentContext } = useAppStore()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [color, setColor] = useState('#016ad9')

  useEffect(() => {
    if (editingAcc) setColor(editingAcc.color || '#016ad9')
    else setColor('#016ad9')
  }, [editingAcc, open])

  const handleSaveAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const fd = new FormData(e.currentTarget)
    const name = fd.get('name') as string
    const type = fd.get('type') as string
    const balance = Number(fd.get('balance'))
    const agency = fd.get('agency') as string
    const accountNumber = fd.get('account') as string

    setIsSaving(true)
    const payload = {
      user_id: user.id,
      name,
      type,
      balance,
      agency: agency || null,
      account_number: accountNumber || null,
      color,
    }

    if (editingAcc) {
      const { error } = await supabase.from('accounts').update(payload).eq('id', editingAcc.id)
      if (!error) {
        setAccounts(
          accounts.map((a) =>
            a.id === editingAcc.id
              ? {
                  ...a,
                  name,
                  bank: name,
                  type,
                  balance,
                  agency,
                  account_number: accountNumber,
                  account: accountNumber,
                  color,
                }
              : a,
          ),
        )
        toast({ title: 'Conta Atualizada' })
      } else toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      const { data, error } = await supabase.from('accounts').insert(payload).select().single()
      if (!error && data) {
        setAccounts([
          ...accounts,
          {
            id: data.id,
            name: data.name,
            bank: data.name,
            type: data.type || 'Conta Corrente',
            balance: Number(data.balance),
            agency: data.agency || '',
            account_number: data.account_number || '',
            account: data.account_number || '',
            connected: false,
            context: currentContext,
            color: data.color,
          },
        ])
        toast({ title: 'Conta Adicionada' })
      } else toast({ title: 'Erro', description: error?.message, variant: 'destructive' })
    }

    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingAcc ? 'Editar Instituição' : 'Adicionar Instituição'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Cor</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Nome do Banco / Instituição</Label>
              <Input
                name="name"
                required
                defaultValue={editingAcc?.name || ''}
                placeholder="Ex: Inter"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Agência (Opcional)</Label>
              <Input name="agency" defaultValue={editingAcc?.agency || ''} placeholder="0001" />
            </div>
            <div className="space-y-2">
              <Label>Conta (Opcional)</Label>
              <Input
                name="account"
                defaultValue={editingAcc?.account_number || ''}
                placeholder="12345-6"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <Select name="type" defaultValue={editingAcc?.type || 'Conta Corrente'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conta Corrente">Conta Corrente</SelectItem>
                  <SelectItem value="Conta Poupança">Poupança</SelectItem>
                  <SelectItem value="Conta Investimento">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Saldo Inicial (R$)</Label>
              <Input
                name="balance"
                type="number"
                step="0.01"
                required
                defaultValue={editingAcc?.balance ?? ''}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}{' '}
              {editingAcc ? 'Salvar Alterações' : 'Salvar Conta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
