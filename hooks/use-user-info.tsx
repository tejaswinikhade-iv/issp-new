'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface UserInfo {
	name: string
	email: string
	isAdmin: boolean
}

interface UserInfoProps {
	userInfo: UserInfo
	setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
}

const defaultUserInfo: UserInfo = {
	name: 'Operator',
	email: '',
	isAdmin: true, // no login, so everyone who opens the app is treated as admin
}

const UserInfoContext = createContext<UserInfoProps>({
	userInfo: defaultUserInfo,
	setUserInfo: () => {},
})

export function UserInfoContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo)

	// Restore a display name the user chose earlier (browser-only, not verified)
	useEffect(() => {
		const savedName = localStorage.getItem('e2eOperatorName')
		if (savedName) setUserInfo((prev) => ({ ...prev, name: savedName }))
	}, [])

	// Persist name changes
	useEffect(() => {
		localStorage.setItem('e2eOperatorName', userInfo.name)
	}, [userInfo.name])

	return (
		<UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
			{children}
		</UserInfoContext.Provider>
	)
}

export default function useUserInfo() {
	return useContext(UserInfoContext)
}