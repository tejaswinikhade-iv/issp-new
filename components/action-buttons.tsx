/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button'
import { LoaderIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Action = 'start' | 'stop' | 'reboot'

export default function E2EActionButtons({ instance }: { instance: any }) {
	const [pendingActions, setPendingActions] = useState<Set<string>>(new Set())

	// Adjust to match the fields your E2E node list returns
	const nodeId = instance.id
	const location = instance.location // e.g. "Delhi", "Mumbai"
	const displayName = instance.name || nodeId

	async function handleAction(action: Action) {
		setPendingActions((prev) => new Set(prev).add(action))

		try {
			if (!nodeId || !location)
				throw new Error('Node ID and location are required.')

			const response = await fetch('/api/e2e-action', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action, nodeId, location }),
			})

			const data = await response.json()
			if (!response.ok)
				throw new Error(
					data.error || `Request failed with status ${response.status}`,
				)

			toast.success(`Initiated ${action} for ${displayName}`, {
				description: 'Refetch to see changes',
			})
			return data
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: `Unexpected error during ${action} for ${displayName}`,
			)
		} finally {
			setPendingActions((prev) => {
				const next = new Set(prev)
				next.delete(action)
				return next
			})
		}
	}

	const buttons: { action: Action; Icon: any }[] = [
		{ action: 'start', Icon: PlayIcon },
		{ action: 'stop', Icon: PauseIcon },
		{ action: 'reboot', Icon: RotateCcwIcon },
	]

	return (
		<div className="inline-flex w-full items-center justify-end">
			{buttons.map(({ action, Icon }) => (
				<Button
					key={action}
					variant="ghost"
					size="icon"
					disabled={pendingActions.has(action)}
					onClick={() => handleAction(action)}
				>
					{pendingActions.has(action) ? (
						<LoaderIcon className="animate-spin" />
					) : (
						<Icon className="size-4" />
					)}
				</Button>
			))}
		</div>
	)
}