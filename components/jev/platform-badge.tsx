import { Camera, Briefcase, FileText } from 'lucide-react'
import type { Platform } from '@/lib/jev-engine'

const ICONS = {
  Instagram: { icon: Camera, color: 'text-pink-400' },
  LinkedIn: { icon: Briefcase, color: 'text-sky-400' },
  Blog: { icon: FileText, color: 'text-green-300' },
} as const

export function PlatformBadge({ platform, type }: { platform: Platform; type: string }) {
  const { icon: Icon, color } = ICONS[platform]
  return (
    <span className="flex items-center gap-1.5 rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
      <Icon className={`h-3.5 w-3.5 ${color}`} aria-hidden="true" />
      {platform} · {type}
    </span>
  )
}
