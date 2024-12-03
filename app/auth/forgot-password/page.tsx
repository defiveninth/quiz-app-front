import Image from 'next/image'
import ForgotPasswordForm from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
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
				<ForgotPasswordForm />
			</div>
		</div>
	)
}

