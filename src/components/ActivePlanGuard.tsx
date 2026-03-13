import { Navigate, Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, ArrowRight } from 'lucide-react'

export function ActivePlanGuard() {
  const { profile, loading, user } = useAuth()

  if (loading || !profile || !user) return null

  const plan = profile.plan || 'solo'
  const isCanceled = plan === 'canceled'
  const isMasterAdmin = user.email === 'fhbcyberguard@gmail.com'

  if (isCanceled && !isMasterAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 animate-in fade-in zoom-in-95 duration-500">
        <Card className="max-w-md w-full border-border/50 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <CardHeader className="relative z-10 pt-8 pb-4">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-8 ring-background">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Assinatura Inativa</CardTitle>
            <CardDescription className="text-base mt-3 leading-relaxed">
              Sua assinatura foi cancelada ou não pôde ser renovada. Reative para continuar
              controlando suas finanças.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pb-8 space-y-4">
            <Button
              asChild
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25"
            >
              <Link to="/#pricing">
                Ver Planos e Assinar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground pt-2">
              Tem dúvidas? Fale com nosso suporte.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <Outlet />
}
