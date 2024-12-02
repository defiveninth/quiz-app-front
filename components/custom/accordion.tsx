import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

type AccordionProps = {
	className?: string
}

type QA = {
	id: number
	question: string
	answer: string
}

const mockQA: QA[] = [
	{
		id: 1,
		question: "What is TypeScript?",
		answer: "TypeScript is a superset of JavaScript that adds static typing to the language, making it more predictable and manageable."
	},
	{
		id: 2,
		question: "What is a closure in JavaScript?",
		answer: "A closure is a function that retains access to its lexical scope, even when the function is executed outside of that scope."
	},
	{
		id: 3,
		question: "What is the difference between `==` and `===` in JavaScript?",
		answer: "`==` compares values with type coercion, while `===` compares both values and types, without type coercion."
	},
	{
		id: 4,
		question: "What is React?",
		answer: "React is a JavaScript library for building user interfaces, particularly single-page applications with reusable UI components."
	},
	{
		id: 5,
		question: "What is a promise in JavaScript?",
		answer: "A promise is an object representing the eventual completion or failure of an asynchronous operation, and its resulting value."
	}
]

export default function MyAccordion({ className }: AccordionProps) {
	return (
		<Accordion type='multiple' className={className ?? ''}>
			{
				mockQA.map(qa => (
					<AccordionItem key={qa.id} value={qa.id.toString()}>
						<AccordionTrigger>
							{qa.question}
						</AccordionTrigger>
						<AccordionContent>
							{qa.answer}
						</AccordionContent>
					</AccordionItem>
				))
			}
		</Accordion>
	)
}
