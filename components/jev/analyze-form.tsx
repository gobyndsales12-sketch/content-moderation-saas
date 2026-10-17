'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Platform } from '@/lib/jev-engine'

const TYPES: Record<Platform, string[]> = {
  Instagram: ['Carrusel', 'Reel Script', 'Historia'],
  LinkedIn: ['Artículo / Post', 'Encuesta'],
  Blog: ['Newsletter', 'Artículo'],
}

type AnalyzeFormProps = {
  onSubmit: (input: { platform: Platform; type: string; content: string }) => void
}

export function AnalyzeForm({ onSubmit }: AnalyzeFormProps) {
  const [platform, setPlatform] = useState<Platform>('Instagram')
  const [type, setType] = useState(TYPES.Instagram[0])
  const [content, setContent] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!content.trim()) return
    onSubmit({ platform, type, content: content.trim() })
    setContent('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-3 rounded-xl border border-green-500/20 bg-green-500/5 p-5"
      aria-labelledby="analyze-title"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-green-400" aria-hidden="true" />
        <h3 id="analyze-title" className="text-sm font-semibold text-white">
          Analizar nueva pieza con JEV
        </h3>
      </div>

      <label htmlFor="new-content" className="sr-only">
        Contenido a analizar
      </label>
      <textarea
        id="new-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Pega aquí el copy de tu publicación..."
        className="h-24 w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 p-3 font-mono text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-green-500 focus:outline-none"
      />

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="platform" className="sr-only">
          Plataforma
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => {
            const next = e.target.value as Platform
            setPlatform(next)
            setType(TYPES[next][0])
          }}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 focus:border-green-500 focus:outline-none"
        >
          {Object.keys(TYPES).map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label htmlFor="type" className="sr-only">
          Formato
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 focus:border-green-500 focus:outline-none"
        >
          {TYPES[platform].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!content.trim()}
          className="ml-auto rounded-lg bg-green-500 px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Evaluar contenido
        </button>
      </div>
    </form>
  )
}
