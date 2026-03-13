import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { KeyRound, Mail, Smartphone, Laptop, History } from 'lucide-react'

export function SecuritySettings() {
  const { toast } = useToast()
  const [twoFactor, setTwoFactor] = useState(true)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Senha atualizada', description: 'Sua senha foi alterada com sucesso.' })
  }

  const handleLogoutAll = () => {
    toast({
      title: 'Sessões encerradas',
      description: 'Desconectado de todos os dispositivos remotamente.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-muted-foreground" /> Alterar Senha
            </CardTitle>
            <CardDescription>Requer maiúsculas, minúsculas, números e símbolos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label>Senha Atual</Label>
                <Input type="password" required />
              </div>
              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input
                  type="password"
                  required
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                />
              </div>
              <Button type="submit">Atualizar</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" /> Alterar E-mail
            </CardTitle>
            <CardDescription>Confirmação dupla exigida para alteração.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                toast({ title: 'Link Enviado' })
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>E-mail Antigo</Label>
                <Input type="email" required />
              </div>
              <div className="space-y-2">
                <Label>Novo E-mail</Label>
                <Input type="email" required />
              </div>
              <Button type="submit">Solicitar Troca</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <Smartphone className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="text-base font-medium">Autenticação em Duas Etapas (2FA)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Camada extra de segurança via App ou SMS.
                </p>
              </div>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Laptop className="w-5 h-5" /> Sessões Ativas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between p-3 border rounded-lg">
            <p className="font-medium">MacBook Pro (Atual)</p>
            <p className="text-xs text-muted-foreground">São Paulo, BR</p>
          </div>
          <div className="flex justify-between p-3 border rounded-lg items-center">
            <p className="font-medium">iPhone 13</p>
            <Button variant="ghost" size="sm" className="text-destructive">
              Remover
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 px-6 py-4">
          <Button variant="outline" className="w-full text-destructive" onClick={handleLogoutAll}>
            Encerrar Todas as Outras Sessões
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
