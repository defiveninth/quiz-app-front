import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Question, Option } from '@/actions/question/get-questions-by-quiz-id'

interface QuizTakingFormProps {
	questions: Question[]
	onSubmit: (selectedOptions: Record<string, string[]>) => void
	isSubmitting: boolean
}

const QuizTakingForm: React.FC<QuizTakingFormProps> = ({ questions, onSubmit, isSubmitting }) => {
	const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})

	const handleOptionChange = (questionId: string, optionId: string, isMultiple: boolean) => {
		setSelectedOptions((prev) => {
			if (isMultiple) {
				const currentSelection = prev[questionId] || []
				if (currentSelection.includes(optionId)) {
					return { ...prev, [questionId]: currentSelection.filter((id) => id !== optionId) }
				} else {
					return { ...prev, [questionId]: [...currentSelection, optionId] }
				}
			} else {
				return { ...prev, [questionId]: [optionId] }
			}
		})
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(selectedOptions)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{questions.map((question, index) => (
				<div key={question.id} className="space-y-4">
					<h3 className="text-lg font-medium">
						{index + 1}. {question.text}
					</h3>
					{question.options.length > 1 ? (
						<div className="space-y-2">
							{question.options.map((option) => (
								<div key={option.id} className="flex items-center space-x-2">
									<Checkbox
										id={option.id}
										checked={(selectedOptions[question.id] || []).includes(option.id)}
										onCheckedChange={() => handleOptionChange(question.id, option.id, true)}
									/>
									<Label htmlFor={option.id}>{option.text}</Label>
								</div>
							))}
						</div>
					) : (
						<RadioGroup
							onValueChange={(value) => handleOptionChange(question.id, value, false)}
							value={selectedOptions[question.id]?.[0] || ''}
						>
							{question.options.map((option) => (
								<div key={option.id} className="flex items-center space-x-2">
									<RadioGroupItem value={option.id} id={option.id} />
									<Label htmlFor={option.id}>{option.text}</Label>
								</div>
							))}
						</RadioGroup>
					)}
				</div>
			))}
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'Submit Quiz'}
			</Button>
		</form>
	)
}

export default QuizTakingForm

