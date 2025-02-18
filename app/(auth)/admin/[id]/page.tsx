import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import EditNews from "../_components/EditNews";
import { db } from "@/lib";
import { news } from "@/utils/schema";
import { eq } from "drizzle-orm";

interface EditNewsPageProps {
  params: {
    id: string;
  };
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const user = await currentUser();

  if (!user || user.publicMetadata.role !== 'admin') {
    redirect("/");
  }

  const [article] = await db.select().from(news).where(eq(news.id, params.id));

  if (!article) {
    redirect("/admin/news");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit News Article</h1>
        <p className="text-gray-600">Make changes to your news article</p>
      </div>
      <EditNews article={article} />
    </div>
  );
} 