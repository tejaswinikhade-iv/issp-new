/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from '@tanstack/react-table'
import {
	ArrowUpDownIcon,
	LoaderIcon,
	RefreshCwIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import E2EActionButtons from './action-buttons'
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

// Reads a JSON-valued tag from an E2E node; adjust if your tag shape differs
function readTag(node: any, key: string) {
	const tag = (node.tags ?? []).find((t: any) => (t.key ?? t.name) === key)
	if (!tag?.value) return undefined
	try {
		return JSON.parse(tag.value)
	} catch {
		return undefined
	}
}

function SortHeader({ column, label }: { column: any; label: string }) {
	return (
		<Button
			variant="ghost"
			className="-ml-3 h-8"
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
		>
			{label}
			<ArrowUpDownIcon className="ml-2 size-3.5" />
		</Button>
	)
}

export default function VMTable() {
	const [nodes, setNodes] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [sorting, setSorting] = useState<SortingState>([])
	const [globalFilter, setGlobalFilter] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [locationFilter, setLocationFilter] = useState('all')

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

	const locations = useMemo(
		() => Array.from(new Set(nodes.map((n) => n.location))).sort(),
		[nodes],
	)
	const statuses = useMemo(
		() => Array.from(new Set(nodes.map((n) => n.status).filter(Boolean))).sort(),
		[nodes],
	)

	const data = useMemo(
		() =>
			nodes.filter(
				(n) =>
					(statusFilter === 'all' || n.status === statusFilter) &&
					(locationFilter === 'all' || n.location === locationFilter),
			),
		[nodes, statusFilter, locationFilter],
	)

	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				accessorKey: 'name',
				header: ({ column }) => <SortHeader column={column} label="Name" />,
				cell: ({ row }) => <E2ENodeDetailsSheet instance={row.original} />,
			},
			{
				accessorKey: 'status',
				header: ({ column }) => <SortHeader column={column} label="Status" />,
				cell: ({ row }) => <StatusBadge status={row.original.status} />,
			},
			{
				accessorKey: 'location',
				header: ({ column }) => <SortHeader column={column} label="Location" />,
			},
			{
				accessorKey: 'public_ip_address',
				header: 'Public IP',
				cell: ({ getValue }) => (getValue() as string) || '-',
			},
			{
				accessorKey: 'private_ip_address',
				header: 'Private IP',
				cell: ({ getValue }) => (getValue() as string) || '-',
			},
			{
				accessorKey: 'plan',
				header: 'Plan',
				cell: ({ getValue }) => (getValue() as string) || '-',
			},
			{
				id: 'owner',
				header: 'Owner',
				accessorFn: (row) =>
					readTag(row, 'iv:self-service:ownership')?.owner ?? '',
				cell: ({ getValue }) => (getValue() as string) || '-',
			},
			{
				id: 'actions',
				header: () => <div className="text-right">Actions</div>,
				enableSorting: false,
				cell: ({ row }) => <E2EActionButtons instance={row.original} />,
			},
		],
		[],
	)

	const table = useReactTable({
		data,
		columns,
		state: { sorting, globalFilter },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 15 } },
	})

	const selectClass = 'rounded-md border bg-background px-2 py-1.5 text-sm'

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<input
						className="w-64 rounded-md border px-3 py-1.5 text-sm"
						placeholder="Search name, IP, owner..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>
					<select
						className={selectClass}
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<option value="all">All statuses</option>
						{statuses.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
					<select
						className={selectClass}
						value={locationFilter}
						onChange={(e) => setLocationFilter(e.target.value)}
					>
						<option value="all">All locations</option>
						{locations.map((l) => (
							<option key={l} value={l}>
								{l}
							</option>
						))}
					</select>
				</div>
				<Button variant="outline" size="sm" onClick={loadNodes} disabled={loading}>
					{loading ? (
						<LoaderIcon className="animate-spin" />
					) : (
						<RefreshCwIcon className="size-4" />
					)}
					<span className="ml-2">Refetch</span>
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((hg) => (
							<TableRow key={hg.id}>
								{hg.headers.map((h) => (
									<TableHead key={h.id}>
										{h.isPlaceholder
											? null
											: flexRender(h.column.columnDef.header, h.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading && nodes.length === 0 ? (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Loading nodes...
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No nodes found
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow key={`${row.original.location}-${row.original.id}`}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">
					{table.getFilteredRowModel().rows.length} node(s)
				</span>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<span>
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{Math.max(table.getPageCount(), 1)}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}