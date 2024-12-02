import { useState } from 'react'
import urlCreator from '@/lib/url-creator'
import { useRouter } from 'next/navigation'

const useActivateAccount = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [success, setSuccess] = useState<boolean | null>(null)
	const router = useRouter()

	const activate = async (
		verifyToken: string,
		newPassword: string,
		firstName: string,
		surname: string
	) => {
		setIsLoading(true)
		setError('')
		setSuccess(null)

		try {
			const response = await fetch(urlCreator('auth/verify-account'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					verifyToken,
					newPassword,
					firstName,
					surname
				})
			})

			if (response.status === 404) {
				router.replace('/auth/sign-up')
				return
			}

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Something went wrong')
			}

			const data = await response.json()
			setSuccess(true)
			fetch('/api/auth/set-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ accessToken: data.accessToken }),
			})
			router.replace('/dashboard')
		} catch (err: any) {
			setError(err.message)
			console.error('activation error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		success,
		activate,
	}
}

export default useActivateAccount
