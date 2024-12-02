export default function urlCreator(route: string) {
	const url = process.env.NEXT_PUBLIC_API_URL
	return url + '/' + route
}