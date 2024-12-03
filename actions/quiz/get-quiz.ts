import urlCreator from '@/lib/url-creator'
import { useState, useEffect } from 'react'

type QuizType = {
	id: string
	title: string
	description: string
	teacherId: string
	createdAt: string
	updatedAt: string
}

export type LessonType = {
	id?: string
	title: string
	description: string
	quizId: string
	active: boolean
	createdAt: string
	updatedAt: string
	ytVideoUrl: string
}

interface UseGetQuizByIdResult {
	isLoading: boolean
	error: string | null
	quiz: QuizType | null,
	Lesson: LessonType | null
}

const useGetQuizById = (quizId: string): UseGetQuizByIdResult => {
	const [quiz, setQuiz] = useState<QuizType | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [Lesson, setLesson] = useState<LessonType | null>(null)

	useEffect(() => {
		if (!quizId) return

		const fetchQuiz = async () => {
			setIsLoading(true)
			setError(null)

			try {
				const response = await fetch(urlCreator(`quiz/${quizId}`))
				if (!response.ok) {
					throw new Error('Failed to fetch quiz data')
				}

				const data = await response.json()
				setQuiz(data)
				setLesson(data.Lesson)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchQuiz()
	}, [quizId])

	return { isLoading, error, quiz, Lesson } as const
}

export default useGetQuizById
