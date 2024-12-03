'use client'

import { ChevronLeft, Loader } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import useCreateAttempt from '@/actions/attempt/create-attempt'
import useGetQuizById from '@/actions/quiz/get-quiz'
import Header from '@/components/header/student'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import urlCreator from '@/lib/url-creator'

export default function QuizPage() {
	const { quizId }: { quizId: string } = useParams()
	const { error: getQuizError, isLoading: getQuizLoading, quiz, Lesson } = useGetQuizById(quizId)
	const { createAttempt, error: attemptError, isLoading: attemptLoading, attemptId } = useCreateAttempt()
	const router = useRouter()
	const [files, setFiles] = useState<string[]>([])

	const handleStartQuiz = async () => {
		await createAttempt(quizId)
	}

	useEffect(() => {
		if (attemptId && !attemptLoading) {
			router.push(`/quiz/${attemptId}/attempt`)
		}
	}, [attemptId, attemptLoading, router])

	useEffect(() => {
		if (Lesson) {
			fetch(urlCreator(`lesson/${Lesson.id}/files`))
				.then((response) => response.json())
				.then((data) => {
					setFiles(data.files || [])
				})
				.catch((error) => {
					console.error('Error fetching lesson files:', error)
				})
		}
	}, [Lesson])

	if (getQuizError) {
		router.push('/')
	}

	if (!quiz && !getQuizLoading) {
		return <div>No quiz found</div>
	}

	const convertToEmbedUrl = (url: string) => {
		const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+|(?:[^\/\n\s]+)?\?v=|(?:[^\/\n\s]+)?\/[^\/\n\s]+))([^?&\/\n\s]+)/)
		if (videoIdMatch) {
			const videoId = videoIdMatch[1]
			const params = url.split('/')[3]
			console.log(`https://www.youtube.com/embed/${videoId}${params}`)
			return `https://www.youtube.com/embed/${params}`
		}
		return url
	}

	return (
		<div className="w-full min-h-screen">
			<div className="container mx-auto px-5 pt-5">
				<Header />
				<Link href={'/'} className='mb-2 flex items-center gap-1'>
					<ChevronLeft />
					<span>артқа қайту</span>
				</Link>
				{
					Lesson && (
						<div className='flex flex-col gap-2 max-w-screen-lg mx-auto'>
							<h2 className='text-3xl font-bold mb-1'>Сабақтың тақырыбы: {Lesson.title}</h2>
							<p className='text-lg mb-4 ml-2'>{Lesson.description}</p>
							{files.length > 0 && (
								<div className="mb-4">
									<h3 className="text-xl font-bold mb-2">Сабақ Файлдары</h3>
									<ul className="list-disc pl-5">
										{files.map((file, index) => (
											<li key={index}>
												<a
													href={`https://abdu.myapi.kz${file}`}
													className="text-blue-500 hover:underline"
													download
												>
													Жүктеу: {file.split('/').pop()}
												</a>
											</li>
										))}
									</ul>
								</div>
							)}
							{
								Lesson.ytVideoUrl && <>
									<iframe className='w-full  aspect-video' src={convertToEmbedUrl(Lesson.ytVideoUrl)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
								</>
							}
						</div>
					)
				}
				<Card className='shadow-none sm:px-10 max-w-screen-lg mx-auto border-0 pb-5 rounded-none border-b-2 border-black mt-10 dark:border-white'>

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
									{attemptLoading ? <Loader className='animate-spin' /> : <span>Куизды Бастау</span>}
								</Button>
							</form>
						</>
					)}
				</Card>
			</div>
		</div>
	)
}
