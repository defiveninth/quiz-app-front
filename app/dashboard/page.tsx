"use client"

import { useEffect, useState } from "react"
import useGetMyQuizzes from "@/actions/quiz/get-my-quizzes"
import useRemoveQuiz from "@/actions/quiz/remove-quiz"
import Header from "@/components/header/teacher"
import { RemoveQuizDialog } from '@/components/quiz/RemoveQuizDialog'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit, Loader, Search, Share2 } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
	const [searchTerm, setSearchTerm] = useState("")
	const [copied, setCopied] = useState<string | null>(null)
	const router = useRouter()

	const { isLoading, error, quizzes, getMyQuizzesByAccessToken } = useGetMyQuizzes()

	const { removeQuizByIdAndAccessToken, isLoading: isRemoving, error: removeError } = useRemoveQuiz()

	const filteredQuizzes = Array.isArray(quizzes)
		? quizzes.filter(
			(quiz) =>
				quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
		)
		: []

	useEffect(() => {
		getMyQuizzesByAccessToken()
	}, [])

	const handleCopyLink = (quizId: string) => {
		const quizLink = `http://localhost:3000/quiz/${quizId}`
		navigator.clipboard.writeText(quizLink)
			.then(() => {
				setCopied(quizId)
				setTimeout(() => setCopied(null), 2000)
			})
			.catch((err) => console.error("Сілтемені көшіру сәтсіз аяқталды: ", err))
	}

	if (error) {
		return <p className="text-center text-red-500 mt-10">Қате: {error}</p>
	}

	return (
		<div className="w-full min-h-screen">
			<div className="container mx-auto px-5 pt-5">
				<Header />

				<div className="relative mb-6">
					<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<Input
						type="text"
						placeholder="Сауалнамаларды іздеу..."
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				{isLoading ? (
					<Loader className="animate-spin mx-auto" />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredQuizzes.length > 0 ? (
							<>
								{filteredQuizzes.map((quiz) => (
									<Card key={quiz.id}>
										<CardHeader>
											<CardTitle>{quiz.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-gray-600">{quiz.description}</p>
										</CardContent>
										<CardFooter className="flex justify-end space-x-2">
											<Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/edit/${quiz.id}`)}>
												<Edit className="mr-0 h-4 w-4" /> Өңдеу
											</Button>
											<Button variant="outline" size="sm" onClick={() => handleCopyLink(quiz.id)}>
												<Share2 className="mr-0 h-4 w-4" /> {copied === quiz.id ? "Көшірілді!" : "Бөлісу"}
											</Button>
											<RemoveQuizDialog
												quizId={quiz.id}
												quizTitle={quiz.title}
												onQuizRemoved={getMyQuizzesByAccessToken}
											/>
										</CardFooter>
									</Card>
								))}
							</>
						) : (
							<>
								<p className="text-center text-gray-600 mt-10">Сауалнамалар табылмады.</p>
							</>
						)}
					</div>
				)}

				{removeError && <p className="text-center text-red-500 mt-4">Қате: {removeError}</p>}
			</div>
		</div>
	)
}
