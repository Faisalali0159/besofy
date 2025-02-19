import { Metadata } from "next";
import Header from "@/components/Header";
import NewsHero from "@/app/(public)/news/_components/NewsHero";
import NewsList from "@/app/(public)/news/_components/NewsList";

export const metadata: Metadata = {
  title: "Financial News | Naallofy",
  description: "Stay updated with the latest financial news and insights",
};

export default async function NewsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <Header />
      <NewsHero />
      <div className="container mx-auto px-4 py-8">
        <NewsList />
      </div>
    </main>
  );
} 

