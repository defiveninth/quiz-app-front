import urlCreator from '@/lib/url-creator'
import { useState } from 'react'

export type Option = {
	id: string
	text: string
	isCorrect: boolean
	questionId: string
}

export type Question = {
	id: string
	text: string
	quizId: string
	options: Option[]
	createdAt: string
	updatedAt: string
}

const getQuestionsByQuizId = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>('')
	const [questions, setQuestions] = useState<Question[]>()

	const fetchQuestions = async (quizId: string) => {
		setIsLoading(true)
		setError('')

		try {
			const response = await fetch(urlCreator(`questions/${quizId}`), {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Failed to fetch questions: ${response.statusText}`)
			}

			const data = await response.json()
			setQuestions(data.data)
			console.log('Questions fetched successfully:', questions)
		} catch (err: any) {
			setError(err.message || 'An unexpected error occurred')
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		questions,
		fetchQuestions,
	}
}

export default getQuestionsByQuizId