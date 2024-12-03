"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Loader, PlusCircle } from 'lucide-react'
import useCreateQuiz from '@/actions/quiz/create-quiz'

export function CreateQuizForm() {
	const [open, setOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	const { isLoading, error, success, createQuiz } = useCreateQuiz()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!title) {
			alert("Тақырыпты енгізу міндетті.")
			return
		}

		await createQuiz(title, description)

		setOpen(false)
		setTitle('')
		setDescription('')
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusCircle className="mr-2 h-4 w-4" /> Жаңа сабақ құру
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Жаңа сабақ құру</DialogTitle>
					<DialogDescription>
						Жаңа сабақ мәліметтерін толтырыңыз. Аяқтаған соң "Сақтау" батырмасын басыңыз.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col gap-3">
							<Label htmlFor="title" className="font-medium">
								Тақырып
							</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="col-span-3"
								required
							/>
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="description" className="font-medium">
								Сипаттама (Қосымша)
							</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="col-span-3"
							/>
						</div>
					</div>
					{error && <p className="text-red-500">{error}</p>}
					{success && <p className="text-green-500">Сабақ сәтті құрылды!</p>}
					<DialogFooter>
						<Button type="submit" disabled={isLoading} className='w-32'>
							{isLoading ? <Loader className='animate-spin' /> : <span>Құру</span>}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
