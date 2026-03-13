import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoImg from '../assets/copia-de-logo-drowp-horizontal-3e587.png'

interface LogoProps {
  className?: string
  imageClassName?: string
}

export function Logo({ className, imageClassName }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2 transition-opacity hover:opacity-90', className)}
    >
      <img
        src={logoImg}
        alt="FinFlow Logo"
        className={cn('h-8 sm:h-10 w-auto object-contain', imageClassName)}
      />
    </Link>
  )
}
