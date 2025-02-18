"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit2, Trash2, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

const CATEGORY_COLORS = {
  crypto: "bg-orange-100 text-orange-800",
  stocks: "bg-blue-100 text-blue-800",
  commodities: "bg-yellow-100 text-yellow-800",
  markets: "bg-green-100 text-green-800",
  tech: "bg-purple-100 text-purple-800",
}

const CATEGORY_LABELS = {
  crypto: "Cryptocurrency",
  stocks: "Stock Market",
  commodities: "Oil & Gold",
  markets: "Markets",
  tech: "Technology",
}

interface NewsListProps {
  searchTerm: string
}

export default function NewsList({ searchTerm }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      if (!response.ok) throw new Error("Failed to fetch news")
      const data = await response.json()
      setNews(data)
      setError(null)
    } catch (err) {
      setError("Failed to load news articles")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete")
      await fetchNews() // Refresh the list
    } catch (err) {
      console.error(err)
      alert("Failed to delete the article")
    }
  }

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchNews} className="mt-4 bg-purple-500 hover:bg-purple-600 text-white">
          Try again
        </Button>
      </div>
    )
  }

  if (filteredNews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">No news articles found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200 dark:border-gray-700">
          <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Article</TableHead>
          <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Category</TableHead>
          <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Created</TableHead>
          <TableHead className="text-right text-gray-700 dark:text-gray-200 font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredNews.map((item) => (
          <TableRow key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <TableCell>
              <div className="flex items-start space-x-4 py-2">
                {item.imageUrl && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{item.content}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                  CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] || "bg-gray-100 text-gray-800"
                }`}
              >
                {CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS] || item.category}
              </span>
            </TableCell>
            <TableCell className="text-gray-600 dark:text-gray-300">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl" asChild>
                  <Link href={`/news/${item.id}`}>
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl" asChild>
                  <Link href={`/admin/news/edit/${item.id}`}>
                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

