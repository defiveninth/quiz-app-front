import { cookies } from 'next/headers'

export async function GET(request: Request) {
	const cookieStore = await cookies()

	cookieStore.delete('token')

	return new Response(null, {
		status: 307,
		headers: {
			Location: '/auth/sign-in'
		}
	})
}