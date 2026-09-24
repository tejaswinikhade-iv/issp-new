import { NextResponse } from 'next/server'
import { getE2EInstances } from '@/lib/e2e'

export async function POST() {
  try {
    const data = await getE2EInstances()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch E2E VMs',
      },
      {
        status: 500,
      }
    )
  }
}