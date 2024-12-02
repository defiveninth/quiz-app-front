'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import signIn from '@/actions/auth/sign-in'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function SignInForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const router = useRouter()
	const { toast } = useToast()

	const { error, isLoading, signInWithCredentials, token, role } = signIn()

	useEffect(() => {
		if (token) {
			console.log('Token:', token)

			fetch('/api/auth/set-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ accessToken: token }),
			})
				.then((response) => {
					if (response.ok) {
						if (role === 'TEACHER') {
							router.push('/dashboard')
						} else if (role === 'STUDENT') {
							router.push('/')
						}
					} else {
						toast({
							title: "Қате",
							description: "Құпиясөз немесе логин дұрыс емес",
							variant: "destructive",
						})
					}
				})
				.catch(() => toast({
					title: "Қате",
					description: "Кіру барысында қате пайда болды",
					variant: "destructive",
				})
				)
		}
	}, [token, router, toast])

	useEffect(() => {
		if (error) {
			toast({
				title: "Қате",
				description: error,
				variant: "destructive",
			})
		}
	}, [error, toast])

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Кіру</CardTitle>
				<CardDescription>Аккаунтыңызға кіру үшін электронды пошта мен құпиясөзді енгізіңіз.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={(e) => {
					e.preventDefault()
					signInWithCredentials(email, password)
				}} id='signInForm'>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="email">Электронды пошта</Label>
							<Input id="email" type="email" placeholder="Электронды поштаңызды енгізіңіз" value={email} onChange={e => setEmail(e.target.value)} required />
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="password">Құпиясөз</Label>
							<Input id="password" type="password" placeholder="Құпиясөзді енгізіңіз" value={password} onChange={e => setPassword(e.target.value)} required />
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col">
				<Button className="w-full" form='signInForm' type='submit'>
					{isLoading ? <Loader className='animate-spin' /> : <span>Кіру</span>}
				</Button>
				<div className="mt-4 text-sm text-center space-y-2">
					{/* <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-500 hover:underline block">
						Құпиясөзді ұмыттыңыз ба?
					</Link> */}
					<div>
						Аккаунтыңыз жоқ па?{' '}
						<Link href="/auth/sign-up" className="text-blue-600 hover:text-blue-500 hover:underline">
							Тіркелу
						</Link>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}
