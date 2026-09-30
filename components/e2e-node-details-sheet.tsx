'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import type { E2ENode } from '@/lib/e2e-types'
import { getNodeName, getOwner } from '@/lib/e2e-types'
import E2ETagEditForm from './e2e-tag-edit-form'

function Row({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 border-b py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-all text-right font-medium">{value === undefined || value === null || value === '' ? '-' : String(value)}</span>
    </div>
  )
}

export default function E2ENodeDetailsSheet({ instance }: { instance: E2ENode }) {
  const [open, setOpen] = useState(false)
  const name = getNodeName(instance)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-left font-semibold">{name}</Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>{name}</SheetTitle>
            <Badge variant="outline">{instance.status || 'Unknown'}</Badge>
          </div>
          <SheetDescription>Instance details and self-service metadata.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 rounded-xl border bg-card px-4">
          <Row label="Node ID" value={instance.id} />
          <Row label="Location" value={instance.location} />
          <Row label="Plan" value={instance.plan} />
          <Row label="Owner" value={getOwner(instance)} />
          <Row label="Public IP" value={instance.public_ip_address} />
          <Row label="Private IP" value={instance.private_ip_address} />
          <Row label="Created" value={instance.created_at} />
        </div>

        <div className="mt-6">
          <E2ETagEditForm instance={instance} setIsSheetOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
