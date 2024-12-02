import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
	const PATH = request.nextUrl.pathname
	const AUTH = request.cookies.get('token')?.value

	if (PATH.startsWith('/auth') && AUTH) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	if ((PATH.startsWith('/dashboard') || PATH.startsWith('/quiz')) && !AUTH) {
		return NextResponse.redirect(new URL('/auth/sign-in', request.url))
	}

	return NextResponse.next()
}
