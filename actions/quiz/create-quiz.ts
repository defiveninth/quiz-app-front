import { useState } from 'react'
import urlCreator from '@/lib/url-creator'
import { useRouter } from 'next/navigation'

const useCreateQuiz = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [success, setSuccess] = useState<boolean | null>(null)
	const router = useRouter()

	const createQuiz = async (title: string, description: string) => {
		setIsLoading(true)
		setError('')
		setSuccess(null)

		try {
			const tokenResponse = await fetch('/api/auth/get-token', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!tokenResponse.ok) {
				throw new Error('Failed to fetch access token')
			}

			const { token } = await tokenResponse.json()

			const response = await fetch(urlCreator('quiz/create'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					accessToken: token,
					title,
					description,
				}),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Failed to create quiz')
			}

			const result = await response.json()
			setSuccess(true)
			router.push(`/dashboard/edit/${result.quizId}`)
			return result

		} catch (err: any) {
			setError(err.message)
			setSuccess(false)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		success,
		createQuiz
	}
}

export default useCreateQuiz
