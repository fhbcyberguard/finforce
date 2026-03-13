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
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface ImpulseControlDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  reflectionText: string
  confirmText?: string
  destructive?: boolean
  mode?: 'warning' | 'success'
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
  mode = 'warning',
}: ImpulseControlDialogProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (open) {
      if (mode === 'success') {
        setCountdown(0)
      } else {
        setCountdown(5)
        const timer = setInterval(() => {
          setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
      }
    }
  }, [open, mode])

  const handleConfirm = () => {
    if (countdown === 0) {
      onConfirm()
      onOpenChange(false)
    }
  }

  const isSuccess = mode === 'success'

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => (isSuccess || countdown === 0 || !o) && onOpenChange(o)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 ${isSuccess ? 'text-emerald-500' : 'text-destructive'}`}
          >
            {isSuccess ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}{' '}
            {title}
          </DialogTitle>
          <div
            className={`pt-4 pb-2 text-sm text-muted-foreground italic border-l-2 pl-4 ml-1 rounded-r-md whitespace-normal break-words ${isSuccess ? 'border-emerald-500 bg-emerald-500/5' : 'border-primary bg-primary/5'}`}
          >
            <Typewriter text={reflectionText} speed={30} />
          </div>
          <DialogDescription className="mt-4">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          {!isSuccess && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          )}
          <Button
            variant={isSuccess ? 'default' : destructive ? 'destructive' : 'default'}
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
