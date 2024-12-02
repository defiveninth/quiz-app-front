'use client'

import { ChevronLeft, Loader } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import useCreateAttempt from '@/actions/attempt/create-attempt'
import useGetQuizById from '@/actions/quiz/get-quiz'
import Header from '@/components/header/student'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEffect } from 'react'
import Link from 'next/link'

export default function QuizPage() {
	const { quizId }: { quizId: string } = useParams()
	const { error: getQuizError, isLoading: getQuizLoading, quiz } = useGetQuizById(quizId)
	const { createAttempt, error: attemptError, isLoading: attemptLoading, attemptId } = useCreateAttempt()
	const router = useRouter()

	const handleStartQuiz = async () => {
		await createAttempt(quizId)
	}

	useEffect(() => {
		if (attemptId && !attemptLoading) {
			router.push(`/quiz/${attemptId}/attempt`)
		}
	}, [attemptId, attemptLoading, router])

	if (getQuizError) {
		router.push('/')
	}

	if (!quiz && !getQuizLoading) {
		return <div>No quiz found</div>
	}

	return (
		<div className="w-full min-h-screen">
			<div className="container mx-auto px-5 pt-5">
				<Header />
				<Card className='shadow-none sm:px-10 max-w-screen-lg mx-auto border-0 pb-5 rounded-none border-b-2 border-black mt-10 dark:border-white'>
					<Link href={'/'} className='mb-2 flex items-center gap-1'>
						<ChevronLeft />
						<span>артқа қайту</span>
					</Link>
					{getQuizLoading ? <div className='flex items-center gap-2'>
						<span className='text-lg font-medium'>Жүктелуде...</span>
						<Loader className='animate-spin' />
					</div> : (
						<>
							<h2 className='text-3xl font-bold mb-1'>Тақырып:</h2>
							<h2 className='text-2xl font-bold mb-4 ml-2'>{quiz!.title}</h2>

							{quiz!.description && <p className='text-lg mb-4 ml-2'>{quiz!.description}</p>}

							<form className='flex justify-end' onSubmit={(e) => {
								e.preventDefault()
								handleStartQuiz()
							}}>
								<Button className='px-2'>
									{attemptLoading ? <Loader className='animate-spin' /> : <span>Сұрақтарға жауап беру</span>}
								</Button>
							</form>
						</>
					)}
				</Card>
			</div>
		</div>
	)
}
