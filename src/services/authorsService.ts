import type { Author } from "../types/Authors"
import { staticAuthors } from "../mockData/staticData"

export const authorsService = {
	// ✅ Get all authors
	getAllAuthors: async (): Promise<Author[]> => {
		await new Promise((resolve) => setTimeout(resolve, 400)) // simulate delay
		return staticAuthors
	},

	// ✅ Get author by ID
	getAuthorById: async (id: number): Promise<Author | undefined> => {
		await new Promise((resolve) => setTimeout(resolve, 300))
		return staticAuthors.find((author) => author.id === id)
	},

	// ✅ Create a new author
	createAuthor: async (authorData: Omit<Author, "id">): Promise<Author> => {
		await new Promise((resolve) => setTimeout(resolve, 300))
		const newAuthor: Author = { id: Date.now(), ...authorData }
		staticAuthors.push(newAuthor)
		return newAuthor
	},

	// ✅ Filter authors by country
	getAuthorsByCountry: async (country: string): Promise<Author[]> => {
		await new Promise((resolve) => setTimeout(resolve, 300))
		return staticAuthors.filter((author) => author.country === country)
	},
}
