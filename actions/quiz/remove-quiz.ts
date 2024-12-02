import { useState } from 'react'
import urlCreator from '@/lib/url-creator'

const useRemoveQuiz = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')

	const removeQuizByIdAndAccessToken = async (quizId: string) => {
		setIsLoading(true)
		setError('')

		try {
			const tokenResponse = await fetch('/api/auth/get-token', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!tokenResponse.ok) {
				throw new Error('Failed to fetch access token')
			}

			const { token } = await tokenResponse.json()

			const response = await fetch(urlCreator('quiz'), {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ accessToken: token, quizId: quizId }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Failed to delete quiz')
			}

			return { success: true }
		} catch (err: any) {
			setError(err.message)
			return { success: false }
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		removeQuizByIdAndAccessToken,
	}
}

export default useRemoveQuiz
