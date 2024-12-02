import { useState } from 'react'
import urlCreator from '@/lib/url-creator'
import { useRouter } from 'next/navigation'

interface Quiz {
	id: string
	title: string
	description: string
	questions: { id: string; text: string }[]
}

interface Attempt {
	id: string
	studentId: string
	quizId: string
	score: number
	createdAt: string
	updatedAt: string
	quiz: Quiz
}

interface UseMyAttemptsReturn {
	isLoading: boolean
	error: string | null
	attempts: Attempt[]
	fetchAttemts: () => void
}

const useMyAttempts = (): UseMyAttemptsReturn => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [attempts, setAttempts] = useState<Attempt[]>([])
	const router = useRouter()

	const fetchAttemts = async () => {
		setIsLoading(true)
		setError(null)

		const tokenResponse = await fetch('/api/auth/get-token', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})

		if (tokenResponse.status === 401) {
			router.push('/api/auth/sign-out')
			return
		}

		if (!tokenResponse.ok) {
			throw new Error('Failed to fetch access token')
		}

		const { token } = await tokenResponse.json()

		try {
			const response = await fetch(urlCreator('attempt/get-mine'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ accessToken: token }),
			})

			const data: Attempt[] = await response.json()

			if (response.ok && data) {
				setAttempts(data)
			}
		} catch (err: any) {
			setError(err.message)
		} finally {
			setIsLoading(false)
		}
	}

	return { isLoading, error, attempts, fetchAttemts }
}

export default useMyAttempts
