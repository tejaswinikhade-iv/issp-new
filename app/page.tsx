'use client'

import LoadingScreen from '@/components/loading-screen'
import VMTable from '@/components/vm-table'
import useConfig from '@/hooks/use-config'
import { getConfig } from '@/lib/config'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { setConfig } = useConfig()

  useEffect(() => {
    let active = true

    async function initialize() {
      try {
        const config = await getConfig()
        if (active) setConfig(config)
      } catch (error) {
        console.error('Unable to load application configuration', error)
      } finally {
        if (active) setMounted(true)
      }
    }
    initialize()
    return () => { active = false }
  }, [setConfig])

  return mounted ? <VMTable /> : <LoadingScreen />
}