import urlCreator from '@/lib/url-creator'
import { useState } from 'react'

interface EditQuizPayload {
	quizId: string
	title: string
	description?: string
}

interface UseEditQuizResult {
	isSaving: boolean
	error: string | null
	success: boolean
	editQuiz: (payload: EditQuizPayload) => void
}

const useEditQuiz = (): UseEditQuizResult => {
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<boolean>(false)

	const editQuiz = async ({ quizId, title, description }: EditQuizPayload) => {
		setIsSaving(true)
		setError(null)
		setSuccess(false)

		try {
			const tokenResponse = await fetch('/api/auth/get-token', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!tokenResponse.ok) {
				throw new Error('Failed to fetch access token')
			}

			const { token } = await tokenResponse.json()

			const response = await fetch(urlCreator(`quiz/${quizId}`), {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, description, accessToken: token }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Failed to update quiz')
			}

			const result = await response.json()
			setSuccess(true)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setIsSaving(false)
		}
	}

	return { isSaving, error, success, editQuiz }
}

export default useEditQuiz
