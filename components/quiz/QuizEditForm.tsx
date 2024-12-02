import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface QuizEditFormProps {
	initialTitle: string
	initialDescription: string
	isSaving: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	onSubmit: (e: React.FormEvent) => void
}

const QuizEditForm: React.FC<QuizEditFormProps> = ({ initialTitle, initialDescription, isSaving, onChange, onSubmit }) => {
	const [title, setTitle] = useState(initialTitle)
	const [description, setDescription] = useState(initialDescription)

	useEffect(() => {
		setTitle(initialTitle)
		setDescription(initialDescription)
	}, [initialTitle, initialDescription])

	return (
		<form onSubmit={onSubmit}>
			<CardContent className="space-y-4 px-0">
				<div className="space-y-2">
					<Label htmlFor="title">Сауалнама атауы</Label>
					<Input
						id="title"
						placeholder="Сауалнама атауын енгізіңіз"
						value={title}
						onChange={onChange}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="description">Сипаттама</Label>
					<Textarea
						id="description"
						placeholder="Сауалнама сипаттамасын енгізіңіз"
						rows={4}
						value={description}
						onChange={onChange}
					/>
				</div>
			</CardContent>
			<CardFooter className='px-0 flex gap-3 justify-end'>
				<Link href={'/dashboard'}>
					<Button type="button" variant={'outline'}>
						Артқа оралу
					</Button>
				</Link>
				<Button type="submit" disabled={isSaving} className='w-32'>
					{isSaving ? (
						<Loader className="animate-spin" />
					) : (
						'Өзгерістерді сақтау'
					)}
				</Button>
			</CardFooter>
		</form>
	)
}

export default QuizEditForm
