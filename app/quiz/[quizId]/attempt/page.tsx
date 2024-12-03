'use client'

import useGetAttempt from '@/actions/attempt/get-atempt'
import Header from '@/components/header/student'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import urlCreator from '@/lib/url-creator'
import { Loader } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AttemptPage() {
	const { quizId }: { quizId: string } = useParams()
	const { error, isLoading, attemptData, getAttempt } = useGetAttempt()
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [answers, setAnswers] = useState<Record<string, string>>({})
	const router = useRouter()

	useEffect(() => {
		if (quizId) {
			getAttempt(quizId)
		}
	}, [quizId])

	const handleNextQuestion = () => {
		if (currentQuestionIndex < attemptData!.quiz.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1)
		}
	}

	const handlePreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1)
		}
	}

	const handleAnswerChange = (questionId: string, optionId: string) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: optionId,
		}))
	}

	const handleSubmitQuiz = async () => {
		const submissionData = {
			attemptId: quizId,
			answers: Object.keys(answers).map((questionId) => ({
				questionId,
				optionId: answers[questionId],
			}))
		}


		try {
			const response = await fetch(urlCreator('quiz/submit'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(submissionData),
			})

			if (response.ok) {
				const resultData = await response.json()
				router.push(`/quiz/${quizId}/results`)
			} else {
				console.error('Failed to submit the quiz')
			}
		} catch (error) {
			console.error('Error submitting the quiz:', error)
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<Loader className="animate-spin" />
				<span className="ml-2">Сұрақтар жүктелуде...</span>
			</div>
		)
	}

	if (error) {
		return <div>
			<span>Error: rendering page</span>
			<pre>{error.toString()}</pre>
		</div>
	}

	if (!attemptData || !attemptData.quiz.questions.length) {
		return <div>No quiz questions available</div>
	}

	const currentQuestion = attemptData.quiz.questions[currentQuestionIndex]

	return (
		<div className="w-full min-h-screen">
			<div className="container mx-auto px-5 pt-5">
				<Header />
				<Card className="shadow-none sm:px-10 max-w-screen-lg mx-auto border-0 pb-5 rounded-none border-b-2 border-black mt-10 dark:border-white">
					<h2 className="text-2xl font-bold mb-4">{attemptData.quiz.title}</h2>

					<h3 className="text-xl font-semibold mb-2">{currentQuestion.text}</h3>
					<div className="mt-4">
						{currentQuestion.options.map((option) => (
							<div key={option.id} className="mb-2">
								<label>
									<input
										type="radio"
										name={currentQuestion.id}
										checked={answers[currentQuestion.id] === option.id}
										onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
									/>
									{option.text}
								</label>
							</div>
						))}
					</div>

					<div className="flex justify-between mt-6">
						<Button
							disabled={currentQuestionIndex === 0}
							onClick={handlePreviousQuestion}
						>
							Артқа
						</Button>
						<Button
							disabled={currentQuestionIndex === attemptData.quiz.questions.length - 1}
							onClick={handleNextQuestion}
						>
							Келесі
						</Button>
					</div>

					<div className="flex justify-end mt-6">
						<Button onClick={handleSubmitQuiz}>Аяқтау</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}
