import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordForm() {
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Құпиясөзді ұмыттыңыз ба?</CardTitle>
				<CardDescription>Құпиясөзіңізді қалпына келтіру үшін электронды поштаңызды енгізіңіз.</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="email">Электронды пошта</Label>
							<Input id="email" type="email" placeholder="Электронды поштаңызды енгізіңіз" />
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col">
				<Button className="w-full">Құпиясөзді қалпына келтіру</Button>
				<div className="mt-4 text-sm text-center text-blue-600 hover:text-blue-500 hover:underline">
					Құпиясөзіңізді есіңізде сақтадыңыз ба?{' '}
					<Link href="/auth/sign-in" className="text-primary hover:underline">
						Кіру
					</Link>
				</div>
			</CardFooter>
		</Card>
	)
}
