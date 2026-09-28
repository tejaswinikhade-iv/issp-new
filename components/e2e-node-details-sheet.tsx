/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { useState } from 'react'
import E2ETagEditForm from './e2e-tag-edit-form'

function Row({ label, value }: { label: string; value: any }) {
	return (
		<div className="flex justify-between gap-4 border-b py-2 text-sm">
			<span className="text-muted-foreground">{label}</span>
			<span className="text-right font-medium break-all">{value || '-'}</span>
		</div>
	)
}

export default function E2ENodeDetailsSheet({ instance }: { instance: any }) {
	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const name = instance.name || instance.id

	return (
		<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
			<SheetTrigger asChild>
				<Button className="px-0" variant="link">
					{name}
				</Button>
			</SheetTrigger>
			<SheetContent className="overflow-y-scroll px-4">
				<SheetHeader>
					<SheetTitle>{name}</SheetTitle>
					<SheetDescription>
						Node details and tags for this E2E instance.
					</SheetDescription>
				</SheetHeader>

				{/* Adjust field names to match your E2E node response */}
				<div className="mt-4">
					<Row label="Node ID" value={instance.id} />
					<Row label="Status" value={instance.status} />
					<Row label="Location" value={instance.location} />
					<Row label="Plan" value={instance.plan} />
					<Row label="Public IP" value={instance.public_ip_address} />
					<Row label="Private IP" value={instance.private_ip_address} />
					<Row label="Created" value={instance.created_at} />
				</div>

				<E2ETagEditForm
					instance={instance}
					setIsSheetOpen={setIsSheetOpen}
				/>
			</SheetContent>
		</Sheet>
	)
}