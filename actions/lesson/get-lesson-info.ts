import urlCreator from '@/lib/url-creator'
import { useState } from 'react'

export default function useGetLessonInfo() {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [lessonData, setLessonData] = useState<any>(null)
	const [error, setError] = useState<boolean>(false)

	const fetchLessonData = async (lessonId: string) => {
		setIsLoading(true)
		setError(false)

		try {
			const response = await fetch(urlCreator(`lessons/${lessonId}`))
			if (!response.ok) {
				throw new Error(`Failed to fetch lesson. Status: ${response.status}`)
			}
			const data = await response.json()
			setLessonData(data)
		} catch (error) {
			setError(true)
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		lessonData,
		error,
		fetchLessonData
	} as const
}