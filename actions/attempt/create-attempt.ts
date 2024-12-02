import urlCreator from '@/lib/url-creator'
import { useState } from 'react'

const useCreateAttempt = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [attemptId, setAttemptId] = useState<string | null>(null)

	const createAttempt = async (quizId: string) => {
		setIsLoading(true)
		setError(null)
		setAttemptId(null)

		const tokenResponse = await fetch('/api/auth/get-token', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})

		if (!tokenResponse.ok) {
			throw new Error('Failed to fetch access token')
		}

		const { token } = await tokenResponse.json()

		fetch(urlCreator('attempt/create'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ accessToken: token, quizId }),
		}).then((response => response.json()))
			.then((data) => {
				setIsLoading(false)
				setAttemptId(data.id)
			}).catch((error) => {
				setError(error.message)
			})
	}

	return { isLoading, error, attemptId, createAttempt }
}

export default useCreateAttempt