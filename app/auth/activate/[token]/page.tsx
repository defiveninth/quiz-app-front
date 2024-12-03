import ActivateForm from '@/components/auth/activate-form'
import Image from 'next/image'

export default function VerifyPage() {
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
				<ActivateForm />
			</div>
		</div>
	)
}
