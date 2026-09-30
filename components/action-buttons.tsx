'use client'

import { Button } from '@/components/ui/button'
import { LoaderIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { E2ENode } from '@/lib/e2e-types'

type Action = 'start' | 'stop' | 'reboot'

export default function E2EActionButtons({ instance, onComplete }: { instance: E2ENode; onComplete?: () => void }) {
  const [pending, setPending] = useState<Action | null>(null)

  async function handleAction(action: Action) {
    if (!instance.id || !instance.location) {
      toast.error('Node ID and location are required.')
      return
    }

    setPending(action)
    try {
      const response = await fetch('/api/e2e-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, nodeId: instance.id, location: instance.location }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`)
      toast.success(`${action[0].toUpperCase() + action.slice(1)} requested`, { description: instance.name || instance.id })
      onComplete?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Unable to ${action} node`)
    } finally {
      setPending(null)
    }
  }

  const actions: { action: Action; Icon: typeof PlayIcon; label: string }[] = [
    { action: 'start', Icon: PlayIcon, label: 'Start' },
    { action: 'stop', Icon: PauseIcon, label: 'Stop' },
    { action: 'reboot', Icon: RotateCcwIcon, label: 'Reboot' },
  ]

  return (
    <div className="flex items-center justify-end gap-1">
      {actions.map(({ action, Icon, label }) => (
        <Button key={action} variant="ghost" size="icon" className="size-8" title={label} disabled={pending !== null} onClick={() => handleAction(action)}>
          {pending === action ? <LoaderIcon className="size-4 animate-spin" /> : <Icon className="size-4" />}
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  )
}
