"use client"

import { useState, useEffect } from "react"
import { X, Upload } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

interface CreateNewsProps {
  onClose: () => void
}

const NEWS_CATEGORIES = [
  { id: "crypto", label: "Cryptocurrency" },
  { id: "stocks", label: "Stock Market" },
  { id: "commodities", label: "Oil & Gold" },
  { id: "markets", label: "Markets" },
  { id: "tech", label: "Technology" },
] as const

export default function CreateNews({ onClose }: CreateNewsProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    try {
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result.toString())
        }
      }
      reader.onerror = (error) => {
        console.error("Error reading file:", error)
        alert("Error reading file. Please try again.")
        setImagePreview(null)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Error processing image. Please try again.")
      setImagePreview(null)
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith("data:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          imageUrl: imageUrl || null,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Failed to create article")
      }

      onClose()
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Failed to create article")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Article</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the details to create a new article</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            className="rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {NEWS_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Image</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full hover:bg-red-600"
                    onClick={() => {
                      setImagePreview(null)
                      setImageUrl("")
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <Label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500"
                    >
                      <span>Upload a file</span>
                      <Input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </Label>
                    <p className="pl-3 py-2">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Content <span className="text-red-500">*</span>
          </Label>
          <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-64"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  ["blockquote", "code-block"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-6 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !title || !content || !category}
            className="rounded-xl px-6 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? "Creating..." : "Create Article"}
          </Button>
        </div>
      </form>
    </div>
  )
}
