/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { LoaderIcon, RefreshCwIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import E2EActionButtons from './e2e-action-buttons' // the component from the previous step
import E2ENodeDetailsSheet from './e2e-node-details-sheet'

function StatusBadge({ status }: { status: string }) {
	const s = (status || '').toLowerCase()
	const color =
		s === 'running'
			? 'bg-green-100 text-green-800'
			: s === 'stopped' || s === 'powered off'
				? 'bg-red-100 text-red-800'
				: 'bg-yellow-100 text-yellow-800'
	return (
		<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
			{status || 'unknown'}
		</span>
	)
}

export default function E2ENodeList() {
	const [nodes, setNodes] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState('')

	const loadNodes = useCallback(async () => {
		setLoading(true)
		try {
			const res = await fetch('/api/e2e-nodes')
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || `Failed (${res.status})`)

			setNodes(data.nodes)
			if (data.errors?.length)
				toast.warning('Some regions failed to load', {
					description: data.errors.join('\n'),
				})
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Failed to load nodes')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadNodes()
	}, [loadNodes])

	const filtered = nodes.filter((n) =>
		[n.name, n.public_ip_address, n.private_ip_address, n.location]
			.filter(Boolean)
			.some((v) => String(v).toLowerCase().includes(search.toLowerCase())),
	)

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between gap-2">
				<input
					className="w-64 rounded-md border px-3 py-1.5 text-sm"
					placeholder="Search name, IP, location..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button variant="outline" size="sm" onClick={loadNodes} disabled={loading}>
					{loading ? (
						<LoaderIcon className="animate-spin" />
					) : (
						<RefreshCwIcon className="size-4" />
					)}
					<span className="ml-2">Refetch</span>
				</Button>
			</div>

			<div className="overflow-x-auto rounded-md border">
				<table className="w-full text-sm">
					<thead className="bg-muted/50 text-left">
						<tr>
							<th className="p-3">Name</th>
							<th className="p-3">Status</th>
							<th className="p-3">Location</th>
							<th className="p-3">Public IP</th>
							<th className="p-3">Private IP</th>
							<th className="p-3">Plan</th>
							<th className="p-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading && nodes.length === 0 ? (
							<tr>
								<td colSpan={7} className="p-6 text-center">
									Loading nodes...
								</td>
							</tr>
						) : filtered.length === 0 ? (
							<tr>
								<td colSpan={7} className="p-6 text-center">
									No nodes found
								</td>
							</tr>
						) : (
							filtered.map((n) => (
								<tr key={`${n.location}-${n.id}`} className="border-t">
									<td className="p-3 font-medium">
                                        <E2ENodeDetailsSheet instance={n} />
                                    </td>
									<td className="p-3">
										<StatusBadge status={n.status} />
									</td>
									<td className="p-3">{n.location}</td>
									<td className="p-3">{n.public_ip_address || '-'}</td>
									<td className="p-3">{n.private_ip_address || '-'}</td>
									<td className="p-3">{n.plan || '-'}</td>
									<td className="p-3">
										<E2EActionButtons instance={n} />
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}