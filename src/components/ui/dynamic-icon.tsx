import { memo } from 'react'
import * as Icons from 'lucide-react'

export const DynamicIcon = memo(({ name, className }: { name?: string; className?: string }) => {
  const IconComponent = name ? (Icons as any)[name] : null
  const RenderedIcon = IconComponent || Icons.CircleDashed
  return <RenderedIcon className={className} />
})
