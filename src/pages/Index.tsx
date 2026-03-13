import KpiCards from '../components/dashboard/KpiCards'
import Simulator from '../components/dashboard/Simulator'
import AlertsPanel from '../components/dashboard/AlertsPanel'

export default function Index() {
  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta. Acompanhe seu progresso rumo à independência.
        </p>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Simulator />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>
    </div>
  )
}
