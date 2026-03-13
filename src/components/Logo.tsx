import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoImg from '../assets/chatgpt-image-12-de-mar.de-2026-22_38_23-fe734.png'

interface LogoProps {
  className?: string
  onClick?: () => void
}

export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 transition-opacity hover:opacity-90 shrink-0',
        className,
      )}
    >
      <img
        src={logoImg}
        alt="FinFlow Logo"
        className="h-10 w-auto object-contain rounded-md shadow-sm"
      />
    </Link>
  )
}
