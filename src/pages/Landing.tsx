import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/hooks/use-auth'

const CHECKLIST = [
  'Importar extratos bancários',
  'Organizar seus gastos com consciência',
  'Ver sua vida financeira em um dashboard claro',
  'Receber alertas quando estiver gastando demais',
  'Definir metas financeiras',
  'Ver quem está gastando mais dentro da conta',
]

const PLANS = [
  {
    name: 'Solo',
    description: 'Controle financeiro pessoal',
    price: '💰 R$39/mês',
    features: ['1 usuário', 'Dashboard financeiro completo', 'Metas e alertas de gasto'],
  },
  {
    name: 'Duo',
    description: 'Ideal para casais',
    price: '💰 R$59/mês',
    features: [
      '2 usuários',
      'Controle financeiro compartilhado',
      'Visualização de gastos por membro',
    ],
  },
  {
    name: 'Pro',
    description: 'Famílias ou pequenos negócios',
    price: '💰 R$79/mês',
    features: ['até 5 membros', 'Dashboard financeiro compartilhado'],
  },
  {
    name: 'Business',
    description: 'Gestão financeira empresarial',
    price: '💰 R$99/mês',
    features: ['até 50 membros', 'Controle financeiro completo'],
  },
]

export default function Landing() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      <header className="container mx-auto px-4 h-20 flex items-center justify-between z-10 relative">
        <Logo className="h-8 md:h-10" />
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/registro">COMEÇAR TESTE GRATUITO</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center max-w-4xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Badge
            variant="secondary"
            className="mb-6 py-1.5 px-4 text-sm font-medium bg-primary/10 text-primary border-primary/20"
          >
            ✅ Teste grátis por 7 dias
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 text-foreground leading-tight">
            Se o seu dinheiro sumiu, o problema não é o banco.
          </h1>
          <div className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto space-y-3">
            <p>A maioria das pessoas não tem um problema de renda.</p>
            <p>Tem um problema de clareza financeira.</p>
            <p>
              O Fin Force mostra exatamente: para onde seu dinheiro está indo, quem está gastando
              mais, quanto realmente sobra no final do mês.
            </p>
            <p className="font-semibold text-foreground pt-2">
              Tudo em um dashboard simples e direto.
            </p>
          </div>
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
            asChild
          >
            <Link to="/registro">
              COMEÇAR TESTE GRATUITO <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </section>

        {/* Problem Section */}
        <section className="bg-muted/30 py-20 border-y border-border/50">
          <div className="container max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              O problema que quase todo mundo tem
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Você trabalha. Você ganha dinheiro. Mas no final do mês… o dinheiro simplesmente
              desaparece, o cartão vive no limite, ninguém sabe exatamente para onde foi. Sem
              clareza financeira, você continua repetindo os mesmos erros todos os meses. O Fin
              Force existe para resolver isso.
            </p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-24">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Como o Fin Force ajuda você
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl mx-auto mb-12">
              {CHECKLIST.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-card p-4 rounded-xl shadow-sm border border-border/50"
                >
                  <CheckCircle2 className="text-primary w-6 h-6 shrink-0 mt-0.5" />
                  <span className="text-lg font-medium text-card-foreground">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-xl md:text-2xl font-semibold text-primary">
              Sem planilhas. Sem confusão. Apenas clareza financeira.
            </p>
          </div>
        </section>

        {/* Plans Section */}
        <section id="pricing" className="bg-muted/30 py-24 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Escolha o plano ideal para você
              </h2>
              <Badge
                variant="outline"
                className="text-base py-1 px-4 border-primary/20 text-primary bg-primary/5"
              >
                ✅ Teste grátis por 7 dias
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {PLANS.map((plan) => (
                <Card
                  key={plan.name}
                  className="flex flex-col bg-background hover:border-primary/50 transition-colors shadow-sm"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="h-10">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-2xl font-bold mb-6 text-foreground">{plan.price}</div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-14 text-center">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                asChild
              >
                <Link to="/registro">COMEÇAR TESTE GRATUITO</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 text-center">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              Clareza financeira muda tudo.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Quando você vê a realidade do seu dinheiro: você para de perder dinheiro, você para de
              repetir erros, você volta a ter controle. Teste o Fin Force agora. 7 dias grátis.
            </p>
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 animate-pulse-alert"
              asChild
            >
              <Link to="/registro">COMEÇAR TESTE GRATUITO</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-10 bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo className="opacity-70 grayscale" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fin Force. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
