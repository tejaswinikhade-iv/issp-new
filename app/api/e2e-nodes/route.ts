import { NextResponse } from 'next/server'

const E2E_BASE = 'https://api.e2enetworks.com/myaccount/api/v1'
const LOCATIONS = ['Delhi', 'Mumbai'] // your E2E regions

async function fetchNodes(location: string, apiKey: string, authToken: string) {
	const nodes: any[] = []
	let page = 1
	let totalPages = 1

	do {
		const url = `${E2E_BASE}/nodes/?apikey=${apiKey}&location=${location}&page_no=${page}&per_page=100`
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${authToken}` },
			cache: 'no-store',
		})
		if (!res.ok) throw new Error(`E2E ${location}: HTTP ${res.status}`)

		const json = await res.json()
		for (const n of json.data ?? []) nodes.push({ ...n, location })
		totalPages = json.total_page_number ?? 1
		page++
	} while (page <= totalPages)

	return nodes
}

export async function GET() {
	const apiKey = process.env.E2E_API_KEY
	const authToken = process.env.E2E_AUTH_TOKEN
	if (!apiKey || !authToken)
		return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

	const results = await Promise.allSettled(
		LOCATIONS.map((loc) => fetchNodes(loc, apiKey, authToken)),
	)

	const nodes = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
	const errors = results
		.map((r, i) => (r.status === 'rejected' ? `${LOCATIONS[i]}: ${r.reason.message}` : null))
		.filter(Boolean)

	return NextResponse.json({ nodes, errors })
}