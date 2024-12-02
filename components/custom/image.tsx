import Image from 'next/image'
import { AspectRatio } from '../ui/aspect-ratio'

export default function MyImage() {
	return (
		<AspectRatio ratio={16 / 9}>
			<Image alt='' src={'/image.png'} className="rounded-md object-cover" width={200} height={200} />
		</AspectRatio>
	)
}
