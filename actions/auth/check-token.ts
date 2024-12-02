import { useState } from 'react'
import urlCreator from '@/lib/url-creator'
import { useRouter } from 'next/navigation'

const useCheckToken = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [success, setSuccess] = useState<boolean | null>(null)
	const router = useRouter()

	const checkToken = async (verifyToken: string) => {
		setIsLoading(true)
		setError('')
		setSuccess(null)

		try {
			const response = await fetch(urlCreator('auth/verify-token'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ verifyToken })
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
		} catch (err: any) {
			setError(err.message)
			console.error('check token error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		success,
		checkToken,
	}
}

export default useCheckToken