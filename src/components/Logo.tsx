import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Waves } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconClassName?: string
  showText?: boolean
  textClassName?: string
}

export function Logo({ className, iconClassName, showText = true, textClassName }: LogoProps) {
  const { logoUrl } = useAppStore()
  const [imgError, setImgError] = useState(false)
  // Attempt to load a high-res SVG or PNG from public, defaulting to logoUrl if configured
  const src = logoUrl || '/logo.svg'

  useEffect(() => {
    setImgError(false)
  }, [src])

  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2 transition-opacity hover:opacity-90', className)}
    >
      {!imgError ? (
        <img
          src={src}
          alt="FinFlow Logo"
          className={cn('h-8 w-auto object-contain', iconClassName)}
          onError={() => setImgError(true)}
        />
      ) : (
        <>
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary flex items-center justify-center">
            <Waves className={cn('h-6 w-6', iconClassName)} />
          </div>
          {showText && (
            <span className={cn('font-bold text-xl tracking-tight', textClassName)}>FinFlow</span>
          )}
        </>
      )}
    </Link>
  )
}
