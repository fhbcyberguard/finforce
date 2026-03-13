import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoImg from '../assets/copia-de-logo-drowp-horizontal-3e587.png'

interface LogoProps {
  className?: string
  imageClassName?: string
  to?: string
}

export function Logo({ className, imageClassName, to = '/' }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn('flex items-center gap-2 transition-opacity hover:opacity-90', className)}
    >
      <img
        src={logoImg}
        alt="FinForce Logo"
        className={cn('h-10 sm:h-12 w-auto object-contain', imageClassName)}
      />
    </Link>
  )
}
