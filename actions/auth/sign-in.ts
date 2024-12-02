import { useState } from 'react'
import urlCreator from '@/lib/url-creator'

const signIn = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [token, setToken] = useState<string>('')
	const [role, setRole] = useState<'TEACHER' | 'STUDENT' | null>(null)

	const signInWithCredentials = async (email: string, password: string) => {
		setIsLoading(true)
		setError('')
		setToken('')

		try {
			const response = await fetch(urlCreator('auth/sign-in'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Something went wrong')
			}

			const data = await response.json()
			setToken(data.accessToken)
			setRole(data.role)
			console.log('Sign-in successful:', data)
		} catch (err: any) {
			setError(err.message)
			setToken('')
			console.error('Sign-in error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		token,
		signInWithCredentials,
		role
	}
}

export default signIn