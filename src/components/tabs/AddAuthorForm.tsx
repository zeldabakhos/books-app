import { useState, type FormEvent } from "react"
import type { Author } from "../../types/Authors"
import type { Book } from "../../types/Book"
import { searchBooksByTitle } from "../../services/googleBooksService" // ✅ import Google Books service

interface AddBookFormProps {
	authors: Author[]
	onSubmit: (book: Book) => void
	onCancel?: () => void
}

const AddBookForm = ({ authors, onSubmit, onCancel }: AddBookFormProps) => {
	const [formData, setFormData] = useState<Book>({
		title: "",
		authorId: 0,
		isbn: "",
		publishedYear: new Date().getFullYear(),
		description: "",
		coverUrl: "",
	})

	const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({})
	const [isSearching, setIsSearching] = useState(false)
	const [searchResults, setSearchResults] = useState<Book[]>([])

	// 🔍 Handle input changes (title triggers Google Books search)
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]:
				name === "authorId" || name === "publishedYear"
					? parseInt(value) || 0
					: value,
		}))

		if (errors[name as keyof Book]) {
			setErrors((prev) => ({ ...prev, [name]: "" }))
		}

		// ✅ Trigger Google Books search when typing in title
		if (name === "title" && value.length > 2) {
			setIsSearching(true)
			searchBooksByTitle(value)
				.then((books) => setSearchResults(books))
				.catch((err) => {
					console.error("Error searching books:", err)
					setSearchResults([])
				})
				.finally(() => setIsSearching(false))
		} else if (name === "title" && value.length <= 2) {
			setSearchResults([])
		}
	}

	// ✅ Auto-fill the form when clicking a suggestion
	const handleSuggestionClick = (book: Book) => {
		setFormData({
			title: book.title,
			authorId: 0, // the user will still choose the author manually
			isbn: book.isbn,
			publishedYear: book.publishedYear,
			description: book.description,
			coverUrl: book.coverUrl,
		})
		setSearchResults([])
	}

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof Book, string>> = {}

		if (!formData.title.trim()) newErrors.title = "Title is required"
		if (!formData.authorId || formData.authorId === 0)
			newErrors.authorId = "Please select an author"
		if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required"
		else if (!/^[0-9-]+$/.test(formData.isbn))
			newErrors.isbn = "ISBN should only contain numbers and hyphens"
		if (
			!formData.publishedYear ||
			formData.publishedYear < 1000 ||
			formData.publishedYear > new Date().getFullYear()
		)
			newErrors.publishedYear = "Please enter a valid publication year"
		if (!formData.description.trim()) newErrors.description = "Description is required"
		if (!formData.coverUrl.trim())
			newErrors.coverUrl = "Cover URL is required"
		else if (!/^https?:\/\/.+/.test(formData.coverUrl))
			newErrors.coverUrl = "Please enter a valid URL (http:// or https://)"

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (validate()) {
			onSubmit(formData)
			setFormData({
				title: "",
				authorId: 0,
				isbn: "",
				publishedYear: new Date().getFullYear(),
				description: "",
				coverUrl: "",
			})
			setErrors({})
			setSearchResults([])
		}
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Book</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Title Input + Suggestions */}
				<div className="relative">
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Title *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.title ? "border-red-500" : "border-gray-300"
						}`}
						placeholder="Enter book title"
					/>
					{errors.title && (
						<p className="mt-1 text-sm text-red-600">{errors.title}</p>
					)}

					{/* ✅ Suggestions dropdown */}
					{isSearching && (
						<p className="text-sm text-gray-500 mt-1">Searching...</p>
					)}

					{!isSearching && searchResults.length > 0 && (
						<div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
							{searchResults.map((book) => (
								<div
									key={book.id}
									className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
									onClick={() => handleSuggestionClick(book)}
								>
									<p className="font-medium text-gray-800">{book.title}</p>
									<p className="text-xs text-gray-500 truncate">
										{book.isbn} • {book.publishedYear}
									</p>
								</div>
							))}
						</div>
					)}
				</div>

				{/* (The rest of your form fields remain identical) */}
				{/* Author Select, ISBN, Year, Description, Cover URL, Buttons */}
				{/* ... existing code unchanged ... */}
			</form>
		</div>
	)
}

export default AddBookForm
