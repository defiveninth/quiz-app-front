'use client'

import { useState } from 'react'
import urlCreator from '@/lib/url-creator'

const signUp = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [message, setMessage] = useState<string>('')

	const signUpWithEmail = async (email: string, role: string) => {
		setIsLoading(true)
		setError('')
		setMessage('')

		try {
			const response = await fetch(urlCreator('auth/create-account'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, role }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Something went wrong')
			}

			const data = await response.json()
			setMessage(data.message)
		} catch (err: any) {
			setError(err.message)
			console.error('Sign-up error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		signUpWithEmail,
		message
	}
}

export default signUp

