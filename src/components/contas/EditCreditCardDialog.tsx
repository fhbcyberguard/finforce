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
import useAppStore, { CreditCard } from '@/stores/useAppStore'
import { supabase } from '@/lib/supabase/client'

export function EditCreditCardDialog({
  card,
  open,
  onOpenChange,
}: {
  card: CreditCard | null
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { toast } = useToast()
  const { creditCards, setCreditCards, accounts } = useAppStore()
  const [isSaving, setIsSaving] = useState(false)
  const [color, setColor] = useState('#000000')

  useEffect(() => {
    if (card) setColor(card.color || '#000000')
  }, [card])

  if (!card) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const cardName = fd.get('name') as string
    const limit = Number(fd.get('limit'))
    const dueDate = Number(fd.get('dueDate'))
    const closingDate = Number(fd.get('closingDate'))
    const accountId = fd.get('accountId') as string
    const lastDigits = fd.get('lastDigits') as string

    setIsSaving(true)
    const payload = {
      name: cardName,
      limit,
      due_day: dueDate,
      closing_day: closingDate,
      account_id: accountId === 'none' ? null : accountId,
      last_digits: lastDigits || null,
      color,
    }

    const { error } = await supabase
      .from('cards')
      .update(payload as any)
      .eq('id', card.id)
    setIsSaving(false)

    if (!error) {
      setCreditCards(
        creditCards.map((c) =>
          c.id === card.id
            ? {
                ...c,
                name: cardName,
                bank: cardName,
                totalLimit: limit,
                availableLimit: limit,
                dueDate,
                closingDate,
                bestPurchaseDay: closingDate,
                accountId: accountId === 'none' ? undefined : accountId,
                lastDigits: lastDigits || undefined,
                color,
              }
            : c,
        ),
      )
      toast({ title: 'Cartão Atualizado', description: 'As alterações foram salvas.' })
      onOpenChange(false)
    } else {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cartão</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Cor</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Identificação</Label>
              <Input name="name" defaultValue={card.name} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Últimos 4 dígitos</Label>
              <Input
                name="lastDigits"
                defaultValue={card.lastDigits || ''}
                maxLength={4}
                pattern="\d{4}"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label>Limite Global (R$)</Label>
              <Input
                name="limit"
                type="number"
                step="0.01"
                defaultValue={card.totalLimit}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Conta Vinculada para Pagamento</Label>
            <Select name="accountId" defaultValue={card.accountId || 'none'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Independente</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fechamento</Label>
              <Input
                name="closingDate"
                type="number"
                min="1"
                max="31"
                defaultValue={card.closingDate}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Input
                name="dueDate"
                type="number"
                min="1"
                max="31"
                defaultValue={card.dueDate}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
