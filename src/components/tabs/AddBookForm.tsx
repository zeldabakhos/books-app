import { useState, type FormEvent } from "react"
import type { Author } from "../../types/Authors"
import type { Book } from "../../types/Book"
import { searchBooksByTitle } from "../../services/googleBooksService"
import BookSearchResults from "../BookSearchResults"

interface AddBookFormProps {
	authors: Author[]
	onSubmit: (book: Book) => void
	onCancel?: () => void
}

const AddBookForm = ({ authors, onSubmit, onCancel }: AddBookFormProps) => {
const [formData, setFormData] = useState<Omit<Book, "id">>({
		title: "",
		authorId: 0,
		isbn: "",
		publishedYear: new Date().getFullYear(),
		description: "",
		coverUrl: "",
	})

	const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({})
	const [searchResults, setSearchResults] = useState<Book[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const [isbnNotFound, setIsbnNotFound] = useState<boolean>(false)

	// 🔍 Handle input change and trigger Google Books search
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
			setIsbnNotFound(false)
		}

		if (name === "title" && value.length > 2) {
			setIsSearching(true)
			searchBooksByTitle(value)
				.then((books) => {
					setSearchResults(books)
					setIsbnNotFound(books.every((b) => !b.isbn))
				})
				.catch((err) => {
					console.error("Error searching books:", err)
					setSearchResults([])
				})
				.finally(() => setIsSearching(false))
		} else if (name === "title" && value.length <= 2) {
			setSearchResults([])
			setIsbnNotFound(false)
		}
	}

	// ✅ When user selects a book suggestion
	const handleBookSelect = (book: Book & { author?: string; publishedDate?: string; thumbnail?: string }) => {
		setFormData((prev) => ({
			...prev,
			title: book.title,
			description: book.description || prev.description,
			coverUrl: book.coverUrl || book.thumbnail || prev.coverUrl,
			publishedYear: book.publishedYear
				? parseInt(book.publishedYear.toString().substring(0, 4))
				: prev.publishedYear,
			isbn: book.isbn || prev.isbn,
		}))

		setSearchResults([])

		// 🔎 Check if author exists in local DB
		if ((book as any).author) {
			const foundAuthor = authors.find(
				(a) => a.name.toLowerCase() === (book as any).author.toLowerCase()
			)
			console.log("Found author:", foundAuthor)
			if (foundAuthor) {
				setFormData((prev) => ({
					...prev,
					authorId: foundAuthor.id ?? 0,
				}))
			} else {
				setErrors({
					authorId: "No author found for this book. Please select manually.",
				})
			}
		} else {
			setErrors({
				authorId: "No author info from Google. Please select manually.",
			})
		}
	}

	const handleClearResults = () => {
		setSearchResults([])
		setIsbnNotFound(false)
	}

	// ✅ Validation logic
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

	// ✅ Form submit
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (validate()) {
			onSubmit({ ...formData, id: undefined })
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
				{/* Title input */}
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

					{/* Google Books suggestions */}
					<BookSearchResults
						searchResults={searchResults}
						authors={authors}
						onSelectBook={handleBookSelect}
						onClearResults={handleClearResults}
						isSearching={isSearching}
						isbnNotFound={isbnNotFound}
					/>
				</div>

				{/* Author selection */}
				<div>
					<label
						htmlFor="authorId"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Author *
					</label>
					<select
						id="authorId"
						name="authorId"
						value={formData.authorId}
						onChange={handleChange}
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.authorId ? "border-red-500" : "border-gray-300"
						}`}
					>
						<option value={0}>Select an author</option>
						{authors.map((author) => (
							<option key={author.id} value={author.id}>
								{author.name}
							</option>
						))}
					</select>
					{errors.authorId && (
						<p className="mt-1 text-sm text-red-600">{errors.authorId}</p>
					)}
				</div>

				{/* ISBN & year */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
							ISBN *
						</label>
						<input
							type="text"
							id="isbn"
							name="isbn"
							value={formData.isbn}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								errors.isbn ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="e.g., 978-0-123456-78-9"
						/>
						{errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>}
					</div>

					<div>
						<label
							htmlFor="publishedYear"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Published Year *
						</label>
						<input
							type="number"
							id="publishedYear"
							name="publishedYear"
							value={formData.publishedYear}
							onChange={handleChange}
							min="1000"
							max={new Date().getFullYear()}
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								errors.publishedYear ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.publishedYear && (
							<p className="mt-1 text-sm text-red-600">
								{errors.publishedYear}
							</p>
						)}
					</div>
				</div>

				{/* Description */}
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Description *
					</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows={4}
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
							errors.description ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.description && (
						<p className="mt-1 text-sm text-red-600">{errors.description}</p>
					)}
				</div>

				{/* Cover URL */}
				<div>
					<label
						htmlFor="coverUrl"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Cover Image URL *
					</label>
					<input
						type="url"
						id="coverUrl"
						name="coverUrl"
						value={formData.coverUrl}
						onChange={handleChange}
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.coverUrl ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.coverUrl && (
						<p className="mt-1 text-sm text-red-600">{errors.coverUrl}</p>
					)}
					{formData.coverUrl && !errors.coverUrl && (
						<div className="mt-2">
							<p className="text-xs text-gray-500 mb-1">Preview:</p>
							<img
								src={formData.coverUrl}
								alt="Book cover preview"
								className="h-32 object-cover rounded border border-gray-300"
								onError={(e) => (e.currentTarget.style.display = "none")}
							/>
						</div>
					)}
				</div>

				{/* Buttons */}
				<div className="flex gap-3 pt-4">
					<button
						type="submit"
						className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Add Book
					</button>
					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
						>
							Cancel
						</button>
					)}
				</div>
			</form>
		</div>
	)
}

export default AddBookForm
