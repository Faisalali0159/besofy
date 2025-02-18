import { redirect } from "next/navigation"
import NewsManagement from "./_components/NewsManagement"
import { currentUser } from "@clerk/nextjs/server"

export default async function AdminNewsPage() {
  console.log("📄 Loading admin news page...")
  const user = await currentUser()

  if (!user) {
    console.log("❌ No user found")
    redirect("/")
  }

  // Check if user has admin role
  const isAdmin = user.publicMetadata.role === "admin"
  
  if (!isAdmin) {
    console.log("❌ User does not have admin privileges")
    redirect("/") // Redirect non-admin users to home page
  }

  console.log("👤 User details:", {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    metadata: user.publicMetadata,
  })

  console.log("✅ Admin access granted")

  return (
    <div>
      <NewsManagement />
    </div>
  )
}

