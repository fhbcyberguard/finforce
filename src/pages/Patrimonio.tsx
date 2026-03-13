import { useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, User, Plus, TrendingUp } from 'lucide-react'
import { differenceInYears } from 'date-fns'

export default function Patrimonio() {
  const { profiles, simulatorSettings, assets } = useAppStore()

  const targetAge = simulatorSettings?.idade || 60

  const totalAssets = useMemo(() => {
    return assets.reduce((acc, asset) => acc + asset.value, 0)
  }, [assets])

  return (
    <div className="space-y-8 animate-slide-in-up pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
          Patrimônio & Aposentadoria
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seus ativos e o progresso para a independência financeira.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-3 border-border/50 bg-[#126eda]/5 border-[#126eda]/20">
          <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Patrimônio Total Acumulado
              </p>
              <h2 className="text-4xl font-bold text-[#126eda]">
                R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <Button className="bg-[#126eda] text-white hover:bg-[#126eda]/90 gap-2">
              <Plus className="w-4 h-4" /> Novo Ativo
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-[#126eda]" />
          Plano de Aposentadoria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => {
            const currentAge = p.birthDate
              ? differenceInYears(new Date(), new Date(p.birthDate))
              : p.currentAge || 0
            const futureAge = targetAge
            const remaining = futureAge - currentAge

            return (
              <Card
                key={p.id}
                className="border-border/50 hover:border-[#126eda]/30 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#126eda]/10 p-2.5 rounded-full text-[#126eda]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{p.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{p.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                    <span className="text-sm text-muted-foreground">Idade Atual</span>
                    <span className="font-semibold">{currentAge} anos</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-[#126eda]/5 border border-[#126eda]/10">
                    <span className="text-sm text-muted-foreground">Idade Futura (Alvo)</span>
                    <span className="font-bold text-[#126eda]">{futureAge} anos</span>
                  </div>
                  <div className="flex justify-between items-center px-2 pt-1 text-sm">
                    <span className="text-muted-foreground">Tempo Restante</span>
                    <span className="font-medium">
                      {remaining > 0 ? `${remaining} anos` : 'Atingido'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {profiles.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-lg">
              Nenhum perfil cadastrado. Adicione membros para visualizar o plano de aposentadoria.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#126eda]" />
          Meus Ativos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{asset.name}</h3>
                  <span className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded">
                    {asset.category}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Valor Aplicado</p>
                  <p className="text-xl font-bold">R$ {asset.value.toLocaleString('pt-BR')}</p>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Taxa: </span>
                  <span className="font-medium text-emerald-500">{asset.rate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {assets.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-lg">
              Nenhum ativo financeiro registrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
