import { useState } from 'react'
import urlCreator from '@/lib/url-creator'
import { useRouter } from 'next/navigation'

type QuizType = {
	id: string
	title: string
	description: string
	teacherId: string
	createdAt: string
	updatedAt: string
}

const useGetMyQuizzes = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [quizzes, setQuizzes] = useState<QuizType[]>([])
	const router = useRouter()

	const getMyQuizzesByAccessToken = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const tokenResponse = await fetch('/api/auth/get-token', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!tokenResponse.ok) {
				throw new Error('Failed to fetch access token')
			}

			const { token } = await tokenResponse.json()

			const response = await fetch(urlCreator('quiz/mine'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ accessToken: token }),
			})

			if (response.status === 401 || tokenResponse.status === 401) {
				router.replace('/api/auth/sign-out')
			}

			if (response.status === 404) {
				setQuizzes([])
			}

			if (!response.ok && response.status !== 404) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Failed to fetch quizzes')
			}

			const data: QuizType[] = await response.json()
			setQuizzes(data)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		quizzes,
		getMyQuizzesByAccessToken,
	}
}

export default useGetMyQuizzes
