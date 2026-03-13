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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { KeyRound, Mail, ShieldAlert, Laptop, Fingerprint, Copy } from 'lucide-react'
import { MOCK_ACCESS_LOGS } from '@/lib/mockData'

export function SecuritySettings() {
  const { toast } = useToast()
  const [mfaMethod, setMfaMethod] = useState('totp')
  const [showCodes, setShowCodes] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Senha atualizada', description: 'Sua senha foi alterada com sucesso.' })
  }

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Dupla confirmação necessária',
      description: 'Enviamos um link para o e-mail antigo e para o novo.',
    })
  }

  const handleLogoutAll = () => {
    toast({
      title: 'Sessões encerradas',
      description: 'Desconectado de todos os dispositivos remotamente.',
    })
  }

  const generateBackupCodes = () => {
    setShowCodes(true)
    toast({ title: 'Códigos Gerados', description: 'Guarde-os em um local seguro.' })
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
              <Button type="submit">Atualizar Senha</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" /> Alterar E-mail
            </CardTitle>
            <CardDescription>
              Confirmação dupla (antigo e novo) exigida para alteração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div className="space-y-2">
                <Label>E-mail Antigo</Label>
                <Input type="email" required />
              </div>
              <div className="space-y-2">
                <Label>Novo E-mail</Label>
                <Input type="email" required />
              </div>
              <Button type="submit">Solicitar Troca Segura</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" /> Autenticação Multifator (MFA)
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança além da sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={mfaMethod} onValueChange={setMfaMethod} className="gap-4">
            <div className="flex items-center space-x-3 border p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="totp" id="totp" />
              <Label htmlFor="totp" className="flex flex-col cursor-pointer flex-1">
                <span className="font-medium flex items-center gap-2">
                  App Autenticador (Recomendado){' '}
                  <Fingerprint className="w-3 h-3 text-emerald-500" />
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  Use Google Auth, Authy, etc.
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 border p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="sms" id="sms" />
              <Label htmlFor="sms" className="flex flex-col cursor-pointer flex-1">
                <span className="font-medium">SMS</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Receba códigos via mensagem de texto.
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 border p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="flex flex-col cursor-pointer flex-1">
                <span className="font-medium">E-mail</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Menos seguro. Receba códigos no seu e-mail cadastrado.
                </span>
              </Label>
            </div>
          </RadioGroup>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm mb-2">Códigos de Backup</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Caso perca acesso ao seu dispositivo de 2FA, use estes códigos únicos.
            </p>
            {showCodes ? (
              <div className="bg-muted p-4 rounded-md relative group">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm tracking-widest text-center">
                  <span>8472-1923</span>
                  <span>3912-9984</span>
                  <span>1048-2831</span>
                  <span>5812-4029</span>
                  <span>7748-1290</span>
                  <span>9021-3847</span>
                  <span>2283-4910</span>
                  <span>4029-1837</span>
                  <span>1192-3847</span>
                  <span>8837-2019</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={generateBackupCodes}>
                Gerar 10 Códigos
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Laptop className="w-5 h-5" /> Sessões e Logs de Acesso
          </CardTitle>
          <CardDescription>Monitore de onde sua conta está sendo acessada.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Endereço IP</TableHead>
                <TableHead className="text-right">Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ACCESS_LOGS.map((log, i) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {log.device}{' '}
                    {i === 0 && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Atual
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.location}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.ip}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {log.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/20 px-6 py-4">
          <Button
            variant="outline"
            className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={handleLogoutAll}
          >
            Encerrar Todas as Outras Sessões
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
