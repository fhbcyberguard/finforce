import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
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
import { CreditCard, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export function AddCreditCardForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { creditCards, setCreditCards, accounts, currentContext } = useAppStore()
  const [isSaving, setIsSaving] = useState(false)
  const [color, setColor] = useState('#000000')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const form = e.currentTarget
    const fd = new FormData(form)
    const cardName = fd.get('name') as string
    const limit = Number(fd.get('limit'))
    const dueDate = Number(fd.get('dueDate'))
    const closingDate = Number(fd.get('closingDate'))
    const accountId = fd.get('accountId') as string
    const lastDigits = fd.get('lastDigits') as string

    if (lastDigits && !/^\d{4}$/.test(lastDigits)) {
      toast({
        title: 'Dados inválidos',
        description: 'Os últimos 4 dígitos devem conter exatamente 4 números.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    const payload = {
      user_id: user.id,
      name: cardName,
      limit,
      due_day: dueDate,
      closing_day: closingDate,
      account_id: accountId === 'none' ? null : accountId,
      last_digits: lastDigits || null,
      color,
    }

    const { data, error } = await supabase
      .from('cards')
      .insert(payload as any)
      .select()
      .single()
    setIsSaving(false)

    if (!error && data) {
      setCreditCards([
        ...creditCards,
        {
          id: data.id,
          name: data.name,
          bank: data.name,
          totalLimit: Number(data.limit),
          availableLimit: Number(data.limit),
          dueDate: data.due_day || 1,
          closingDate: data.closing_day || 1,
          bestPurchaseDay: data.closing_day || 1,
          accountId: data.account_id || 'none',
          isArchived: data.is_archived || false,
          context: currentContext,
          lastDigits: (data as any).last_digits || undefined,
          color: data.color || undefined,
        },
      ])
      toast({
        title: 'Cartão Registrado',
        description: 'O novo cartão já está disponível no seu painel.',
      })
      form.reset()
      setColor('#000000')
    } else {
      toast({ title: 'Erro ao salvar', description: error?.message, variant: 'destructive' })
    }
  }

  return (
    <Card className="border-border/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#126eda]" /> Adicionar Cartão
        </CardTitle>
        <CardDescription>Gerencie o limite e o fechamento da fatura.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Cor</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Identificação</Label>
              <Input name="name" placeholder="Ex: Nubank, Itaú Black" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Últimos 4 dígitos</Label>
              <Input
                name="lastDigits"
                placeholder="Ex: 1234"
                maxLength={4}
                pattern="\d{4}"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label>Limite Global (R$)</Label>
              <Input name="limit" type="number" step="0.01" placeholder="5000" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Conta Vinculada para Pagamento</Label>
            <Select name="accountId" defaultValue="none">
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
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
              <Label>Dia de Fechamento</Label>
              <Input name="closingDate" type="number" min="1" max="31" placeholder="3" required />
            </div>
            <div className="space-y-2">
              <Label>Dia de Vencimento</Label>
              <Input name="dueDate" type="number" min="1" max="31" placeholder="10" required />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full mt-2 bg-[#126eda] text-white hover:bg-[#126eda]/90"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Registrar Cartão
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
