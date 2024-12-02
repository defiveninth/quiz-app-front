export interface Option {
	id: string
	text: string
}

export interface Question {
	id: string
	text: string
	options: Option[]
}

export interface Quiz {
	id: string
	title: string
	description: string
	questions: Question[]
}

