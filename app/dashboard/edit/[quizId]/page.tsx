'use client'


import { useCallback, useEffect, useState } from 'react'
import Header from '@/components/header/teacher'
import QuizEditForm from '@/components/quiz/QuizEditForm'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Loader } from 'lucide-react'
import { redirect, useParams, useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import urlCreator from '@/lib/url-creator'

import useGetQuizById, { LessonType } from '@/actions/quiz/get-quiz'
import QuestionManager from '@/components/quiz/QuestionManager'
import { createQuestion, updateQuestion } from '@/actions/question/manage-questions'
import useEditQuiz from '@/actions/quiz/edit-quiz'
import useQuizResults from '@/actions/quiz/quiz-results'
import getQuestionsByQuizId, { Question } from '@/actions/question/get-questions-by-quiz-id'

export default function EditQuiz() {
	const { quizId }: { quizId: string } = useParams()
	const [file, setFile] = useState<any>(null)
	const { isLoading, error, quiz, Lesson } = useGetQuizById(quizId as string || '')
	const { isLoading: isLoadingQuestions, error: questionsError, questions: fetchedQuestions, fetchQuestions: fetchQuestionsBase } = getQuestionsByQuizId()

	const [isSaving, setIsSaving] = useState(false)
	const { toast } = useToast()

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [questions, setQuestions] = useState<Question[]>([])
	const [newLesson, setnewLesson] = useState<LessonType | null>(null)

	const router = useRouter()

	const { isSaving: isSavingUpdate, error: editError, success, editQuiz } = useEditQuiz()

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0]

		if (selectedFile) {
			if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
				alert('Only PowerPoint files (.pptx) are allowed!')
				setFile(null)
			} else {
				setFile(selectedFile as File)
				await handleSubmitFile(selectedFile)
			}
		} else {
			alert('Please select a file.')
		}
	}


	const handleSubmitFile = async (selectedFile: File) => {
		if (!selectedFile) {
			alert('Please provide a valid PowerPoint file.')
			return
		}

		const formData = new FormData()
		formData.append('file', selectedFile)
		formData.append('lessonId', Lesson?.id ?? '')

		try {
			const response = await fetch(urlCreator('lesson/add-file'), {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('File upload failed')
			}

			const result = await response.json()
			alert('File uploaded successfully')
			console.log(result)
		} catch (error) {
			alert('Error uploading file: ')
		}
	}


	const fetchQuestions = useCallback((id: string) => {
		fetchQuestionsBase(id)
	}, [fetchQuestionsBase])

	useEffect(() => {
		if (quiz) {
			setTitle(quiz.title)
			setDescription(quiz.description || '')
		}
	}, [quiz])

	useEffect(() => {
		if (fetchedQuestions) {
			setQuestions(fetchedQuestions)
		}
	}, [fetchedQuestions])

	useEffect(() => {
		if (Lesson) {
			setnewLesson(Lesson)
		}
	}, [Lesson])

	useEffect(() => {
		if (quizId) {
			fetchQuestions(quizId)
		}
	}, [quizId])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = e.target
		if (id === 'title') setTitle(value)
		if (id === 'description') setDescription(value)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		setIsSaving(true)
		await editQuiz({ quizId, title, description })
		setIsSaving(false)
	}

	const { results, isLoading: resultLoading, error: resultError } = useQuizResults(quizId)

	if (error) {
		redirect('/dashboard')
	}

	useEffect(() => {
		if (success) {
			toast({ title: 'Сауалнама сәтті жаңартылды', variant: 'default' })
		}
	}, [success, toast, router])

	const handleSaveQuestions = async () => {
		setIsSaving(true)
		try {
			for (const question of questions) {
				if (question.id.startsWith('new-')) {
					await createQuestion(quizId, question)
				} else {
					await updateQuestion(question.id, question)
				}
			}
			toast({ title: 'Сұрақтар сәтті сақталды', variant: 'default' })
		} catch (error) {
			toast({ title: 'Сұрақтарды сақтау сәтсіз аяқталды', variant: 'destructive' })
		} finally {
			setIsSaving(false)
		}
	}

	const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setnewLesson((prevLesson) => ({
			...(prevLesson || { title: '', description: '' }),
			[name]: value,
		}) as LessonType)
	}

	const handleLessonSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSaving(true)
		try {
			const response = await fetch(urlCreator('lesson/edit'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: newLesson?.id,
					title: newLesson?.title,
					description: newLesson?.description,
				}),
			})

			if (!response.ok) {
				throw new Error('Failed to update lesson')
			}

			toast({ title: 'Lesson updated successfully', variant: 'default' })
		} catch (error) {
			toast({ title: 'Failed to update lesson', variant: 'destructive' })
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className="w-full min-h-screen pb-10">
			<div className="container mx-auto px-5 pt-5">
				<Header />
				<Tabs defaultValue="quiz-info" className="mt-8 max-w-2xl mx-auto">
					<TabsList className="mb-4">
						<TabsTrigger value="quiz-info">Ақпаратын өңдеу</TabsTrigger>
						<TabsTrigger value="lesson">Сабақ</TabsTrigger>
						<TabsTrigger value="quiz-questions">Нәтижелер</TabsTrigger>
					</TabsList>

					<TabsContent value="quiz-questions">
						{resultLoading ? (
							<div className="flex items-center gap-2">
								<span className="text-lg font-medium">Loading quiz results...</span>
								<Loader className="animate-spin" />
							</div>
						) : error ? (
							<div className="text-red-500">{error}</div>
						) : results.length === 0 ? (
							<div>No results available for this quiz.</div>
						) : (
							<div>
								{results.map((result, index) => (
									<Card key={index} className="my-4 max-w-2xl mx-auto shadow-none border-0 rounded-none border-b-2 dark:border-white border-black">
										<CardHeader>
											<CardTitle>Result for {result.studentName}</CardTitle>
											<CardDescription>Email: {result.email}</CardDescription>
										</CardHeader>
										<div className="p-4">
											<p><strong>Score:</strong> {result.score} / {result.totalQuestions}</p>
											<p><strong>Submitted At:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
										</div>
									</Card>
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="lesson">
						<Card className="mt-8 max-w-2xl mx-auto shadow-none border-0 rounded-none border-b-2 dark:border-white border-black">
							<CardHeader className='px-0'>
								<CardTitle>Edit Lesson</CardTitle>
								<CardDescription>Update the lesson information associated with this quiz.</CardDescription>
							</CardHeader>
							<form onSubmit={handleLessonSubmit} className="space-y-4">
								<div>
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										name="title"
										value={newLesson?.title}
										onChange={handleLessonChange}
										placeholder="Enter lesson title"
									/>
								</div>
								<div>
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										name="description"
										value={newLesson?.description}
										onChange={handleLessonChange}
										placeholder="Enter lesson description"
									/>
								</div>
								<div>
									<Label htmlFor="file">File (PPTX)</Label>
									<Input
										type="file"
										accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"
										onChange={handleFileChange}
									/>
								</div>
								<a href="download:C:\\Users\\joncl\\Documents\\shadcn-learning\\back-end\\dist\\lesson-files\\cm47gtjlp0027kikz1enzevlt.pptx">122</a>
							</form>
						</Card>
					</TabsContent>

					<TabsContent value="quiz-info">
						<Card className="mt-8 max-w-2xl mx-auto shadow-none border-0 rounded-none border-b-2 dark:border-white border-black">
							<CardHeader className='px-0'>
								<CardTitle>Сауалнаманы өңдеу</CardTitle>
								<CardDescription>Сауалнаманың атауы мен сипаттамасын жаңартыңыз.</CardDescription>
							</CardHeader>

							{isLoading ? (
								<div className="flex gap-3">
									<span>Алғашқы мәліметтер жүктелуде...</span>
									<Loader className="animate-spin" />
								</div>
							) : (
								<QuizEditForm
									initialTitle={title}
									initialDescription={description}
									isSaving={isSavingUpdate}
									onChange={handleChange}
									onSubmit={handleSubmit}
								/>
							)}
						</Card>

						<Card className="mt-8 max-w-2xl mx-auto shadow-none border-0 rounded-none border-b-2 dark:border-white border-black">
							<CardHeader className='px-0'>
								<CardTitle>Сұрақтарды өңдеу</CardTitle>
								<CardDescription>Сұрақтарды қосу, өшіру және өңдеу:</CardDescription>
							</CardHeader>

							{isLoadingQuestions ? (
								<div className="flex gap-3">
									<span>Сұрақтар жүктелуде...</span>
									<Loader className="animate-spin" />
								</div>
							) : questionsError ? (
								<div className="text-red-500">Сұрақтарды жүктеу қатесі: {questionsError}</div>
							) : (
								<QuestionManager
									quizId={quizId}
									initialQuestions={questions}
									onQuestionsChange={(updatedQuestions) => setQuestions(updatedQuestions)}
								/>
							)}
							<Button onClick={handleSaveQuestions} disabled={isSaving} className="mt-4">
								{isSaving ? 'Сақталуда...' : 'Сұрақтарды сақтау'}
							</Button>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
