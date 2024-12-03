import React, { useState, useEffect } from 'react'
import { Question, Option } from '@/actions/question/get-questions-by-quiz-id'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'

interface QuestionManagerProps {
	quizId: string
	initialQuestions: Question[]
	onQuestionsChange: (questions: Question[]) => void
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ quizId, initialQuestions, onQuestionsChange }) => {
	const [questions, setQuestions] = useState<Question[]>(initialQuestions)

	useEffect(() => {
		setQuestions(initialQuestions)
	}, [initialQuestions])

	const handleQuestionChange = (index: number, field: keyof Question, value: string) => {
		const updatedQuestions = [...questions]
		updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
		setQuestions(updatedQuestions)
		onQuestionsChange(updatedQuestions)
	}

	const handleOptionChange = (questionIndex: number, optionIndex: number, field: keyof Option, value: string | boolean) => {
		const updatedQuestions = [...questions]
		const updatedOptions = [...updatedQuestions[questionIndex].options]
		updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value }
		updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options: updatedOptions }
		setQuestions(updatedQuestions)
		onQuestionsChange(updatedQuestions)
	}

	const addQuestion = () => {
		const newQuestion: Question = {
			id: `new-${Date.now()}`,
			text: '',
			quizId,
			options: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}
		setQuestions([...questions, newQuestion])
		onQuestionsChange([...questions, newQuestion])
	}

	const addOption = (questionIndex: number) => {
		const updatedQuestions = [...questions]
		const newOption: Option = {
			id: `new-${Date.now()}`,
			text: '',
			isCorrect: false,
			questionId: updatedQuestions[questionIndex].id,
		}
		updatedQuestions[questionIndex].options.push(newOption)
		setQuestions(updatedQuestions)
		onQuestionsChange(updatedQuestions)
	}

	const removeQuestion = (index: number) => {
		const updatedQuestions = questions.filter((_, i) => i !== index)
		setQuestions(updatedQuestions)
		onQuestionsChange(updatedQuestions)
	}

	const removeOption = (questionIndex: number, optionIndex: number) => {
		const updatedQuestions = [...questions]
		updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex)
		setQuestions(updatedQuestions)
		onQuestionsChange(updatedQuestions)
	}

	return (
		<div className="space-y-6">
			{questions.map((question, qIndex) => (
				<div key={question.id} className="p-4 border rounded-lg space-y-4">
					<div className="flex items-center justify-between">
						<Label htmlFor={`question-${qIndex}`} className="text-lg font-semibold">
							Сұрақ {qIndex + 1}
						</Label>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => removeQuestion(qIndex)}
							aria-label={`Remove question ${qIndex + 1}`}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
					<Input
						id={`question-${qIndex}`}
						value={question.text}
						onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
						placeholder="Enter question text"
					/>
					<div className="space-y-2">
						{question.options.map((option, oIndex) => (
							<div key={option.id} className="flex items-center space-x-2">
								<Checkbox
									id={`question-${qIndex}-option-${oIndex}-correct`}
									checked={option.isCorrect}
									onCheckedChange={(checked) => handleOptionChange(qIndex, oIndex, 'isCorrect', checked)}
								/>
								<Input
									id={`question-${qIndex}-option-${oIndex}-text`}
									value={option.text}
									onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
									placeholder="Enter option text"
									className="flex-grow"
								/>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => removeOption(qIndex, oIndex)}
									aria-label={`Remove option ${oIndex + 1} for question ${qIndex + 1}`}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
					<Button onClick={() => addOption(qIndex)} variant="outline" size="sm">
						Вариант қосу
					</Button>
				</div>
			))}
			<Button onClick={addQuestion} className="w-full">
				Сұрақ қосу
			</Button>
		</div>
	)
}

export default QuestionManager
