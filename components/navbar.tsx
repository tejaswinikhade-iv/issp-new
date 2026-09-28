'use client'

import { Button } from '@/components/ui/button'
import { MenuIcon, ServerIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

// Add more pages here as you build them
const NAV_LINKS = [
	{ href: '/', label: 'Nodes' },
	// { href: '/volumes', label: 'Volumes' },
	// { href: '/reports', label: 'Reports' },
]

export default function Navbar() {
	const pathname = usePathname()
	const [mobileOpen, setMobileOpen] = useState(false)

	const isActive = (href: string) =>
		href === '/' ? pathname === '/' : pathname.startsWith(href)

	const linkClass = (href: string) =>
		`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
			isActive(href)
				? 'bg-muted text-foreground'
				: 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
		}`

	return (
		<header className="bg-background sticky top-0 z-50 w-full border-b">
			<nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
				{/* Brand */}
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<ServerIcon className="size-5" />
					<span>E2E Console</span>
				</Link>

				{/* Desktop links */}
				<div className="hidden items-center gap-1 md:flex">
					{NAV_LINKS.map((l) => (
						<Link key={l.href} href={l.href} className={linkClass(l.href)}>
							{l.label}
						</Link>
					))}
				</div>

				{/* Mobile toggle */}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					aria-label="Toggle menu"
					onClick={() => setMobileOpen((o) => !o)}
				>
					{mobileOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
				</Button>
			</nav>

			{/* Mobile menu */}
			{mobileOpen && (
				<div className="border-t px-4 py-2 md:hidden">
					<div className="flex flex-col gap-1">
						{NAV_LINKS.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								className={linkClass(l.href)}
								onClick={() => setMobileOpen(false)}
							>
								{l.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</header>
	)
}