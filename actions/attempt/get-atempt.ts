import urlCreator from '@/lib/url-creator'
import { useState } from 'react'

interface Option {
	id: string
	text: string
	isCorrect: boolean
	questionId: string
}

interface Question {
	id: string
	text: string
	quizId: string
	options: Option[]
}

interface Quiz {
	id: string
	title: string
	description: string
	teacherId: string
	createdAt: string
	updatedAt: string
	questions: Question[]
}

export interface AttemptDataType {
	id: string
	studentId: string
	quizId: string
	score: number | null
	createdAt: string
	updatedAt: string
	quiz: Quiz
}

const useGetAttempt = () => {
	const [error, setError] = useState<string>('')
	const [attemptData, setAttemptData] = useState<AttemptDataType | null>(null)
	const [isLoading, setLoading] = useState<boolean>(false)

	const getAttempt = async (attemptId: string) => {
		setLoading(true)
		setError('')
		setAttemptData(null)

		try {
			const response = await fetch(urlCreator(`attempt/${attemptId}`), {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			if (!response.ok) {
				throw new Error(`Failed to fetch attempt. Status: ${response.status}`)
			}

			const data: AttemptDataType = await response.json()
			setAttemptData(data)
		} catch (error) {
			setError('Error fetching attempt')
		} finally {
			setLoading(false)
		}
	}

	return {
		error,
		attemptData,
		isLoading,
		getAttempt,
	}
}

export default useGetAttempt