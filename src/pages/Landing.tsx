import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Waves,
  TrendingUp,
  ShieldCheck,
  BrainCircuit,
  CheckCircle2,
  User,
  Building2,
  Briefcase,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <Link className="flex items-center justify-center gap-2" to="/">
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
            <Waves className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">FinFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            className="text-sm font-medium hover:text-primary transition-colors hidden sm:block"
            to="#entry-options"
          >
            Modos
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors hidden sm:block"
            to="#features"
          >
            Recursos
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors hidden sm:block"
            to="#pricing"
          >
            Planos
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" to="/login">
            Entrar
          </Link>
          <Button asChild size="sm">
            <Link to="/registro">Começar Grátis</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground mb-4">
                Lançamento Exclusivo
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl text-balance">
                Sua Jornada para a Independência Financeira Começa Aqui.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                Integre engenharia financeira, psicologia comportamental (TCC) e segurança bancária
                em uma única plataforma para sua família ou empresa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link to="/registro">Comece Agora</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                  <Link to="#pricing">Ver Planos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="entry-options"
          className="w-full py-16 md:py-24 bg-muted/10 border-y border-border/50"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Escolha seu Perfil</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Nossas soluções se adaptam perfeitamente ao seu momento de vida e trabalho.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="flex flex-col border-border/50 bg-card/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="p-3 bg-primary/10 w-fit rounded-lg text-primary mb-4">
                    <User className="w-6 h-6" />
                  </div>
                  <CardTitle>Para Você</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Pessoa física | Gestão financeira pessoal e familiar
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="flex flex-col border-border/50 bg-card/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="p-3 bg-primary/10 w-fit rounded-lg text-primary mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <CardTitle>Para Sua Empresa</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Pessoa jurídica | Gestão financeira empresarial e equipes
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="flex flex-col border-border/50 bg-card/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="p-3 bg-primary/10 w-fit rounded-lg text-primary mb-4">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <CardTitle>Híbrido</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Profissional liberal/MEI | Alternância entre perfis pessoal e empresarial
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full text-primary">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Simulador de Liberdade</h3>
                <p className="text-muted-foreground">
                  Projete seu futuro financeiro ajustando aportes, taxas e idade. Veja a curva de
                  juros compostos trabalhar ao vivo.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Segurança Robusta</h3>
                <p className="text-muted-foreground">
                  Autenticação 2FA, controle de sessões e Open Finance preparado para proteger os
                  dados da sua família.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full text-primary">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Inteligência Comportamental</h3>
                <p className="text-muted-foreground">
                  Gatilhos reflexivos baseados em TCC (Terapia Cognitivo-Comportamental) para evitar
                  decisões impulsivas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full py-16 md:py-24 bg-muted/10 border-t border-border/50"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Planos Integrados Hotmart
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Escolha o nível de acesso ideal para o seu momento financeiro. Cancelamento fácil a
                qualquer momento.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Plano Básico */}
              <Card className="flex flex-col border-border/50">
                <CardHeader>
                  <CardTitle>Básico</CardTitle>
                  <CardDescription>Para indivíduos focados no controle essencial.</CardDescription>
                  <div className="mt-4 text-4xl font-bold">
                    R$ 29<span className="text-lg text-muted-foreground font-normal">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 1 Perfil (Pessoal ou
                      Empresarial)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Fluxo de Caixa e Cartões
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Categorias Customizáveis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Metas Simples
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Assinar Básico
                  </Button>
                </CardFooter>
              </Card>

              {/* Plano Médio (Pro) */}
              <Card className="flex flex-col border-primary shadow-lg relative transform md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  MAIS POPULAR
                </div>
                <CardHeader>
                  <CardTitle>Médio (Pro)</CardTitle>
                  <CardDescription>Recursos avançados para acelerar sua jornada.</CardDescription>
                  <div className="mt-4 text-4xl font-bold">
                    R$ 59<span className="text-lg text-muted-foreground font-normal">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Tudo do plano Básico
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Até 5 Perfis (Familiar
                      ou Equipe)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Controle de
                      Investimentos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Simulador de Riqueza
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Assinar Pro</Button>
                </CardFooter>
              </Card>

              {/* Plano Top */}
              <Card className="flex flex-col border-border/50">
                <CardHeader>
                  <CardTitle>Top (Família/Empresa)</CardTitle>
                  <CardDescription>
                    Para famílias completas e gestão empresarial robusta.
                  </CardDescription>
                  <div className="mt-4 text-4xl font-bold">
                    R$ 99<span className="text-lg text-muted-foreground font-normal">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Tudo do plano Pro
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Perfis Ilimitados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Relatórios Avançados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Suporte Prioritário e
                      API
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Assinar Top
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-border/50 bg-muted/5 py-8">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            <span className="font-semibold">FinFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 FinFlow App. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Termos
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
