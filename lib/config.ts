export interface Config {
	timezone: string
	locations: string[] // E2E regions, e.g. Delhi, Mumbai
	defaultLocation: string // 'all' or one of the locations
}

export const defaultConfig: Config = {
	timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Kolkata',
	locations: (process.env.NEXT_PUBLIC_E2E_LOCATIONS || 'Delhi,Mumbai')
		.split(',')
		.map((l) => l.trim())
		.filter(Boolean),
	defaultLocation: 'all',
}