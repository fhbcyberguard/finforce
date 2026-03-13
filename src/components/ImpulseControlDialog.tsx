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
import { Typewriter } from './Typewriter'
import { AlertTriangle } from 'lucide-react'

interface ImpulseControlDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  reflectionText: string
  confirmText?: string
  destructive?: boolean
}

export function ImpulseControlDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  reflectionText,
  confirmText = 'Confirmar',
  destructive = true,
}: ImpulseControlDialogProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (open) {
      setCountdown(5)
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [open])

  const handleConfirm = () => {
    if (countdown === 0) {
      onConfirm()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (countdown === 0 || !o) && onOpenChange(o)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" /> {title}
          </DialogTitle>
          <div className="pt-4 pb-2 text-sm text-muted-foreground italic border-l-2 border-primary pl-4 ml-1 bg-primary/5 rounded-r-md">
            <Typewriter text={reflectionText} speed={30} />
          </div>
          <DialogDescription className="mt-4">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={countdown > 0}
            className="min-w-[140px] transition-all"
          >
            {countdown > 0 ? `Aguarde ${countdown}s...` : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
