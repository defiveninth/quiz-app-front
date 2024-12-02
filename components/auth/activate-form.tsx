'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import useCheckToken from '@/actions/auth/check-token'
import useActivateAccount from '@/actions/auth/activate-account'

export default function ActivateForm() {
	const [firstName, setFirstName] = useState<string>('')
	const [lastName, setLastName] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const { toast } = useToast()
	const { token }: { token: string } = useParams()
	const router = useRouter()

	const { error, isLoading, checkToken } = useCheckToken()
	const { activate, error: activatingError, isLoading: activatingLoading, success: activatingSuccess } = useActivateAccount()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!firstName || !lastName || !password || !token) {
			toast({ variant: 'destructive', title: 'Толтырылмаған өрістер', description: 'Барлық өрістерді толтырыңыз.' })
			return
		}

		try {
			await activate(token, password, firstName, lastName)
		} catch (err) {
			toast({ variant: 'destructive', title: 'Активтендіру сәтсіз аяқталды', description: activatingError || 'Бірдеңе дұрыс емес.' })
		}
	}

	useEffect(() => {
		if (!isLoading && token) {
			checkToken(token)
		}
	}, [token])

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Аккаунтты активтендіру</CardTitle>
				<CardDescription>Аккаунтыңызды активтендіру үшін форманы толтырыңыз</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} id="activateForm">
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="firstName">Аты</Label>
							<Input
								id="firstName"
								type="text"
								placeholder="Атыңызды енгізіңіз"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="lastName">Тегі</Label>
							<Input
								id="lastName"
								type="text"
								placeholder="Тегіңізді енгізіңіз"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="password">Жаңа құпиясөз</Label>
							<Input
								id="password"
								type="password"
								placeholder="Жаңа құпиясөзді енгізіңіз"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col">
				<Button
					className="w-full"
					form="activateForm"
					type="submit"
					disabled={activatingLoading || !firstName || !lastName || !password}
				>
					{activatingLoading ? <Loader className="animate-spin" /> : <span>Активтендіру</span>}
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
