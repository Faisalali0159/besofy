import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import NewsCard from "./NewsCard"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  createdAt: string
  imageUrl?: string
}

interface CategoryNewsSectionProps {
  category: string
  news: NewsItem[]
}

const CATEGORY_LABELS: { [key: string]: string } = {
  crypto: "Cryptocurrency",
  stocks: "Stock Market",
  commodities: "Commodities",
  markets: "Global Markets",
  tech: "Technology",
}

export default function CategoryNewsSection({ category, news }: CategoryNewsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const displayedNews = isExpanded ? news : news.slice(0, 3)

  if (news.length === 0) return null

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            {CATEGORY_LABELS[category.toLowerCase()] || category}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {news.length} articles available
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20" 
          asChild
        >
          <Link href={`/news/category/${category.toLowerCase()}`} className="group inline-flex items-center gap-2">
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {displayedNews.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <NewsCard {...article} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {news.length > 3 && (
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white dark:bg-navy-800 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            {isExpanded ? "Show Less" : "Show More"}
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-2"
            >
              ↓
            </motion.span>
          </Button>
        </motion.div>
      )}
    </section>
  )
}

