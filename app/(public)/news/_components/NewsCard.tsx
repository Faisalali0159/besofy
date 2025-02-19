import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, memo } from "react"
import { cn } from "@/lib/utils"

const CATEGORY_COLORS = {
  crypto: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200 ring-amber-200 dark:ring-amber-800",
  stocks: "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-200 ring-sky-200 dark:ring-sky-800",
  commodities: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 ring-emerald-200 dark:ring-emerald-800",
  markets: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200 ring-indigo-200 dark:ring-indigo-800",
  tech: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-200 ring-violet-200 dark:ring-violet-800",
}

const CATEGORY_LABELS = {
  crypto: "Cryptocurrency",
  stocks: "Stock Market",
  commodities: "Oil & Gold",
  markets: "Markets",
  tech: "Technology",
}

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  category: string
  createdAt: string
  imageUrl?: string
  priority?: boolean
}

const NewsCard = memo(function NewsCard({ 
  id, 
  title, 
  excerpt, 
  category, 
  createdAt, 
  imageUrl,
  priority = false 
}: NewsCardProps) {
  const [imgError, setImgError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const getImageUrl = (url?: string) => {
    if (!url) return "/placeholder-news.jpg"
    if (url.startsWith('data:')) return url
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`
    return url
  }

  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true })
  
  return (
    <Link href={`/news/${id}`} prefetch={false}>
      <Card className={cn(
        "group relative overflow-hidden",
        "bg-gray-50/80 dark:bg-navy-800",
        "hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-navy-900/50",
        "transition-all duration-300 ease-in-out",
        "transform hover:-translate-y-1",
        "rounded-xl border border-gray-100 dark:border-gray-800"
      )}>
        <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
          <Image
            src={!imgError ? getImageUrl(imageUrl) : "/placeholder-news.jpg"}
            alt={title}
            width={600}
            height={400}
            quality={75}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => setImgError(true)}
            className={cn(
              "object-cover w-full h-full",
              "group-hover:scale-110 transition-all duration-500 ease-in-out",
              isLoading ? "blur-sm" : "blur-0"
            )}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="p-5">
          <Badge 
            variant="secondary" 
            className={cn(
              "mb-3 text-xs font-medium tracking-wide",
              "px-4 py-1.5 rounded-full",
              "ring-1 backdrop-blur-sm",
              "shadow-sm",
              CATEGORY_COLORS[category.toLowerCase() as keyof typeof CATEGORY_COLORS] || 
              "bg-gray-50 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300 ring-gray-200 dark:ring-gray-700"
            )}
          >
            {CATEGORY_LABELS[category.toLowerCase() as keyof typeof CATEGORY_LABELS] || category}
          </Badge>
          <h3 className={cn(
            "text-xl font-bold mb-3",
            "text-gray-900 dark:text-white",
            "group-hover:text-purple-600 dark:group-hover:text-purple-400",
            "transition-colors line-clamp-2"
          )}>
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
            <span className={cn(
              "text-purple-600 dark:text-purple-400 font-medium",
              "group-hover:translate-x-1 transition-transform",
              "inline-flex items-center"
            )}>
              Read more
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
})

export default NewsCard

