import type { Book } from "../types/Book"
import type { Author } from "../types/Authors"

interface BookSearchResultsProps {
	searchResults: Book[]
	authors: Author[]
	onSelectBook: (book: Book) => void
	onClearResults: () => void
	isSearching: boolean
	isbnNotFound: boolean
}

const BookSearchResults = ({
	searchResults,
	authors,
	onSelectBook,
	onClearResults,
	isSearching,
	isbnNotFound,
}: BookSearchResultsProps) => {
	if (isSearching) {
		return (
			<div className="mt-2 text-sm text-gray-500">Searching Google Books...</div>
		)
	}

	if (isbnNotFound) {
		return (
			<div className="mt-2 text-sm text-red-600">
				⚠️ No ISBN found for this title
			</div>
		)
	}

	if (searchResults.length === 0) return null

	return (
		<div className="mt-3 border rounded-md bg-white shadow-md max-h-64 overflow-y-auto">
			<div className="flex justify-between items-center px-3 py-2 border-b bg-gray-50">
				<h4 className="text-sm font-semibold text-gray-700">
					Google Books Suggestions
				</h4>
				<button
					onClick={onClearResults}
					className="text-xs text-blue-600 hover:underline"
				>
					Clear
				</button>
			</div>

			{searchResults.map((book) => {
				const author = authors.find((a) => a.id === book.authorId)
				return (
					<div
						key={book.id}
						className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
						onClick={() => onSelectBook(book)}
					>
						<div className="flex gap-3">
							{/* Book cover */}
							{book.coverUrl && (
								<img
									src={book.coverUrl}
									alt={book.title}
									className="w-12 h-16 object-cover rounded"
									onError={(e) => {
										e.currentTarget.style.display = "none"
									}}
								/>
							)}

							{/* Book details */}
							<div className="flex-1">
								<p className="font-medium text-sm text-gray-800">
									{book.title}
								</p>
								<p className="text-xs text-gray-600 mt-1">
									{author?.name || "Unknown author"}
								</p>

								<div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
									{book.publishedYear > 0 && (
										<span>{book.publishedYear}</span>
									)}
									{book.isbn ? (
										<span className="text-blue-600">
											ISBN: {book.isbn}
										</span>
									) : (
										<span className="text-red-500">
											No ISBN available
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default BookSearchResults
