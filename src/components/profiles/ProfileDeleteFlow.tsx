import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle } from 'lucide-react'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { Profile } from '@/stores/useAppStore'

interface ProfileDeleteFlowProps {
  profile: Profile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDeleteFlow({ profile, open, onOpenChange }: ProfileDeleteFlowProps) {
  const [phase, setPhase] = useState<1 | 2>(1)
  const [confirmName, setConfirmName] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { profiles, setProfiles } = useAppStore()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setPhase(1)
      setConfirmName('')
    }
  }, [open])

  const handleFinalDelete = async () => {
    setIsDeleting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setProfiles(profiles.filter((p) => p.id !== profile.id))
      toast({
        title: 'Perfil Excluído',
        description: 'Os dados do membro foram removidos permanentemente.',
        variant: 'destructive',
      })
      onOpenChange(false)
    } catch (err) {
      toast({
        title: 'Erro de Conexão',
        description: 'Não foi possível excluir o perfil no momento. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (phase === 1) {
    return (
      <ImpulseControlDialog
        open={open}
        onOpenChange={onOpenChange}
        onConfirm={() => setPhase(2)}
        title="Atenção: Exclusão Permanente"
        description={`Você está prestes a excluir o perfil de ${profile.name}.`}
        reflectionText="Excluir este perfil vai remover todo o histórico financeiro ligado a ele. Esta decisão foi dialogada abertamente?"
        confirmText="Avançar"
        destructive={true}
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Confirmação de Segurança
          </DialogTitle>
          <DialogDescription>
            Para confirmar a exclusão irreversível, digite o nome exato do perfil:{' '}
            <strong className="text-foreground">{profile.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={`Digite "${profile.name}" para confirmar`}
            disabled={isDeleting}
            className="border-destructive/50 focus-visible:ring-destructive"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleFinalDelete}
            disabled={confirmName !== profile.name || isDeleting}
          >
            {isDeleting ? 'Processando...' : 'Confirmar Exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
