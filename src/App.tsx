import { useState } from "react"
import { BookOpen } from "lucide-react"
import BookCard from "./components/BookCard"
import AuthorCard from "./components/AuthorCard"
import SearchBar from "./components/SearchBar"
import { staticBooks, staticAuthors } from "./mockData/staticData"
import AddAuthorForm from "./components/tabs/AddAuthorForm"
import AddBookForm from "./components/tabs/AddBookForm"
import NavigationTabs from "./components/NavogationTabs"
import type { Author } from "./types/Authors"
import type { Book } from "./types/Book"

const App = () => {
	// ✅ State management
	const [authors, setAuthors] = useState<Author[]>(staticAuthors)
	const [books, setBooks] = useState<Book[]>(staticBooks)
	const [activeTab, setActiveTab] = useState("books")
	const [searchTerm, setSearchTerm] = useState("")

	// ✅ Add new author
	const handleAddAuthor = (author: Author) => {
		const authorWithId = { ...author, id: Date.now() }
		setAuthors((prev) => [...prev, authorWithId])
		setActiveTab("authors") // switch back automatically
	}

	// ✅ Add new book
	const handleAddBook = (book: Book) => {
		const bookWithId = { ...book, id: Date.now() }
		setBooks((prev) => [...prev, bookWithId])
		setActiveTab("books") // switch back automatically
	}

	// ✅ Helpers
	const getAuthorById = (authorId: number) => authors.find((a) => a.id === authorId)
	const getBookCountByAuthor = (authorId: number) =>
		books.filter((book) => book.authorId === authorId).length

	// ✅ Filters
	const filteredBooks = books.filter((book) => {
		const author = getAuthorById(book.authorId)
		return (
			book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			author?.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
	})

	const filteredAuthors = authors.filter((author) =>
		author.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-indigo-600 text-white shadow-lg">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center gap-3 mb-4">
						<BookOpen className="w-8 h-8" />
						<h1 className="text-3xl font-bold">Books & Authors Library</h1>
					</div>
					<SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
				</div>
			</header>

			{/* Navigation Tabs */}
			<NavigationTabs
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				booksCount={filteredBooks.length}
				authorsCount={filteredAuthors.length}
			/>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				{/* 📚 Books tab */}
				{activeTab === "books" && (
					<div className="space-y-4 flex flex-col flex-wrap">
						{filteredBooks.length > 0 ? (
							filteredBooks.map((book) => (
								<BookCard
									key={book.id}
									book={book}
									author={getAuthorById(book.authorId)!}
								/>
							))
						) : (
							<div className="text-center py-12 text-gray-500">
								No books found matching your search.
							</div>
						)}
					</div>
				)}

				{/* 👩‍💼 Authors tab */}
				{activeTab === "authors" && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filteredAuthors.length > 0 ? (
							filteredAuthors.map((author) => (
								<AuthorCard
									key={author.id}
									author={author}
									bookCount={getBookCountByAuthor(author.id)}
								/>
							))
						) : (
							<div className="col-span-2 text-center py-12 text-gray-500">
								No authors found matching your search.
							</div>
						)}
					</div>
				)}

				{/* ➕ Add new author */}
				{activeTab === "add-author" && (
					<AddAuthorForm
						onSubmit={handleAddAuthor}
						onCancel={() => setActiveTab("authors")}
					/>
				)}

				{/* ➕ Add new book */}
				{activeTab === "add-book" && (
					<AddBookForm authors={authors} onSubmit={handleAddBook} />
				)}
			</main>
		</div>
	)
}

export default App
