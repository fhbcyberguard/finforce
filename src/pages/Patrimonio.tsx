import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AllocationChart from '../components/patrimonio/AllocationChart'
import AssetList from '../components/patrimonio/AssetList'
import EnrichmentCalculator from '../components/patrimonio/EnrichmentCalculator'

export default function Patrimonio() {
  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Patrimônio</h1>
        <p className="text-muted-foreground">
          Gerencie seus ativos, alocações e projete seu enriquecimento a longo prazo.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AllocationChart className="lg:col-span-1" />
            <AssetList className="lg:col-span-2" />
          </div>
        </TabsContent>
        <TabsContent value="calculator" className="mt-6">
          <EnrichmentCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
