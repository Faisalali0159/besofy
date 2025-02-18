"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Upload } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import type { News } from "@/utils/schema"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

interface EditNewsProps {
  article: News
}

const NEWS_CATEGORIES = [
  { id: "crypto", label: "Cryptocurrency" },
  { id: "stocks", label: "Stock Market" },
  { id: "commodities", label: "Oil & Gold" },
  { id: "markets", label: "Markets" },
  { id: "tech", label: "Technology" },
]

export default function EditNews({ article }: EditNewsProps) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [category, setCategory] = useState(article.category)
  const [imageUrl, setImageUrl] = useState(article.image || "")
  const [published, setPublished] = useState(article.published || false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(article.image || null)
  const router = useRouter()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
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
        toast.error("Error reading file. Please try again.")
        setImagePreview(null)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing image:", error)
      toast.error("Error processing image. Please try again.")
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
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/news/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          image: imageUrl || null,
          published,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Failed to update news article")
      }

      toast.success("News article updated successfully")
      router.push("/admin/news")
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Failed to update news article")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Article</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Update your article details</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push("/admin/news")} 
          className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium text-gray-900 dark:text-white">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-base font-medium text-gray-900 dark:text-white">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
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
          <Label className="text-base font-medium text-gray-900 dark:text-white">Image</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-xl hover:bg-red-600"
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
                      className="relative cursor-pointer bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-lg px-4 py-2 font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500"
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
          <Label htmlFor="content" className="text-base font-medium text-gray-900 dark:text-white">
            Content <span className="text-red-500">*</span>
          </Label>
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-64"
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

        <div className="flex items-center space-x-2 pt-4">
          <input
            aria-label="Published status"
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-700 text-purple-600 focus:ring-purple-500"
          />
          <Label htmlFor="published" className="text-gray-900 dark:text-white">Published</Label>
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/admin/news")}
            className="rounded-xl px-6 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !title || !content || !category}
            className="rounded-xl px-6 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? "Updating..." : "Update Article"}
          </Button>
        </div>
      </form>
    </div>
  )
}

