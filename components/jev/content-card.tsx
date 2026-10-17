import { AlertTriangle, Check, CheckCircle2, Edit3, RotateCcw, XCircle } from 'lucide-react'
import type { ContentItem, ItemStatus } from '@/lib/jev-engine'
import { cn } from '@/lib/utils'
import { PlatformBadge } from './platform-badge'

type ContentCardProps = {
  item: ContentItem
  onAction: (id: number, status: ItemStatus) => void
  onEdit: (item: ContentItem) => void
}

function confidenceTone(confidence: number) {
  if (confidence >= 80) return 'bg-emerald-500/10 text-emerald-400'
  if (confidence >= 50) return 'bg-amber-500/10 text-amber-400'
  return 'bg-rose-500/10 text-rose-400'
}

const STATUS_LABEL: Record<ItemStatus, { label: string; className: string }> = {
  doubt: { label: 'Pendiente', className: 'text-amber-300' },
  approved: { label: 'Aprobado', className: 'text-emerald-300' },
  rejected: { label: 'Descartado', className: 'text-rose-300' },
}

export function ContentCard({ item, onAction, onEdit }: ContentCardProps) {
  const status = STATUS_LABEL[item.status]

  return (
    <article className="flex flex-col items-start justify-between gap-6 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-5 transition-colors hover:border-neutral-700 md:flex-row md:p-6">
      <div className="w-full flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <PlatformBadge platform={item.platform} type={item.type} />
          <span className={cn('rounded-md px-2.5 py-1 text-xs font-semibold', confidenceTone(item.confidence))}>
            Confianza PubliX: {item.confidence}%
          </span>
          {item.edited && (
            <span className="rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-300">
              Editado
            </span>
          )}
          <span className="ml-auto text-xs text-neutral-500">
            <span className={cn('mr-2 font-medium', status.className)}>{status.label}</span>
            ID: #{item.id}
          </span>
        </div>

        <blockquote className="rounded-lg border border-neutral-800/50 bg-neutral-950/60 p-4 font-mono text-sm leading-relaxed text-neutral-200">
          {`"${item.content}"`}
        </blockquote>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Evaluación de Reglas PubliX</p>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {item.rules.map((rule) => (
              <li
                key={rule.name}
                className="flex items-start gap-2 rounded border border-neutral-800/40 bg-neutral-950/40 p-2 text-xs"
              >
                {rule.status === 'pass' ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-label="Cumple" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-label="No cumple" />
                )}
                <div>
                  <span className={rule.status === 'pass' ? 'text-neutral-300' : 'font-medium text-amber-300'}>
                    {rule.name}
                  </span>
                  {rule.note && <p className="mt-0.5 text-[11px] text-neutral-500">{rule.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex w-full shrink-0 gap-2 md:w-44 md:flex-col">
        {item.status === 'doubt' ? (
          <>
            <button
              type="button"
              onClick={() => onAction(item.id, 'approved')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-emerald-400"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Aprobar
            </button>
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-200 transition-colors hover:bg-neutral-700"
            >
              <Edit3 className="h-4 w-4" aria-hidden="true" /> Editar & Aprobar
            </button>
            <button
              type="button"
              onClick={() => onAction(item.id, 'rejected')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-rose-900/50 bg-rose-950/40 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-900/40"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" /> Descartar
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onAction(item.id, 'doubt')}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Devolver a revisión
          </button>
        )}
      </div>
    </article>
  )
}
