'use client'

import LoadingScreen from '@/components/loading-screen'
import { Button } from '@/components/ui/button'
import VMTable from '@/components/vm-table'
import useConfig from '@/hooks/use-config'
import useUserInfo from '@/hooks/use-user-info'
// // import { checkIsAdmin } from '@/lib/auth'
import { getConfig } from '@/lib/config'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
	const [mounted, setMounted] = useState(false)
	const { setConfig } = useConfig()
	const { userInfo, setUserInfo } = useUserInfo()

	
	useEffect(() => {
	

		async function loadConfig() {
			const fetchedConfig = await getConfig()
			setConfig(fetchedConfig)
		}

		loadConfig()
		checkLogin()
	}, [])

	return mounted ? (
		userInfo?.email ? (
			<VMTable />
		) : (
			<div className="flex h-full w-full items-center justify-center">
				<Button
					className="h-[40px] gap-[10px] border-1 border-[#747775] bg-white px-[12px] text-[#1F1F1F] hover:bg-white hover:shadow dark:border-[#E3E3E3] dark:bg-[#131314] dark:text-[#E3E3E3]"
					onClick={() => login()}
				>
					<Image
						alt="Google logo"
						height={20}
						src="/google-g.svg"
						width={20}
					/>
					<span>Sign in with Google</span>
				</Button>
			</div>
		)
	) : (
		<LoadingScreen />
	)
}
