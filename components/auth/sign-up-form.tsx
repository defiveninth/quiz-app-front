'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from 'react'
import signUp from '@/actions/auth/sign-up'
import { Loader } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SignUpForm() {
	const [email, setEmail] = useState<string>('')
	const [role, setRole] = useState<string>('')
	const { isLoading, signUpWithEmail, message, error } = signUp()
	const { toast } = useToast()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await signUpWithEmail(email, role)
	}

	useEffect(() => {
		if (message && !isLoading && !error) {
			toast({
				title: "Сәтті",
				description: message,
			})
		} else {
			if (error) {
				toast({
					title: "Қате",
					description: error,
					variant: "destructive",
				})
			}
		}
	}, [message, error, isLoading])

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Тіркелу</CardTitle>
				<CardDescription>Жаңа аккаунт құрып бастау үшін.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} id='signUpForm'>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="email">Электронды пошта</Label>
							<Input
								id="email"
								type="email"
								placeholder="Электронды поштаңызды енгізіңіз"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="role">Рөл</Label>
							<Select value={role} onValueChange={setRole} required>
								<SelectTrigger id="role">
									<SelectValue placeholder="Рөліңізді таңдаңыз" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="TEACHER">Мұғалім</SelectItem>
									<SelectItem value="STUDENT">Студент</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col">
				<Button className="w-full" form='signUpForm' type="submit" disabled={isLoading || !email || !role}>
					{isLoading ? <Loader className='animate-spin' /> : <span>Тіркелу</span>}
				</Button>
				<div className="mt-4 text-sm text-center">
					Аккаунтыңыз бар ма?{' '}
					<Link href="/auth/sign-in" className="text-blue-600 hover:text-blue-500 hover:underline">
						Кіру
					</Link>
				</div>
			</CardFooter>
		</Card>
	)
}
