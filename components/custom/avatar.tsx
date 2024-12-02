import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MyAvatar() {
	return (
		<Avatar className='w-20 h-20'>
			<AvatarImage src="https://avatars.githubusercontent.com/u/125138460?v=4" alt="User Avatar" />
			<AvatarFallback>
				CN
			</AvatarFallback>
		</Avatar>
	)
}
