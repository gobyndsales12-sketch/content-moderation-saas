'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { RuleSettings } from '@/lib/jev-engine'

type RulesViewProps = {
  settings: RuleSettings
  onSave: (settings: RuleSettings) => void
}

type ToggleKey = 'absolutePromises' | 'emojiFormat' | 'requireCta'

const TOGGLES: Array<{ key: ToggleKey; title: string; description: string }> = [
  {
    key: 'absolutePromises',
    title: 'Filtro de Promesas Absolutas',
    description: 'Detectar palabras como "garantizado", "sin riesgo", "millonario".',
  },
  {
    key: 'emojiFormat',
    title: 'Validación de Emojis y Formato',
    description: 'Bloquear exceso de caracteres y emojis fuera de guía.',
  },
  {
    key: 'requireCta',
    title: 'Llamado a la Acción Obligatorio',
    description: 'Exigir un CTA claro en cada pieza publicada.',
  },
]

export function RulesView({ settings, onSave }: RulesViewProps) {
  const [draft, setDraft] = useState(settings)
  const [newWord, setNewWord] = useState('')
  const [saved, setSaved] = useState(false)

  const update = (patch: Partial<RuleSettings>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setSaved(false)
  }

  const addWord = () => {
    const word = newWord.trim().toLowerCase()
    if (!word || draft.bannedWords.includes(word)) return
    update({ bannedWords: [...draft.bannedWords, word] })
    setNewWord('')
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-2xl space-y-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h3 className="text-base font-semibold text-white">Parámetros de Calificación de JEV</h3>

        <div className="space-y-4">
          <div className="space-y-3 rounded-lg border border-neutral-800/60 bg-neutral-950/40 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <label htmlFor="threshold" className="text-sm font-medium text-white">
                  Umbral de Confianza Humana
                </label>
                <p className="text-xs text-neutral-400">
                  Si JEV tiene una certeza menor al porcentaje, se envía a revisión manual.
                </p>
              </div>
              <span className="rounded border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-bold text-green-400">
                {draft.threshold}%
              </span>
            </div>
            <input
              id="threshold"
              type="range"
              min={50}
              max={95}
              step={5}
              value={draft.threshold}
              onChange={(e) => update({ threshold: Number(e.target.value) })}
              className="w-full accent-green-500"
            />
          </div>

          {TOGGLES.map((t) => (
            <div
              key={t.key}
              className="flex items-center justify-between gap-4 rounded-lg border border-neutral-800/60 bg-neutral-950/40 p-4"
            >
              <div>
                <p id={`${t.key}-label`} className="text-sm font-medium text-white">
                  {t.title}
                </p>
                <p className="text-xs text-neutral-400">{t.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={draft[t.key]}
                aria-labelledby={`${t.key}-label`}
                onClick={() => update({ [t.key]: !draft[t.key] })}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${draft[t.key] ? 'bg-green-500' : 'bg-neutral-700'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${draft[t.key] ? 'tranneutral-x-5' : ''}`}
                />
              </button>
            </div>
          ))}

          <div className="space-y-3 rounded-lg border border-neutral-800/60 bg-neutral-950/40 p-4">
            <div>
              <p className="text-sm font-medium text-white">Lista de palabras prohibidas</p>
              <p className="text-xs text-neutral-400">Términos que activan el filtro de promesas absolutas.</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {draft.bannedWords.map((word) => (
                <li
                  key={word}
                  className="flex items-center gap-1 rounded-md border border-rose-900/50 bg-rose-950/40 py-1 pr-1 pl-2.5 text-xs text-rose-300"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => update({ bannedWords: draft.bannedWords.filter((w) => w !== word) })}
                    className="rounded p-0.5 hover:bg-rose-900/50"
                    aria-label={`Quitar ${word}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <label htmlFor="new-word" className="sr-only">
                Nueva palabra prohibida
              </label>
              <input
                id="new-word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                    e.preventDefault()
                    addWord()
                  }
                }}
                placeholder="Añadir palabra o frase..."
                className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-green-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addWord}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onSave(draft)
              setSaved(true)
            }}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-green-400"
          >
            Guardar Cambios de Reglas
          </button>
          {saved && (
            <p role="status" className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Check className="h-4 w-4" aria-hidden="true" /> Reglas aplicadas y cola re-evaluada
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
