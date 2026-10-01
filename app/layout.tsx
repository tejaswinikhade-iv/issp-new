import Navbar from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ConfigContextProvider } from '@/hooks/use-config'
import { UserInfoContextProvider } from '@/hooks/use-user-info'
// import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'ISSP',
	description: 'Infra Self-Service Portal',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{/* <GoogleOAuthProvider clientId="81716575026-bm17q8jeuq8mlafbpokp87g8c06h22im.apps.googleusercontent.com"> */}
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<ConfigContextProvider>
							<UserInfoContextProvider>
								<Navbar />
								<main className="min-h-0 flex-1 overflow-y-auto"><div className="mx-auto max-w-7xl p-4 sm:p-6">
									{children}
									<Toaster richColors />
								</div></main>
							</UserInfoContextProvider>
						</ConfigContextProvider>
					</ThemeProvider>
				{/* </GoogleOAuthProvider> */}
			</body>
		</html>
	)
}
