'use client'

import { useCallback, useState } from 'react'
import {
  buildInitialItems,
  DEFAULT_SETTINGS,
  evaluateContent,
  type ContentItem,
  type ItemStatus,
  type Platform,
  type RuleSettings,
} from '@/lib/jev-engine'
import { DashboardView } from './dashboard-view'
import { EditDialog } from './edit-dialog'
import { QueueView } from './queue-view'
import { RulesView } from './rules-view'
import { Sidebar, type Tab } from './sidebar'

const TITLES: Record<Tab, string> = {
  queue: 'Cola de Aprobación Inteligente',
  dashboard: 'Panel de Control y Ahorro',
  rules: 'Configuración de Reglas PubliX',
}

export function JevApp() {
  const [activeTab, setActiveTab] = useState<Tab>('queue')
  const [settings, setSettings] = useState<RuleSettings>(DEFAULT_SETTINGS)
  const [items, setItems] = useState<ContentItem[]>(() => buildInitialItems(DEFAULT_SETTINGS))
  const [editing, setEditing] = useState<ContentItem | null>(null)

  const handleAction = (id: number, status: ItemStatus) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const handleEditSave = (id: number, content: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...evaluateContent(content, settings), content, status: 'approved', edited: true }
          : item,
      ),
    )
    setEditing(null)
  }

  const handleAnalyze = (input: { platform: Platform; type: string; content: string }) => {
    const result = evaluateContent(input.content, settings)
    setItems((prev) => [{ id: Math.max(0, ...prev.map((i) => i.id)) + 1, ...input, ...result }, ...prev])
    return result.status
  }

  const handleSaveSettings = (next: RuleSettings) => {
    setSettings(next)
    setItems((prev) =>
      prev.map((item) => {
        const result = evaluateContent(item.content, next)
        const keepDecision = item.status === 'rejected' || item.edited
        return { ...item, ...result, status: keepDecision ? item.status : result.status }
      }),
    )
  }

  const closeEditor = useCallback(() => setEditing(null), [])
  const pendingCount = items.filter((i) => i.status === 'doubt').length

  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-neutral-100 md:h-screen md:flex-row">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} pendingCount={pendingCount} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900/30 px-4 py-3 md:px-8">
          <h1 className="text-lg font-semibold text-white">{TITLES[activeTab]}</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
            PubliX Active Engine · Umbral {settings.threshold}%
          </span>
        </header>

        {activeTab === 'queue' && (
          <QueueView items={items} onAction={handleAction} onEdit={setEditing} onAnalyze={handleAnalyze} />
        )}
        {activeTab === 'dashboard' && <DashboardView items={items} />}
        {activeTab === 'rules' && <RulesView settings={settings} onSave={handleSaveSettings} />}
      </main>

      {editing && <EditDialog item={editing} onClose={closeEditor} onSave={handleEditSave} />}
    </div>
  )
}
