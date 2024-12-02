import { useState, useCallback } from 'react'
import urlCreator from '@/lib/url-creator'

export type QuizType = {
	id: string
	title: string
	description: string
	teacherId: string
	createdAt: string
	updatedAt: string
}

const useGetAllQuizzes = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [quizzes, setQuizzes] = useState<QuizType[]>([])

	const fetchQuizzes = useCallback(() => {
		setIsLoading(true)
		setError('')

		fetch(urlCreator('quiz'))
			.then((res) => res.json())
			.then((data) => {
				setQuizzes(data)
				setIsLoading(false)
			})
			.catch((error) => {
				setError('Error fetching quizzes')
				setIsLoading(false)
			})
	}, [])

	return {
		isLoading,
		error,
		quizzes,
		fetchQuizzes,
	}
}

export default useGetAllQuizzes
