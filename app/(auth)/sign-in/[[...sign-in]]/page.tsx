"use client"

import { SignIn } from "@clerk/nextjs"
import { AuthLayout } from "@/components/auth-layout"

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome Back 🦑"
      subtitle="Sign in to continue your journey"
      footerText="Don't have an account?"
      footerLink={{
        text: "Sign up",
        href: "/sign-up"
      }}
    >
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-md transition-colors duration-200",
            formFieldInput:
              "w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            card: "shadow-none !bg-transparent",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            footerAction: "text-indigo-600 hover:text-indigo-700",
            rootBox: "!bg-transparent",
            main: "!bg-transparent",
            footer: "!bg-transparent",
            socialButtonsBlockButton: "!bg-white hover:!bg-gray-50",
            socialButtonsBlockButtonText: "!text-gray-600",
            dividerLine: "!bg-gray-200",
            dividerText: "!text-gray-400",
            formFieldLabel: "!text-gray-600",
            identityPreviewText: "!text-gray-600",
            identityPreviewEditButton: "!text-indigo-600",
            formFieldInputShowPasswordButton: "!text-gray-400",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            showOptionalFields: false,
          },
        }}
      />
    </AuthLayout>
  )
}

