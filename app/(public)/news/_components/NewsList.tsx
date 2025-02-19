"use client"

import { useEffect, useState } from "react"
import CategoryNewsSection from "./CategoryNewsSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  createdAt: string
  imageUrl?: string
}

const CATEGORIES = ["All", "Crypto", "Stocks", "Commodities", "Markets", "Tech"]

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")

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

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-4 mb-4">
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Articles Yet</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        Stay tuned! We're working on bringing you the latest news in this category.
      </p>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading latest news...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4 max-w-md mx-auto p-6 rounded-2xl bg-white/50 dark:bg-navy-800/50 backdrop-blur-lg">
          <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
          <button
            onClick={fetchNews}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-navy-800/50 backdrop-blur-lg">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No news articles available at the moment</p>
        </div>
      </div>
    )
  }

  // Group news by category
  const newsByCategory = news.reduce(
    (acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = []
      }
      acc[article.category].push(article)
      return acc
    },
    {} as Record<string, NewsItem[]>,
  )

  // Sort articles within each category by date
  Object.keys(newsByCategory).forEach((category) => {
    newsByCategory[category].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  const filteredNews =
    activeCategory === "All"
      ? news
      : news.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase())

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="All" className="w-full">
          <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-navy-900/80 py-4 border-b border-gray-200 dark:border-gray-800">
            <TabsList className="w-full max-w-2xl mx-auto flex justify-between bg-transparent">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="px-4 py-2 text-sm font-medium rounded-full transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-8 space-y-16">
            <TabsContent value="All" className="space-y-16 animate-in fade-in-50">
              {Object.entries(newsByCategory).map(([category, categoryNews]) => (
                categoryNews.length > 0 ? (
                  <CategoryNewsSection key={category} category={category} news={categoryNews} />
                ) : null
              ))}
            </TabsContent>
            {CATEGORIES.slice(1).map((category) => (
              <TabsContent key={category} value={category} className="animate-in fade-in-50">
                {filteredNews.length > 0 ? (
                  <CategoryNewsSection category={category} news={filteredNews} />
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

