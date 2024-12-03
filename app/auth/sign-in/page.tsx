import Image from 'next/image'
import SignInForm from '@/components/auth/sign-in-form'

export default function SignInPage() {
	return (
		<div className="relative flex items-center justify-center min-h-screen bg-background">
			<Image
				src="/aidarov.jpg"
				alt="Background"
				fill
				className="object-cover"
				quality={100}
				priority
			/>
			<div className="relative z-10">
				<SignInForm />
			</div>
		</div>
	)
}

