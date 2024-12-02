import { Terminal } from 'lucide-react'
import { Alert, AlertDescription } from '../ui/alert' // AlertTitle,

type AlertProps = {
	className?: string
	variant?: 'default' | 'destructive'
}

export default function MyAlert({ className, variant }: AlertProps) {
	return (
		<Alert className={className ?? ''} variant={variant}>
			<Terminal className='w-4 h-4' />
			{/* <AlertTitle>Alert Title</AlertTitle> */}
			<AlertDescription>
				This is a simple alert to demonstrate the usage of the Alert component.
				You can use this component to display any kind of information or error messages.
			</AlertDescription>
		</Alert>
	)
}
