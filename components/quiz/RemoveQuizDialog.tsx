"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import useRemoveQuiz from '@/actions/quiz/remove-quiz'
import { Loader } from 'lucide-react'

interface RemoveQuizDialogProps {
	quizId: string
	quizTitle: string
	onQuizRemoved: () => void
}

export function RemoveQuizDialog({ quizId, quizTitle, onQuizRemoved }: RemoveQuizDialogProps) {
	const [open, setOpen] = useState(false)
	const { isLoading, error, removeQuizByIdAndAccessToken } = useRemoveQuiz()
	const { toast } = useToast()

	const handleRemoveQuiz = async () => {
		const result = await removeQuizByIdAndAccessToken(quizId)
		if (result.success) {
			toast({
				title: "Сәтті аяқталды",
				description: "Сауалнама сәтті жойылды.",
			})
			onQuizRemoved()
			setOpen(false)
		} else {
			toast({
				title: "Қате",
				description: error || "Сауалнаманы жою сәтсіз аяқталды. Қайталап көріңіз.",
				variant: "destructive",
			})
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size={'sm'}>Сауалнаманы жою</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Сауалнаманы жою</DialogTitle>
					<DialogDescription>
						Сіз "{quizTitle}" сауалнамасын жоюға сенімдісіз бе? Бұл әрекет қайтымсыз болады.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
						Бас тарту
					</Button>
					<Button variant="destructive" onClick={handleRemoveQuiz} disabled={isLoading} className='md:w-32 max-md:mb-4'>
						{isLoading ? <Loader className='animate-spin' /> : <span>Жою</span>}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
