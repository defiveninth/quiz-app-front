import { useState } from 'react'
import urlCreator from '@/lib/url-creator'

const useMe = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [data, setData] = useState<Record<string, any>>({})

	const fetchMySelf = async (email: string, password: string) => {
		setIsLoading(true)
		setError('')

		try {
			const tokenResponse = await fetch('/api/auth/get-token', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!tokenResponse.ok) {
				throw new Error('Failed to fetch access token')
			}

			const { token } = await tokenResponse.json()
			
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
			console.log('Sign-in successful:', data)
		} catch (err: any) {
			setError(err.message)
			console.error('Sign-in error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		fetchMySelf,
	}
}

export default useMe