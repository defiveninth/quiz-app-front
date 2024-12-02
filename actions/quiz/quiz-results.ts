import urlCreator from '@/lib/url-creator'
import { useState, useEffect } from 'react'

const useQuizResults = (quizId: string) => {
	const [results, setResults] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')

	useEffect(() => {
		const fetchResults = async () => {
			setIsLoading(true)
			setError('')
			try {
				const response = await fetch(urlCreator('quiz/results'), {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ quizId }),
				})

				if (!response.ok) {
					throw new Error('Failed to fetch quiz results')
				}

				const data = await response.json()
				setResults(data.score)
			} catch (err) {
				setError('Error fetching results')
			} finally {
				setIsLoading(false)
			}
		}

		fetchResults()
	}, [quizId])

	return { results, isLoading, error }
}

export default useQuizResults
