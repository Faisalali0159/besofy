import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"

export default function NewsHero() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-navy-800">
      <div className="absolute inset-0">
        <BackgroundBeams className="absolute inset-0" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent dark:from-black/20" />

      <div className="container relative mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white leading-tight">
            Stay Ahead with Financial News & Insights
          </h1>
          <p className="text-xl text-purple-100 dark:text-pink-200 opacity-90 mb-10 leading-relaxed">
            Get the latest financial news, market trends, and expert analysis to make informed decisions in today's
            dynamic markets.
          </p>
          <Button size="lg" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90" asChild>
            <a href="#latest-news">Explore Latest News</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

