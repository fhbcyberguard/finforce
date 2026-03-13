import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, TrendingUp, Users } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Logo className="h-8 md:h-10" />
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Recursos
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sobre
          </a>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild className="bg-[#016ad9] text-white hover:bg-[#016ad9]/90 border-0">
            <Link to="/registro">Começar Agora</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32 text-center max-w-5xl flex flex-col items-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[#01f2ff] to-[#016ad9] text-transparent bg-clip-text">
            Gestão Financeira Familiar Inteligente
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            O FinForce gerencia o fluxo de caixa familiar e projeta a sua independência financeira
            com foco em segurança e mudança de comportamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Button
              size="lg"
              className="gap-2 w-full sm:w-auto bg-[#016ad9] text-white hover:bg-[#016ad9]/90 border-0"
              asChild
            >
              <Link to="/registro">
                Criar Conta Gratuita <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto hover:text-[#016ad9] hover:border-[#016ad9]/50"
              asChild
            >
              <Link to="/login">Acessar minha conta</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="bg-muted/40 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Por que escolher o FinForce?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="bg-[#016ad9]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-[#016ad9]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Segurança em 1º Lugar</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seus dados financeiros são processados e mantidos em total segurança e
                  privacidade.
                </p>
              </div>
              <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="bg-[#01f2ff]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-[#01f2ff]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Projeção de Metas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Acompanhe sua evolução patrimonial e saiba exatamente quando atingirá sua
                  independência.
                </p>
              </div>
              <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="bg-[#016ad9]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-[#016ad9]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gestão Familiar</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Compartilhe o acesso com sua família através de perfis personalizados e relatórios
                  integrados.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo className="opacity-70 hover:opacity-100 transition-opacity" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FinForce. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
