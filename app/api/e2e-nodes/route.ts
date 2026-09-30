import { NextResponse } from 'next/server'

const E2E_BASE = 'https://api.e2enetworks.com/myaccount/api/v1'

function getLocations() {
  return (process.env.NEXT_PUBLIC_E2E_LOCATIONS || 'Delhi,Mumbai')
    .split(',')
    .map((location) => location.trim())
    .filter(Boolean)
}

async function fetchNodes(location: string, apiKey: string, authToken: string, projectId?: string) {
  const nodes: Record<string, unknown>[] = []
  let page = 1
  let totalPages = 1

  do {
    const params = new URLSearchParams({
      apikey: apiKey,
      location,
      page_no: String(page),
      per_page: '100',
    })

    if (projectId) params.set('project_id', projectId)

    const response = await fetch(`${E2E_BASE}/nodes/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const body = await response.json().catch(() => null)

    if (!response.ok) {
      const message =
        body && typeof body === 'object' && 'message' in body
          ? String((body as { message?: unknown }).message)
          : `HTTP ${response.status}`
      throw new Error(`E2E ${location}: ${message}`)
    }

    const pageNodes = Array.isArray(body?.data) ? body.data : []

    for (const node of pageNodes) {
      nodes.push({ ...(node as Record<string, unknown>), location })
    }

    totalPages = Number(body?.total_page_number || 1)
    page += 1
  } while (page <= totalPages)

  return nodes
}

export async function GET() {
  const apiKey = process.env.E2E_KEY || process.env.E2E_API_KEY
  const authToken = process.env.E2E_TOKEN || process.env.E2E_AUTH_TOKEN
  const projectId = process.env.E2E_PROJECT_ID

  if (!apiKey || !authToken) {
    return NextResponse.json(
      {
        error: 'E2E API credentials are not configured',
        nodes: [],
      },
      { status: 500 },
    )
  }

  const locations = getLocations()

  const results = await Promise.allSettled(
    locations.map((location) => fetchNodes(location, apiKey, authToken, projectId)),
  )

  const nodes = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : [],
  )

  const errors = results
    .map((result, index) =>
      result.status === 'rejected'
        ? `${locations[index]}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`
        : null,
    )
    .filter((value): value is string => Boolean(value))

  return NextResponse.json({
    nodes,
    errors,
    fetchedAt: new Date().toISOString(),
  })
}
