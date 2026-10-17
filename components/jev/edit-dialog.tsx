'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { ContentItem } from '@/lib/jev-engine'

type EditDialogProps = {
  item: ContentItem
  onClose: () => void
  onSave: (id: number, content: string) => void
}

export function EditDialog({ item, onClose, onSave }: EditDialogProps) {
  const [content, setContent] = useState(item.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 id="edit-title" className="text-base font-bold text-white">
            Edición Rápida de Contenido (#{item.id})
          </h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <label htmlFor="edit-content" className="sr-only">
          Contenido
        </label>
        <textarea
          id="edit-content"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-32 w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 font-mono text-sm text-neutral-200 focus:border-green-500 focus:outline-none"
        />

        <p className="text-xs text-neutral-400">
          Corrige el texto para cumplir con las políticas y aprueba directamente. JEV re-evaluará las reglas.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!content.trim()}
            onClick={() => onSave(item.id, content.trim())}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
          >
            <Check className="h-4 w-4" aria-hidden="true" /> Guardar y Aprobar
          </button>
        </div>
      </div>
    </div>
  )
}
