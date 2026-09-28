/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Without login there are no per-user rules, so every action is allowed.
// Kept as a function so components can still call getPermissions(...) later
// if you add real authentication.
export function getPermissions(_node?: any, _userInfo?: any) {
	return { start: true, stop: true, reboot: true }
}

// Reads a tag from an E2E node. Supports tags shaped as
// [{ key, value }], [{ name, value }] or plain strings.
export function findTag(key: string, node: any, parseJSON: boolean = true) {
	const tag = (node?.tags ?? []).find(
		(t: any) => (typeof t === 'string' ? t : (t?.key ?? t?.name)) === key,
	)
	const value = typeof tag === 'string' ? '' : (tag?.value ?? '')

	if (!parseJSON) return value

	try {
		return JSON.parse(value || '{}')
	} catch {
		console.error(`Malformed JSON for tag "${key}":`, value)
		return {}
	}
}

// Normalises E2E status text so it matches the StateBadge values
export function normalizeState(status?: string) {
	const s = (status || '').toLowerCase()
	if (s === 'powered off' || s === 'power off' || s === 'stopped') return 'stopped'
	return s || 'unknown'
}

export function sortNodes(a: any, b: any, sortBy: string) {
	let valA: string | undefined
	let valB: string | undefined

	switch (sortBy) {
		case 'Name':
			valA = a.name
			valB = b.name
			break
		case 'Node ID':
			valA = String(a.id ?? '')
			valB = String(b.id ?? '')
			break
		case 'State':
			valA = normalizeState(a.status)
			valB = normalizeState(b.status)
			break
		case 'Public IP':
			valA = a.public_ip_address
			valB = b.public_ip_address
			break
		case 'Private IP':
			valA = a.private_ip_address
			valB = b.private_ip_address
			break
		case 'Plan':
			valA = a.plan
			valB = b.plan
			break
		case 'Location':
			valA = a.location
			valB = b.location
			break
		case 'Department':
			valA = findTag('iv:self-service:ownership', a)?.department
			valB = findTag('iv:self-service:ownership', b)?.department
			break
		case 'Project':
			valA = findTag('iv:self-service:ownership', a)?.project
			valB = findTag('iv:self-service:ownership', b)?.project
			break
		case 'Owner':
			valA = findTag('iv:self-service:ownership', a)?.owner
			valB = findTag('iv:self-service:ownership', b)?.owner
			break
		case 'Termination Date':
			valA = findTag('iv:self-service:schedule', a)?.terminationDate
			valB = findTag('iv:self-service:schedule', b)?.terminationDate
			break
	}

	// Missing values go last
	if (!valA && !valB) return String(a.id).localeCompare(String(b.id))
	if (!valA) return 1
	if (!valB) return -1

	if (valA === valB) return String(a.id).localeCompare(String(b.id))

	return String(valA).localeCompare(String(valB), undefined, { numeric: true })
}

export function formatDate(date: string | undefined) {
	if (!date) return null

	try {
		const parsedDate = new Date(date)
		if (isNaN(parsedDate.getTime())) return null

		return parsedDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	} catch {
		return null
	}
}

export function getName(email: string | null) {
	if (typeof email !== 'string' || !email.includes('@')) return ''

	const [localPart] = email.split('@')
	if (!localPart) return ''

	return localPart
		.split('.')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')
}

export function isMobile() {
	const MOBILE_BREAKPOINT = 768
	return window.innerWidth < MOBILE_BREAKPOINT
}

// Clears only this app's saved preferences (keys starting with "e2e")
export function resetPreferences() {
	Object.keys(localStorage)
		.filter((key) => key.startsWith('e2e'))
		.forEach((key) => localStorage.removeItem(key))

	window.location.reload()
}

export function validateCronExpression(cronString: string): boolean {
	if (typeof cronString !== 'string') {
		return false
	}

	if (!/^\S+( \S+){4}$/.test(cronString)) {
		return false
	}

	const parts = cronString.trim().split(' ')
	if (parts.length !== 5) {
		return false
	}

	const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

	if (dayOfMonth !== '*' && dayOfWeek !== '*') {
		return false
	}

	const limits = {
		minute: { min: 0, max: 59 },
		hour: { min: 0, max: 23 },
		dayOfMonth: { min: 1, max: 31 },
		month: { min: 1, max: 12 },
		dayOfWeek: { min: 0, max: 7 },
	}

	const names = {
		month: {
			JAN: 1,
			FEB: 2,
			MAR: 3,
			APR: 4,
			MAY: 5,
			JUN: 6,
			JUL: 7,
			AUG: 8,
			SEP: 9,
			OCT: 10,
			NOV: 11,
			DEC: 12,
		},
		dayOfWeek: { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 },
	}

	const validatePart = (
		expression: string,
		partLimits: { min: number; max: number },
		partNames: Record<string, number> | null = null,
	): boolean => {
		if (partNames) {
			const nameRegex = new RegExp(
				`\\b(${Object.keys(partNames).join('|')})\\b`,
				'gi',
			)
			expression = expression.replace(nameRegex, (match) =>
				String(partNames[match.toUpperCase()]),
			)
		}

		if (/[a-zA-Z]/.test(expression)) {
			return false
		}

		for (const item of expression.split(',')) {
			if (item === '') return false

			const stepParts = item.split('/')
			if (stepParts.length > 2) return false

			const rangePart = stepParts[0]
			const stepValue =
				stepParts.length === 2 ? parseInt(stepParts[1], 10) : null

			if (stepValue !== null && (isNaN(stepValue) || stepValue < 1)) {
				return false
			}

			if (rangePart === '*') {
				continue
			}

			const rangeParts = rangePart.split('-')
			if (rangeParts.length > 2) return false

			const start = parseInt(rangeParts[0], 10)
			const end =
				rangeParts.length === 2 ? parseInt(rangeParts[1], 10) : start

			if (
				isNaN(start) ||
				isNaN(end) ||
				start > end ||
				start < partLimits.min ||
				end > partLimits.max
			) {
				return false
			}
		}

		return true
	}

	return (
		validatePart(minute, limits.minute) &&
		validatePart(hour, limits.hour) &&
		validatePart(dayOfMonth, limits.dayOfMonth) &&
		validatePart(month, limits.month, names.month) &&
		validatePart(dayOfWeek, limits.dayOfWeek, names.dayOfWeek)
	)
}