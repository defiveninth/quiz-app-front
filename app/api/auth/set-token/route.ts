import { cookies } from 'next/headers'

export async function POST(request: Request) {
	const { accessToken } = await request.json()

	if (!accessToken) {
		return new Response(JSON.stringify({
			message: 'error: undefined access token'
		}), {
			status: 400
		})
	}

	const cookieStore = await cookies()

	cookieStore.set('token', accessToken)

	return new Response(JSON.stringify({
		message: 'set access token successfully',
	}), {
		status: 200
	})
}