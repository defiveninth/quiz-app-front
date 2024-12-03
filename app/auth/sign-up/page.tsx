import Image from 'next/image'
import SignUpForm from '@/components/auth/sign-up-form'

export default function SignUpPage() {
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
        <SignUpForm />
      </div>
    </div>
  )
}
