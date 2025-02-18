"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, RefreshCw, Newspaper, Search } from "lucide-react"
import CreateNews from "./CreateNews"
import NewsList from "./NewsList"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewsManagement() {
  const [isCreating, setIsCreating] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-[#0F172A] flex flex-col transition-colors duration-300">
      <div className="w-full max-w-[95%] mx-auto py-6">
        {/* Header Card */}
        <div className="mb-8 rounded-2xl bg-white dark:bg-navy-800 p-6 shadow-lg transition-colors duration-300">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-600 shadow-lg transition-transform hover:scale-105">
                <Newspaper className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">News Management</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Create, edit, and manage your news articles</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 hover:scale-105 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-[#1E293B]"
              >
                <Plus className="h-5 w-5" />
                Create Article
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-[#1E293B]"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E293B] pl-12 pr-4 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* News List */}
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-lg flex-1 min-h-[calc(100vh-320px)] transition-colors duration-300">
          <NewsList searchTerm={searchTerm} />
        </div>
      </div>

      {/* Create News Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white dark:bg-[#1E293B] shadow-xl transition-colors duration-300">
            <CreateNews
              onClose={() => {
                setIsCreating(false)
                handleRefresh()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

