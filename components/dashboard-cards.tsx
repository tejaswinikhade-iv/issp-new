// 'use client'

// import { Activity, AlertTriangle, CheckCircle2, Server, XCircle } from 'lucide-react'
// import type { E2ENode } from '@/lib/e2e-types'
// import { isRunning, isStopped } from '@/lib/e2e-types'

// interface DashboardCardsProps {
//   nodes: E2ENode[]
//   loading?: boolean
// }

// function Card({ title, value, description, icon: Icon }: { title: string; value: string | number; description: string; icon: React.ElementType }) {
//   return (
//     <div className="rounded-xl border bg-card p-5 shadow-sm">
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-medium text-muted-foreground">{title}</p>
//         <div className="rounded-lg bg-muted p-2"><Icon className="size-4" /></div>
//       </div>
//       <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
//       <p className="mt-1 text-xs text-muted-foreground">{description}</p>
//     </div>
//   )
// }

// export default function DashboardCards({ nodes, loading = false }: DashboardCardsProps) {
//   const running = nodes.filter(isRunning).length
//   const stopped = nodes.filter(isStopped).length
//   const other = Math.max(nodes.length - running - stopped, 0)
//   const locations = new Set(nodes.map((node) => node.location).filter(Boolean)).size

//   if (loading && nodes.length === 0) {
//     return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl border bg-muted/40" />)}</div>
//   }

//   return (
//     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//       <Card title="Total nodes" value={nodes.length} description={`${locations} active region${locations === 1 ? '' : 's'}`} icon={Server} />
//       <Card title="Running" value={running} description={`${nodes.length ? Math.round((running / nodes.length) * 100) : 0}% of discovered nodes`} icon={CheckCircle2} />
//       <Card title="Stopped / down" value={stopped} description="Nodes requiring attention" icon={XCircle} />
//       <Card title="Other states" value={other} description="Unknown, pending or transitional" icon={other ? AlertTriangle : Activity} />
//     </div>
//   )
// }
