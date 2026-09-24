import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const E2E_KEY = process.env.E2E_KEY
    const E2E_TOKEN = process.env.E2E_TOKEN
    const PROJECT_ID = process.env.E2E_PROJECT_ID

    const response = await fetch(
      `https://api.e2enetworks.com/myaccount/api/v1/nodes/?project_id=${PROJECT_ID}&location=Delhi&apikey=${E2E_KEY}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${E2E_TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('E2E VM Fetch Failed:', error)

    return NextResponse.json(
      { error: 'Failed to fetch E2E VMs' },
      { status: 500 }
    )
  }
}
