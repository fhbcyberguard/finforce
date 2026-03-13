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

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'E-mail atualizado', description: 'Um link de verificação foi enviado.' })
  }

  const handleLogoutAll = () => {
    toast({
      title: 'Sessões encerradas',
      description: 'Você foi desconectado de todos os outros dispositivos.',
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
            <CardDescription>Atualize sua senha de acesso periodicamente.</CardDescription>
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
                  title="A senha deve conter no mínimo 8 caracteres, maiúsculas, minúsculas, números e caracteres especiais"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Nova Senha</Label>
                <Input type="password" required />
              </div>
              <Button type="submit">Atualizar Senha</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" /> Alterar E-mail
            </CardTitle>
            <CardDescription>Modifique o e-mail associado à sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div className="space-y-2">
                <Label>Senha Atual</Label>
                <Input type="password" required />
              </div>
              <div className="space-y-2">
                <Label>Novo E-mail</Label>
                <Input type="email" required />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Novo E-mail</Label>
                <Input type="email" required />
              </div>
              <Button type="submit">Solicitar Alteração</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full mt-1">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-medium">Autenticação em Duas Etapas (2FA)</h3>
                <p className="text-sm text-muted-foreground max-w-[600px] mt-1">
                  Adiciona uma camada extra de segurança exigindo um código SMS ou app autenticador
                  ao fazer login.
                </p>
              </div>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={(c) => {
                setTwoFactor(c)
                toast({
                  title: c ? '2FA Ativado' : '2FA Desativado',
                  description: 'Configuração de segurança atualizada.',
                })
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Laptop className="w-5 h-5 text-muted-foreground" /> Sessões Ativas
            </CardTitle>
            <CardDescription>Gerencie os dispositivos conectados à sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div>
                <p className="font-medium flex items-center gap-2">
                  MacBook Pro{' '}
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full">
                    Sessão Atual
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  IP: 192.168.1.1 • São Paulo, BR • Há 2 min
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div>
                <p className="font-medium">iPhone 13</p>
                <p className="text-xs text-muted-foreground mt-1">
                  IP: 177.23.45.1 • Rio de Janeiro, BR • Há 2 horas
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                Desconectar
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 px-6 py-4">
            <Button
              variant="outline"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogoutAll}
            >
              Encerrar Todas as Outras Sessões
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-muted-foreground" /> Histórico de Acesso
            </CardTitle>
            <CardDescription>Últimas tentativas de login na conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">Login com Sucesso</p>
                    <p className="text-xs text-muted-foreground">Chrome no MacOS</p>
                  </div>
                  <div className="text-right">
                    <p>12 de Março, 2026</p>
                    <p className="text-xs text-muted-foreground">14:32</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
