import { staticBooks } from "../mockData/staticData"
import type { Book } from "../types/Book"

export const booksService = {
  // Get all books
  getAllBooks: async (): Promise<Book[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return staticBooks
  },

  // Get book by ID
  getBookById: async (id: number): Promise<Book | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return staticBooks.find((book) => book.id === id)
  },

  // Create a new book
  createBook: async (bookData: Omit<Book, "id">): Promise<Book> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newBook: Book = { id: Date.now(), ...bookData }
    staticBooks.push(newBook as Required<Book>)
    return newBook

  },

  // Filter books by author
  getBooksByAuthorId: async (authorId: number): Promise<Book[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return staticBooks.filter((book) => book.authorId === authorId)
  },

  // Search books by title keyword
  searchBooksByTitle: async (keyword: string): Promise<Book[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const lowerKeyword = keyword.toLowerCase()
    return staticBooks.filter((book) =>
      book.title.toLowerCase().includes(lowerKeyword)
    )
  },
}
