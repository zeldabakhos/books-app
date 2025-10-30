import type { Book } from "../types/Book"

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

// Transform Google API data to match your Book type
const transformGoogleBook = (item: any): Book => {
	const info = item.volumeInfo

	return {
		id: item.id, // Google ID
		title: info.title || "Untitled",
		authorId: 0, // No author ID from Google API
		isbn:
			info.industryIdentifiers?.[0]?.identifier ??
			"Unknown ISBN",
		publishedYear: parseInt(info.publishedDate?.slice(0, 4)) || 0,
		description: info.description || "No description available.",
		coverUrl: info.imageLinks?.thumbnail || "",
	}
}

export const searchBooksByTitle = async (title: string): Promise<Book[]> => {
	try {
		const params = new URLSearchParams({
			q: `intitle:${title}`,
			country: "US",
			maxResults: "40",
		})

		const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`)
		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`)
		}

		const data = await response.json()

		if (!data.items || data.items.length === 0) {
			return []
		}

		return data.items.map(transformGoogleBook)
	} catch (error) {
		console.error("Error fetching books from Google Books API:", error)
		return []
	}
}
