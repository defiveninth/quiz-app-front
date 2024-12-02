import urlCreator from '@/lib/url-creator'
import { Question } from './get-questions-by-quiz-id'

export async function createQuestion(quizId: string, question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) {
	const response = await fetch(urlCreator(`questions`), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...question, quizId }),
	})

	if (!response.ok) {
		throw new Error(`Failed to create question: ${response.statusText}`)
	}

	return response.json()
}

export async function updateQuestion(questionId: string, question: Omit<Question, 'id' | 'quizId' | 'createdAt' | 'updatedAt'>) {
	const response = await fetch(urlCreator(`questions/${questionId}`), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(question),
	})

	if (!response.ok) {
		throw new Error(`Failed to update question: ${response.statusText}`)
	}

	return response.json()
}

export async function deleteQuestion(questionId: string) {
	const response = await fetch(urlCreator(`questions/${questionId}`), {
		method: 'DELETE',
	})

	if (!response.ok) {
		throw new Error(`Failed to delete question: ${response.statusText}`)
	}

	return response.json()
}

