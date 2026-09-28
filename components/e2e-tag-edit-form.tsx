/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { LoaderIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Tag = { key: string; value: string }

export default function E2ETagEditForm({
	instance,
	setIsSheetOpen,
}: {
	instance: any
	setIsSheetOpen: (open: boolean) => void
}) {
	// Assumes tags arrive as [{ key, value }] or an array of strings; adjust to your response
	const initial: Tag[] = (instance.tags ?? []).map((t: any) =>
		typeof t === 'string' ? { key: t, value: '' } : { key: t.key ?? t.name, value: t.value ?? '' },
	)

	const [tags, setTags] = useState<Tag[]>(initial)
	const [saving, setSaving] = useState(false)

	const update = (i: number, field: keyof Tag, val: string) =>
		setTags((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: val } : t)))

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const cleaned = tags.filter((t) => t.key.trim())

		if (new Set(cleaned.map((t) => t.key.trim())).size !== cleaned.length)
			return toast.error('Duplicate tag keys are not allowed.')

		setSaving(true)
		try {
			const res = await fetch('/api/e2e-tags', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nodeId: instance.id,
					location: instance.location,
					tags: cleaned,
				}),
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || `Failed (${res.status})`)

			toast.success(`Tags updated for ${instance.name || instance.id}`, {
				description: 'Refetch to see changes',
			})
			setIsSheetOpen(false)
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to update tags')
		} finally {
			setSaving(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mt-6 space-y-3">
			<h3 className="text-sm font-semibold">Tags</h3>

			{tags.map((t, i) => (
				<div key={i} className="flex items-center gap-2">
					<input
						className="w-1/2 rounded-md border px-2 py-1.5 text-sm"
						placeholder="Key"
						value={t.key}
						onChange={(e) => update(i, 'key', e.target.value)}
					/>
					<input
						className="w-1/2 rounded-md border px-2 py-1.5 text-sm"
						placeholder="Value"
						value={t.value}
						onChange={(e) => update(i, 'value', e.target.value)}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
					>
						<Trash2Icon className="size-4" />
					</Button>
				</div>
			))}

			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => setTags((prev) => [...prev, { key: '', value: '' }])}
			>
				<PlusIcon className="mr-1 size-4" /> Add tag
			</Button>

			<div className="flex items-center gap-4 pt-2">
				<Button
					type="button"
					variant="outline"
					className="grow"
					onClick={() => setTags(initial)}
					disabled={saving}
				>
					Discard
				</Button>
				<Button type="submit" className="grow" disabled={saving}>
					{saving ? <LoaderIcon className="animate-spin" /> : 'Save'}
				</Button>
			</div>
		</form>
	)
}