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
import { AlertTriangle, Archive, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { Profile } from '@/stores/useAppStore'
import { supabase } from '@/lib/supabase/client'

interface ProfileDeleteFlowProps {
  profile: Profile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDeleteFlow({ profile, open, onOpenChange }: ProfileDeleteFlowProps) {
  const [phase, setPhase] = useState<1 | 2>(1)
  const [confirmName, setConfirmName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { profiles, setProfiles } = useAppStore()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setPhase(1)
      setConfirmName('')
    }
  }, [open])

  const handleArchive = async () => {
    setIsProcessing(true)
    if (profile.id.length > 10) {
      const { error } = await supabase
        .from('members')
        .update({ is_archived: true })
        .eq('id', profile.id)
      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' })
        setIsProcessing(false)
        return
      }
    }

    setProfiles(profiles.map((p) => (p.id === profile.id ? { ...p, isArchived: true } : p)))
    toast({
      title: 'Perfil Arquivado',
      description: 'O perfil foi movido para os arquivados e ocultado das visões principais.',
    })
    setIsProcessing(false)
    onOpenChange(false)
  }

  const handleFinalDelete = async () => {
    setIsProcessing(true)

    if (profile.id.length > 10) {
      const { error } = await supabase.from('members').delete().eq('id', profile.id)
      if (error) {
        toast({
          title: 'Erro de Conexão',
          description: 'Não foi possível excluir o perfil no momento.',
          variant: 'destructive',
        })
        setIsProcessing(false)
        return
      }
    }

    setProfiles(profiles.filter((p) => p.id !== profile.id))
    toast({
      title: 'Perfil Excluído',
      description: 'Os dados do membro e transações atreladas foram removidos permanentemente.',
      variant: 'destructive',
    })

    setIsProcessing(false)
    onOpenChange(false)
  }

  if (phase === 1) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">Opções de Remoção</DialogTitle>
            <DialogDescription className="mt-4 text-sm text-muted-foreground">
              O que você deseja fazer com o perfil de <strong>{profile.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 border rounded-lg bg-muted/20">
              <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                <Archive className="w-4 h-4" /> Arquivar Perfil
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Oculte o perfil das visões principais, mantendo as transações antigas para não
                afetar os relatórios e saldo histórico.
              </p>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleArchive}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Arquivar Perfil
              </Button>
            </div>
            <div className="p-3 border border-destructive/20 rounded-lg bg-destructive/5">
              <h4 className="font-semibold text-sm mb-1 text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Exclusão Permanente
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Remove o perfil definitivamente. Todas as transações passadas ligadas a ele serão
                apagadas, alterando o patrimônio histórico.
              </p>
              <Button variant="destructive" className="w-full" onClick={() => setPhase(2)}>
                Excluir Permanentemente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
            disabled={isProcessing}
            className="border-destructive/50 focus-visible:ring-destructive"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleFinalDelete}
            disabled={confirmName !== profile.name || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Confirmar Exclusão'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
