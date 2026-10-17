'use client'

import { useState } from 'react'
import type { ContentItem, ItemStatus, Platform } from '@/lib/jev-engine'
import { cn } from '@/lib/utils'
import { AnalyzeForm } from './analyze-form'
import { ContentCard } from './content-card'

type Filter = ItemStatus | 'all'

const FILTERS: Array<{ id: Filter; label: string; dot?: string; active: string }> = [
  { id: 'doubt', label: 'Casos Dudosos', dot: 'bg-amber-400', active: 'border-amber-500/30 bg-amber-500/20 text-amber-300' },
  { id: 'approved', label: 'Aprobados', dot: 'bg-emerald-400', active: 'border-emerald-500/20 bg-emerald-500/20 text-emerald-300' },
  { id: 'rejected', label: 'Descartados', dot: 'bg-rose-400', active: 'border-rose-500/20 bg-rose-500/20 text-rose-300' },
  { id: 'all', label: 'Ver Todos', active: 'border-slate-700 bg-slate-800 text-white' },
]

type QueueViewProps = {
  items: ContentItem[]
  onAction: (id: number, status: ItemStatus) => void
  onEdit: (item: ContentItem) => void
  onAnalyze: (input: { platform: Platform; type: string; content: string }) => ItemStatus
}

export function QueueView({ items, onAction, onEdit, onAnalyze }: QueueViewProps) {
  const [filter, setFilter] = useState<Filter>('doubt')

  const counts = {
    doubt: items.filter((i) => i.status === 'doubt').length,
    approved: items.filter((i) => i.status === 'approved').length,
    rejected: items.filter((i) => i.status === 'rejected').length,
    all: items.length,
  }
  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter)

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <AnalyzeForm onSubmit={(input) => setFilter(onAnalyze(input))} />

      <div role="tablist" aria-label="Filtrar contenido" className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              filter === f.id ? f.active : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200',
            )}
          >
            {f.dot && <span className={cn('h-2 w-2 rounded-full', f.dot)} aria-hidden="true" />}
            {f.label} ({counts[f.id]})
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center text-sm text-slate-500">
            No hay piezas de contenido en esta bandeja. ¡Excelente trabajo!
          </div>
        ) : (
          filtered.map((item) => <ContentCard key={item.id} item={item} onAction={onAction} onEdit={onEdit} />)
        )}
      </div>
    </div>
  )
}
