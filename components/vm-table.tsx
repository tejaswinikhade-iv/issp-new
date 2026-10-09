'use client'

import E2EActionButtons from './action-buttons'
import E2ENodeDetailsSheet from './e2e-node-details-sheet'
import LoadingScreen from '@/components/loading-screen'
import { StateBadge, UserBadge } from '@/components/table-badges'

import { Button } from '@/components/ui/button'
import {
  RefreshCwIcon,
  SearchIcon,
  LoaderIcon,
  /////////////
  DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useConfig from '@/hooks/use-config'
import useUserInfo from '@/hooks/use-user-info'
import {
	findTag,
	formatDate,
	getPermissions,
	isMobile,
	sortInstances,
} from '@/lib/utils'
import {
	ArrowDownWideNarrowIcon,
	ChevronDownIcon,
	ColumnsIcon,
	FunnelIcon,
	GlobeIcon,
	RotateCwIcon,
  //////////
} from 'lucide-react'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { E2ENode } from '@/lib/e2e-types'
import {
  getNodeName,
  getOwner,
  getStatus,
  isRunning,
  isStopped,
} from '@/lib/e2e-types'

function StatusBadge({ status }: { status: string }) {
  const running = isRunning({ id: '', status })
  const stopped = isStopped({ id: '', status })

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
        running
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : stopped
          ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
          : 'border-zinc-600 bg-zinc-800 text-zinc-300'
      }`}
    >
      <span className="size-2 rounded-full bg-current" />
      {status || 'Unknown'}
    </span>
  )
}

export default function VMTable() {
  const [nodes, setNodes] = useState<E2ENode[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('all')
  const [status, setStatus] = useState('all')

  const loadNodes = useCallback(async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/e2e-nodes', {
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed (${response.status})`)
      }

      setNodes(Array.isArray(data.nodes) ? data.nodes : [])

      if (
        Array.isArray(data.errors) &&
        data.errors.length
      ) {
        toast.warning('Some regions failed to load', {
          description: data.errors.join('\n'),
        })
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to load nodes'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNodes()
  }, [loadNodes])

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          nodes
            .map((node) => node.location)
            .filter(Boolean)
        )
      ).sort(),
    [nodes]
  )

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          nodes
            .map((node) => getStatus(node))
            .filter(Boolean)
        )
      ).sort(),
    [nodes]
  )

  const filteredNodes = useMemo(() => {
    const q = search.trim().toLowerCase()

    return nodes.filter((node) => {
      const matchesSearch =
        !q ||
        [
          getNodeName(node),
          node.public_ip_address,
          node.private_ip_address,
          node.location,
          getOwner(node),
          node.plan,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(q)
          )

      const matchesLocation =
        location === 'all' ||
        node.location === location

      const matchesStatus =
        status === 'all' ||
        getStatus(node) === status

      return (
        matchesSearch &&
        matchesLocation &&
        matchesStatus
      )
    })
  }, [nodes, search, location, status])

  return (
    <div className="space-y-5">

      {/* Toolbar */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-wrap items-center gap-3">

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-10 rounded-md border border-zinc-700 bg-background px-3 text-sm"
          >
            <option value="all">All Regions</option>

            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={loadNodes}
            disabled={loading}
          >
            {loading ? (
              <LoaderIcon className="mr-2 size-4 animate-spin" />
            ) : (
              <RefreshCwIcon className="mr-2 size-4" />
            )}
            Refresh
          </Button>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search node, IP, owner..."
              className="h-10 w-64 rounded-md border border-zinc-700 bg-background pl-9 pr-3 text-sm outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-md border border-zinc-700 bg-background px-3 text-sm"
          >
            <option value="all">
              All States
            </option>

            {statuses.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-card">

        <table className="w-full text-sm">

          <thead className="bg-muted/20 text-left">

            <tr className="border-b border-zinc-800">

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                State
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Public IP
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Location
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Owner
              </th>

              <th className="px-5 py-4 text-right font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && nodes.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-muted-foreground"
                >
                  Loading E2E nodes...
                </td>
              </tr>
            )}

            {!loading &&
              filteredNodes.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-muted-foreground"
                  >
                    No nodes found
                  </td>
                </tr>
              )}

            {filteredNodes.map((node) => (
              <tr
                key={`${node.location}-${node.id}`}
                className="border-t border-zinc-800 hover:bg-muted/10"
              >
                <td className="px-5 py-4">
                  <E2ENodeDetailsSheet
                    instance={node}
                  />
                </td>

                <td className="px-5 py-4">
                  <StatusBadge
                    status={getStatus(node)}
                  />
                </td>

                <td className="px-5 py-4">
                  {node.public_ip_address || '-'}
                </td>

                <td className="px-5 py-4">
                  {node.location || '-'}
                </td>

                <td className="px-5 py-4">
                  <div>
                    <div className="font-semibold tracking-tight">
                      {getOwner(node) ||
                        'No Owner'}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {node.plan || '-'}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-right">
                  <E2EActionButtons
                    instance={node}
                    onComplete={loadNodes}
                  />
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}