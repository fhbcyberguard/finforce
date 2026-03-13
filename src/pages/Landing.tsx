import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Waves, TrendingUp, ShieldCheck, BrainCircuit, CheckCircle2 } from 'lucide-react'

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
            to="#features"
          >
            Recursos
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors hidden sm:block"
            to="#pricing"
          >
            Preços
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
                FinFlow: Sua Jornada para a Independência Financeira Começa Aqui.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                Gerencie o patrimônio da sua família, simule seu ponto de liberdade e desenvolva
                inteligência comportamental com nossa plataforma segura e intuitiva.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link to="/registro">Start Free Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                  <Link to="#features">Conhecer Plataforma</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-16 md:py-24 bg-muted/30 border-y border-border/50"
        >
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
                <h3 className="text-xl font-bold">Segurança Bancária</h3>
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
                  Gatilhos reflexivos baseados em TCC para ajudar você a manter o foco sem
                  sacrificar o presente.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://img.usecurling.com/p/600/400?q=dashboard&color=purple"
                  alt="Dashboard Preview"
                  className="rounded-xl border border-border/50 shadow-2xl"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">O Fim das Planilhas Complexas</h2>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>Acompanhamento de Ativos (CDB, FIIs, Tesouro, Ações)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>Nomenclaturas 100% personalizáveis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>Alertas antecipados (D-2) de vencimentos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-border/50 bg-muted/10 py-8">
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
