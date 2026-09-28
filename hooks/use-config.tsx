'use client'

import { defaultConfig, type Config } from '@/lib/config'
import { createContext, useContext, useState } from 'react'

interface ConfigProps {
	config: Config
	setConfig: React.Dispatch<React.SetStateAction<Config>>
}

const ConfigContext = createContext<ConfigProps>({
	config: defaultConfig,
	setConfig: () => {},
})

export function ConfigContextProvider({
	children,
	initialConfig,
}: {
	children: React.ReactNode
	initialConfig?: Partial<Config>
}) {
	const [config, setConfig] = useState<Config>({
		...defaultConfig,
		...initialConfig,
	})

	return (
		<ConfigContext.Provider value={{ config, setConfig }}>
			{children}
		</ConfigContext.Provider>
	)
}

export default function useConfig() {
	return useContext(ConfigContext)
}