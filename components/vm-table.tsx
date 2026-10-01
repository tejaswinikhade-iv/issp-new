'use client'

import DashboardCards from './dashboard-cards'
import E2EActionButtons from './action-buttons'
import E2ENodeDetailsSheet from './e2e-node-details-sheet'
import { Button } from '@/components/ui/button'
import { LoaderIcon, RefreshCwIcon, SearchIcon, MapPinIcon, ServerIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { E2ENode } from '@/lib/e2e-types'
import { getNodeName, getOwner, getStatus, isRunning, isStopped } from '@/lib/e2e-types'

function StatusBadge({ status }: { status: string }) {
  const running = isRunning({ id: '', status })
  const stopped = isStopped({ id: '', status })
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${running ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : stopped ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
      <span className="size-1.5 rounded-full bg-current" />{status || 'Unknown'}
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
      const response = await fetch('/api/e2e-nodes', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || `Failed (${response.status})`)
      setNodes(Array.isArray(data.nodes) ? data.nodes : [])
      if (Array.isArray(data.errors) && data.errors.length) toast.warning('Some regions failed to load', { description: data.errors.join('\n') })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load E2E nodes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadNodes() }, [loadNodes])

  const locations = useMemo(() => Array.from(new Set(nodes.map((n) => n.location).filter(Boolean))).sort(), [nodes])
  const statuses = useMemo(() => Array.from(new Set(nodes.map((n) => getStatus(n)).filter(Boolean))).sort(), [nodes])

  const filteredNodes = useMemo(() => {
    const q = search.trim().toLowerCase()
    return nodes.filter((node) => {
      const matchesSearch = !q || [getNodeName(node), node.public_ip_address, node.private_ip_address, node.location, getOwner(node), node.plan]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(q))
      return matchesSearch && (location === 'all' || node.location === location) && (status === 'all' || getStatus(node) === status)
    })
  }, [nodes, search, location, status])

  const regionSummary = useMemo(() => locations.map((name) => {
    const regionNodes = nodes.filter((node) => node.location === name)
    const healthy = regionNodes.filter(isRunning).length
    return { name, total: regionNodes.length, healthy, percentage: regionNodes.length ? Math.round((healthy / regionNodes.length) * 100) : 0 }
  }), [locations, nodes])

  return (
    <div className="space-y-6 pb-8">
      
      <DashboardCards nodes={nodes} loading={loading} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          {/* <div className="mb-5 flex items-center justify-between">
            <div><h2 className="font-semibold">E2E Network</h2><p className="text-sm text-muted-foreground">Regional node health overview</p></div>
            <ServerIcon className="size-5 text-muted-foreground" />
          </div> */}
          <div className="space-y-5">
            {regionSummary.length === 0 ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No regional data available.</div> : regionSummary.map((region) => (
              <div key={region.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-medium"><MapPinIcon className="size-4 text-muted-foreground" />{region.name}</div>
                  <span className="text-muted-foreground">{region.healthy}/{region.total} healthy</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${region.percentage}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="font-semibold">Environment summary</h2>
          <p className="mt-1 text-sm text-muted-foreground">Current state of discovered nodes</p>
          <div className="mt-5 space-y-4">
            {[['Running', nodes.filter(isRunning).length], ['Stopped / down', nodes.filter(isStopped).length], ['Other', nodes.filter((n) => !isRunning(n) && !isStopped(n)).length]].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-lg bg-muted/50 p-3"><span className="text-sm">{label}</span><span className="font-semibold">{value}</span></div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 className="font-semibold">E2E Nodes</h2><p className="text-sm text-muted-foreground">{filteredNodes.length} of {nodes.length} nodes shown</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative"><SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><input className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64" placeholder="Search node, IP, owner..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
              <select className="h-9 rounded-md border bg-background px-3 text-sm" value={location} onChange={(e) => setLocation(e.target.value)}><option value="all">All locations</option>{locations.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              <select className="h-9 rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3">Node</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Network</th><th className="px-5 py-3">Plan / Owner</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody>
              {loading && nodes.length === 0 ? <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">Loading E2E nodes...</td></tr> : filteredNodes.length === 0 ? <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No nodes match the selected filters.</td></tr> : filteredNodes.map((node) => (
                <tr key={`${node.location}-${node.id}`} className="border-t transition-colors hover:bg-muted/30">
                  <td className="px-5 py-4"><E2ENodeDetailsSheet instance={node} /></td>
                  <td className="px-5 py-4"><StatusBadge status={getStatus(node)} /></td>
                  <td className="px-5 py-4">{node.location || '-'}</td>
                  <td className="px-5 py-4"><div className="space-y-1"><div className="font-medium">{node.public_ip_address || '-'}</div><div className="text-xs text-muted-foreground">Private: {node.private_ip_address || '-'}</div></div></td>
                  <td className="px-5 py-4"><div className="font-medium">{node.plan || '-'}</div><div className="text-xs text-muted-foreground">{getOwner(node) || 'No owner'}</div></td>
                  <td className="px-5 py-4"><E2EActionButtons instance={node} onComplete={loadNodes} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
