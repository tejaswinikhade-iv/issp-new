import { NextResponse } from 'next/server'

const E2E_BASE = 'https://api.e2enetworks.com/myaccount/api/v1'
const ALLOWED_LOCATIONS = ['Delhi', 'Mumbai']

// TODO: verify against E2E's API docs. The endpoint, method, and body shape
// for updating a node's tags are NOT confirmed. Change only this function.
async function saveTagsToE2E(
	nodeId: string,
	location: string,
	tags: { key: string; value: string }[],
	apiKey: string,
	authToken: string,
) {
	const url = `${E2E_BASE}/nodes/${nodeId}/tags/?apikey=${apiKey}&location=${location}` // placeholder
	return fetch(url, {
		method: 'PUT', // placeholder
		headers: {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ tags }), // placeholder
	})
}

export async function POST(req: Request) {
	const { nodeId, location, tags } = await req.json()

	if (!/^\d+$/.test(String(nodeId)))
		return NextResponse.json({ error: 'Invalid node ID' }, { status: 400 })
	if (!ALLOWED_LOCATIONS.includes(location))
		return NextResponse.json({ error: 'Invalid location' }, { status: 400 })
	if (
		!Array.isArray(tags) ||
		tags.length > 50 ||
		tags.some(
			(t) =>
				typeof t?.key !== 'string' ||
				typeof t?.value !== 'string' ||
				t.key.length > 128 ||
				t.value.length > 256,
		)
	)
		return NextResponse.json({ error: 'Invalid tags' }, { status: 400 })

	const apiKey = process.env.E2E_API_KEY
	const authToken = process.env.E2E_AUTH_TOKEN
	if (!apiKey || !authToken)
		return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

	const res = await saveTagsToE2E(String(nodeId), location, tags, apiKey, authToken)
	const data = await res.json().catch(() => ({}))

	if (!res.ok)
		return NextResponse.json(
			{ error: data.message || `E2E API error (${res.status})` },
			{ status: res.status },
		)

	console.log(`[e2e-tags] updated ${tags.length} tags on node ${nodeId} (${location})`)
	return NextResponse.json(data)
}