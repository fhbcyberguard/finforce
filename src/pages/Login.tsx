import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { Logo } from '@/components/Logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      const { error } = await signIn(email, password)
      setIsLoading(false)

      if (error) {
        toast({
          title: 'Erro no login',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo de volta ao FinFlow.',
        })
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-4">
            <Logo imageClassName="h-16 sm:h-20 w-auto drop-shadow-sm" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight sr-only">FinFlow</CardTitle>
          <CardDescription>Acesse a gestão financeira da sua família</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@familia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Esqueci minha senha
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Entrar na Conta
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-6">
            Não tem uma conta?{' '}
            <Link to="/registro" className="text-primary hover:underline font-medium">
              Cadastre-se
            </Link>
          </p>
        </CardContent>
        <CardFooter className="justify-center pt-2 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            Ao continuar, você concorda com nossos Termos de Serviço.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
