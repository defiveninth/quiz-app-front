import { useEffect, useState } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import { ThemeSwitchButton } from '../theme/switch-button'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import urlCreator from '@/lib/url-creator'

export default function Header() {
	const [mobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [token, setToken] = useState(null)
	const [name, setName] = useState('')
	const [role, setRole] = useState<'STUDENT' | 'TEACHER' | null>(null)
	const router = useRouter()

	const getToken = async () => {
		try {
			const response = await fetch('/api/auth/get-token')
			if (!response.ok) throw new Error('Токен алу сәтсіз аяқталды')
			const data = await response.json()
			setToken(data.token)
		} catch (error) {
			console.error('Токенді алу қатесі:', error)
		}
	}

	const getInfo = async (accessToken: string) => {
		try {
			const res = await fetch(urlCreator('auth/get-info'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ accessToken }),
			})
			if (!res.ok) throw new Error('Пайдаланушы ақпаратын алу сәтсіз аяқталды')
			const data = await res.json()
			setRole(data.role)

			setName(`${data.firstname} ${data.surname}`)
		} catch (error) {
			console.error('Пайдаланушы ақпаратын алу қатесі:', error)
		}
	}

	useEffect(() => {
		getToken()
	}, [])

	useEffect(() => {
		if (role === 'TEACHER') {
			router.replace('/dashboard')
		}
	}, [role])

	useEffect(() => {
		if (token) {
			getInfo(token)
		}
	}, [token])

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<Link href="/" className="text-3xl font-bold">
					Сауалнама Тақтасы
				</Link>
				<Button onClick={() => setIsMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden">
					{mobileMenuOpen ? <X /> : <Menu />}
				</Button>
				<div className="flex items-center justify-between space-x-4 max-sm:hidden">
					<ThemeSwitchButton />
					<div className="flex items-center border-b-2 border-black rounded-lg">
						<span className="font-medium mx-2">{name}</span>
						<Button
							variant="default"
							onClick={() => router.push('/api/auth/sign-out')}
						>
							<LogOut />
						</Button>
					</div>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className="flex flex-col gap-3 mb-5 sm:hidden">
					<div className="flex justify-between items-center border-2 border-black rounded-lg">
						<span className="font-medium text-lg ml-5">{name}</span>
						<Button
							variant="default"
							onClick={() => router.push('/api/auth/sign-out')}
						>
							<LogOut />
						</Button>
					</div>
					<div className="flex justify-between items-center border-2 border-black rounded-lg">
						<span className="font-medium text-lg ml-5">Тақырыпты өзгерту</span>
						<ThemeSwitchButton />
					</div>
				</div>
			)}
		</>
	)
}
