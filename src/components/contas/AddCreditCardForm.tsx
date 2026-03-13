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
import { Lock, CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'

export function AddCreditCardForm() {
  const { toast } = useToast()
  const { creditCards, setCreditCards, accounts } = useAppStore()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const newCard = {
      id: Math.random().toString(),
      name: fd.get('name') as string,
      bank: fd.get('bank') as string,
      brand: fd.get('brand') as string,
      lastDigits: fd.get('lastDigits') as string,
      accountId: fd.get('accountId') as string,
      totalLimit: Number(fd.get('limit')),
      availableLimit: Number(fd.get('limit')),
      dueDate: Number(fd.get('dueDate')),
      bestPurchaseDay: Number(fd.get('bestDay')),
      isArchived: false,
    }

    setCreditCards([...creditCards, newCard])
    toast({
      title: 'Cartão Registrado',
      description: 'O novo cartão já está disponível no seu painel.',
    })
    e.currentTarget.reset()
  }

  return (
    <Card className="border-border/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#126eda]" /> Adicionar Cartão
        </CardTitle>
        <CardDescription>
          Insira apenas os últimos 4 dígitos. Dados protegidos no dispositivo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Identificação</Label>
            <Input name="name" placeholder="Ex: Cartão da Loja, Nubank Principal" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Emissor (Banco/Fintech)</Label>
              <Input name="bank" placeholder="Ex: Itaú Personnalité" required />
            </div>
            <div className="space-y-2">
              <Label>Bandeira</Label>
              <Input name="brand" placeholder="Mastercard, Visa" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Conta Vinculada</Label>
              <Select name="accountId" defaultValue="none">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Independente</SelectItem>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Últimos 4 Dígitos</Label>
              <div className="relative">
                <Input
                  name="lastDigits"
                  placeholder="1234"
                  maxLength={4}
                  required
                  className="font-mono pl-10"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Limite Global (R$)</Label>
            <Input name="limit" type="number" step="0.01" placeholder="5000" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dia de Vencimento</Label>
              <Input name="dueDate" type="number" min="1" max="31" placeholder="10" required />
            </div>
            <div className="space-y-2">
              <Label>Melhor Dia</Label>
              <Input name="bestDay" type="number" min="1" max="31" placeholder="3" required />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-2 bg-[#126eda] text-white hover:bg-[#126eda]/90"
          >
            Registrar Cartão Seguro
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
