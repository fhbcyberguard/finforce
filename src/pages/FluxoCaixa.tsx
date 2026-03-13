import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function FluxoCaixa() {
  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
        <p className="text-muted-foreground">Visão detalhada de entradas e saídas da família.</p>
      </div>

      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
          <h3 className="text-xl font-medium mb-2">Módulo em Desenvolvimento</h3>
          <p className="text-muted-foreground max-w-md">
            Esta área será dedicada ao acompanhamento diário de transações. No momento, o foco
            estratégico do sistema está nas projeções de longo prazo e segurança no módulo
            "Patrimônio" e "Cartões".
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
