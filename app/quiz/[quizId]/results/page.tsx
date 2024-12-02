'use client'

import useGetAttempt from '@/actions/attempt/get-atempt'
import Header from '@/components/header/student'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function QuizPage() {
	const { quizId }: { quizId: string } = useParams()
	const { error, isLoading, attemptData, getAttempt } = useGetAttempt()
	const [errorStatus, setErrorStatus] = useState<number | null>(null)
	const router = useRouter()

	useEffect(() => {
		const fetchAttempt = async () => {
			try {
				await getAttempt(quizId)
			} catch (err: any) {
				if (err?.response?.status === 404) {
					setErrorStatus(404)
				} else {
					console.error('An error occurred:', err)
				}
			}
		}

		fetchAttempt()
	}, [router, quizId])

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<Loader className="animate-spin" />
				<span className="ml-2">Loading Quiz...</span>
			</div>
		)
	}

	if (errorStatus === 404) {
		return (
			<div className="w-full min-h-screen flex flex-col justify-center items-center">
				<h1 className="text-2xl font-bold">Quiz Not Found</h1>
				<p className="text-gray-600">The quiz or attempt data you are looking for could not be found.</p>
				<Button onClick={() => router.push('/')}>Go Back Home</Button>
			</div>
		)
	}

	if (error) {
		return (
			<div className="w-full min-h-screen flex flex-col justify-center items-center">
				<h1 className="text-2xl font-bold">An Error Occurred</h1>
				<pre className="bg-gray-200 p-4 rounded">{error.toString()}</pre>
				<Button onClick={() => router.push('/')}>Go Back Home</Button>
			</div>
		)
	}

	return (
		<div className="w-full min-h-screen">
			<div className="container mx-auto px-5 pt-5">
				<Header />
				<Card className="shadow-none sm:px-10 max-w-screen-lg mx-auto border-0 pb-5 rounded-none border-b-2 border-black mt-10 dark:border-white">
					{attemptData ? (
						<div className="space-y-6">
							{/* Quiz Title and Description */}
							<div className="border-b pb-4">
								<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
									{attemptData.quiz.title}
								</h2>
								<p className="text-gray-700 dark:text-gray-300">
									{attemptData.quiz.description}
								</p>
							</div>

							{/* Summary Section */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
								{/* Total Questions */}
								<div className="p-4 rounded-md bg-blue-100 dark:bg-blue-900">
									<h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Сұрақтар саны</h3>
									<p className="text-2xl font-bold text-blue-900 dark:text-blue-50">
										{attemptData.quiz.questions.length}
									</p>
								</div>

								{/* Total Score */}
								<div className="p-4 rounded-md bg-green-100 dark:bg-green-900">
									<h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Жинаған балл</h3>
									<p className="text-2xl font-bold text-green-900 dark:text-green-50">
										{attemptData.score !== null ? attemptData.score : 0}
									</p>
								</div>

								{/* Percentage */}
								<div className="p-4 rounded-md bg-yellow-100 dark:bg-yellow-900">
									<h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Пайыз</h3>
									<p className="text-2xl font-bold text-yellow-900 dark:text-yellow-50">
										{attemptData.score !== null
											? ((attemptData.score / attemptData.quiz.questions.length) * 100).toFixed(2)
											: 0}
										%
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="text-gray-600">No data available</div>
					)}
				</Card>
			</div>
		</div>
	)
}
