import { useState, type FormEvent } from "react"
import type { Author } from "../../types/Authors"

interface AddAuthorFormProps {
	onSubmit: (author: Author) => void
	onCancel?: () => void
}

const AddAuthorForm = ({ onSubmit, onCancel }: AddAuthorFormProps) => {
	const [formData, setFormData] = useState<Omit<Author, "id">>({
		name: "",
		bio: "",
		birthYear: new Date().getFullYear(),
		country: "",
	})

	const [errors, setErrors] = useState<Partial<Record<keyof Author, string>>>({})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: name === "birthYear" ? parseInt(value) || 0 : value,
		}))

		// Clear error as user types
		if (errors[name as keyof Author]) {
			setErrors((prev) => ({ ...prev, [name]: "" }))
		}
	}

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof Author, string>> = {}

		if (!formData.name.trim()) newErrors.name = "Name is required"
		if (!formData.bio.trim()) newErrors.bio = "Biography is required"
		if (!formData.birthYear || formData.birthYear < 1000 || formData.birthYear > new Date().getFullYear())
			newErrors.birthYear = "Enter a valid year"
		if (!formData.country.trim()) newErrors.country = "Country is required"

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (validate()) {
			onSubmit({ ...formData, id: undefined })
			setFormData({
				name: "",
				bio: "",
				birthYear: new Date().getFullYear(),
				country: "",
			})
			setErrors({})
		}
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Author</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Name *
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
							errors.name ? "border-red-500" : "border-gray-300"
						}`}
						placeholder="Enter author name"
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-600">{errors.name}</p>
					)}
				</div>

				{/* Biography */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Biography *
					</label>
					<textarea
						name="bio"
						value={formData.bio}
						onChange={handleChange}
						rows={4}
						className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${
							errors.bio ? "border-red-500" : "border-gray-300"
						}`}
						placeholder="Enter a short biography"
					/>
					{errors.bio && (
						<p className="mt-1 text-sm text-red-600">{errors.bio}</p>
					)}
				</div>

				{/* Birth Year & Country */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Birth Year *
						</label>
						<input
							type="number"
							name="birthYear"
							value={formData.birthYear}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
								errors.birthYear ? "border-red-500" : "border-gray-300"
							}`}
							min="1000"
							max={new Date().getFullYear()}
						/>
						{errors.birthYear && (
							<p className="mt-1 text-sm text-red-600">
								{errors.birthYear}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Country *
						</label>
						<input
							type="text"
							name="country"
							value={formData.country}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
								errors.country ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="Enter country name"
						/>
						{errors.country && (
							<p className="mt-1 text-sm text-red-600">{errors.country}</p>
						)}
					</div>
				</div>

				{/* Buttons */}
				<div className="flex gap-3 pt-4">
					<button
						type="submit"
						className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Add Author
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

export default AddAuthorForm
