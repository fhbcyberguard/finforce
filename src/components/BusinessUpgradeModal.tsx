import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Building2, CheckCircle2, TrendingUp, Users } from 'lucide-react'

export function BusinessUpgradeModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[#03f2ff]/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="w-6 h-6 text-[#03f2ff]" />
            <span className="text-[#03f2ff]">Perfil Empresarial</span>
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            Desbloqueie o potencial máximo da sua gestão financeira com o plano Pro ou Família.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#03f2ff] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Gestão de Equipes</h4>
              <p className="text-sm text-muted-foreground">
                Controle limites de gastos por colaborador ou setor.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-[#03f2ff] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Relatórios Avançados</h4>
              <p className="text-sm text-muted-foreground">
                Visão clara do fluxo de caixa PJ e DRE simplificado.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#03f2ff] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Multi-Perfis Integrados</h4>
              <p className="text-sm text-muted-foreground">
                Alterne entre finanças pessoais e da empresa com apenas um clique.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-col gap-2 sm:space-x-0">
          <Button
            className="w-full bg-[#03f2ff] text-black hover:bg-[#03f2ff]/90 text-md h-12"
            onClick={() => onOpenChange(false)}
          >
            Fazer Upgrade Agora
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Talvez mais tarde
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
