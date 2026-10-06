'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
return (
<nav className="border-b bg-background">
<div className="flex items-center px-4 py-3">
<Link <Image
src="/issp.svg"
alt="ISSP Logo"
Infra Self-Service Portal
</span>
</Link>
</div>
</nav>
)
}