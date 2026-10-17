import type { ContentItem } from '@/lib/jev-engine'

const BASE_PROCESSED = 138
const BASE_AUTO_APPROVED = 108
const MINUTES_PER_MANUAL_REVIEW = 2.5

export function DashboardView({ items }: { items: ContentItem[] }) {
  const processed = BASE_PROCESSED + items.length
  const autoApproved = BASE_AUTO_APPROVED + items.filter((i) => i.status === 'approved' && !i.edited).length
  const pending = items.filter((i) => i.status === 'doubt').length
  const autonomyRate = ((autoApproved / processed) * 100).toFixed(1)
  const hoursSaved = ((autoApproved * MINUTES_PER_MANUAL_REVIEW) / 60).toFixed(1)

  const stats = [
    { label: 'Piezas Procesadas Hoy', value: processed, hint: '+18% vs ayer', valueClass: 'text-white', hintClass: 'text-emerald-400' },
    { label: 'Aprobación Autónoma JEV', value: `${autonomyRate}%`, hint: `${autoApproved} piezas sin intervención`, valueClass: 'text-emerald-400' },
    { label: 'Casos en Revisión', value: pending, hint: 'Pendientes / Dudosos', valueClass: 'text-amber-400' },
    { label: 'Tiempo Ahorrado Estimado', value: `${hoursSaved} hrs`, hint: 'Equivalente a ~0.5 FTE', valueClass: 'text-green-400' },
  ]

  const buckets = [
    { label: 'Alta (≥80%)', count: items.filter((i) => i.confidence >= 80).length, bar: 'bg-emerald-500' },
    { label: 'Media (50–79%)', count: items.filter((i) => i.confidence >= 50 && i.confidence < 80).length, bar: 'bg-amber-500' },
    { label: 'Baja (<50%)', count: items.filter((i) => i.confidence < 50).length, bar: 'bg-rose-500' },
  ]
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count))

  const ruleFailures = new Map<string, number>()
  for (const item of items) {
    for (const rule of item.rules) {
      if (rule.status === 'fail') {
        const key = rule.name.replace(/\s*\(.*\)$/, '')
        ruleFailures.set(key, (ruleFailures.get(key) ?? 0) + 1)
      }
    }
  }
  const topFailures = [...ruleFailures.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-8">
      <section aria-label="Indicadores clave" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
            <p className="text-xs font-medium uppercase text-neutral-400">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.valueClass}`}>{s.value}</p>
            <p className={`mt-1 text-xs ${s.hintClass ?? 'text-neutral-500'}`}>{s.hint}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Distribución de confianza (sesión actual)</h3>
          <ul className="space-y-3">
            {buckets.map((b) => (
              <li key={b.label} className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>{b.label}</span>
                  <span className="font-medium text-neutral-200">{b.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
                  <div className={`h-full rounded-full ${b.bar}`} style={{ width: `${(b.count / maxBucket) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Reglas más infringidas</h3>
          {topFailures.length === 0 ? (
            <p className="text-sm text-neutral-500">Ninguna regla infringida en esta sesión.</p>
          ) : (
            <ol className="space-y-2">
              {topFailures.map(([name, count], idx) => (
                <li
                  key={name}
                  className="flex items-center gap-3 rounded-lg border border-neutral-800/60 bg-neutral-950/40 px-3 py-2 text-sm"
                >
                  <span className="text-xs font-bold text-neutral-500">{idx + 1}</span>
                  <span className="flex-1 text-neutral-200">{name}</span>
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">{count}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}
