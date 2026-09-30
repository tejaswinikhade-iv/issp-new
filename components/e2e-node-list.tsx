'use client'

import VMTable from './vm-table'

/** Backwards-compatible entry point. The E2E dashboard is now rendered by VMTable. */
export default function E2ENodeList() {
  return <VMTable />
}
