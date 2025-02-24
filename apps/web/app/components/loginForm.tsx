'use client'
import type React from "react"
import { memo } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuthStore } from "../store/authStore"
import { AuthCard, EmailInput, PasswordInput, AuthButton } from "./authComponents"

const LoginFormContent = memo(() => {
  const email = useAuthStore((state) => state.email)
  const setEmail = useAuthStore((state) => state.setEmail)
  const password = useAuthStore((state) => state.password)
  const setPassword = useAuthStore((state) => state.setPassword)
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)

  return (
    <>
      <div className="flex flex-col gap-6">
        <EmailInput value={email} onChange={setEmail} />
        <PasswordInput value={password} onChange={setPassword} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <AuthButton 
          onClick={login} 
          loading={loading}
          text="Login"
          loadingText="Logging in..."
        />
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </>
  )
})
LoginFormContent.displayName = "LoginFormContent"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard title="Welcome back">
        <LoginFormContent />
      </AuthCard>
    </div>
  )
}