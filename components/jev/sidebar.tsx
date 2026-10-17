import { Filter, LayoutDashboard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Tab = 'queue' | 'dashboard' | 'rules'

const NAV: Array<{ id: Tab; label: string; icon: typeof Filter }> = [
  { id: 'queue', label: 'Cola de Revisión', icon: Filter },
  { id: 'dashboard', label: 'Métricas & Impacto', icon: LayoutDashboard },
  { id: 'rules', label: 'Motor de Reglas', icon: Settings },
]

type SidebarProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  pendingCount: number
}

export function Sidebar({ activeTab, onTabChange, pendingCount }: SidebarProps) {
  return (
    <aside className="flex shrink-0 flex-col justify-between border-b border-slate-800 bg-slate-900/50 p-4 md:h-screen md:w-64 md:border-r md:border-b-0 md:p-6">
      <div>
        <div className="mb-4 flex items-center gap-3 md:mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
            J
          </div>
          <div>
            <p className="font-bold tracking-tight text-white">JEV AI</p>
            <p className="text-xs text-slate-400">Content Governance</p>
          </div>
        </div>

        <nav aria-label="Principal" className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:w-full',
                  active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                {id === 'queue' && (
                  <span
                    className={cn(
                      'ml-auto rounded-full px-2 py-0.5 text-xs',
                      active ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300',
                    )}
                  >
                    {pendingCount}
                    <span className="sr-only"> pendientes</span>
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <p className="hidden border-t border-slate-800/80 pt-4 text-xs text-slate-500 md:block">
        Hackathon 30X Prototype v1.0
      </p>
    </aside>
  )
}
