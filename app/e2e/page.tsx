'use client'

import { useEffect, useState } from 'react'

export default function E2EVMs() {
  const [vms, setVms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVMs = async () => {
      try {
        const response = await fetch('/api/e2e-describe', {
          method: 'POST',
        })

        const data = await response.json()

        setVms(data.nodes || data.results || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadVMs()
  }, [])

  if (loading) {
    return <div>Loading E2E VMs...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        E2E Cloud VMs
      </h1>

      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Public IP</th>
            <th className="border p-2">Private IP</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {vms.map((vm: any, index) => (
            <tr key={vm.id || index}>
              <td className="border p-2">
                {vm.name || vm.hostname}
              </td>
              <td className="border p-2">
                {vm.public_ip}
              </td>
              <td className="border p-2">
                {vm.private_ip}
              </td>
              <td className="border p-2">
                {vm.state}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
