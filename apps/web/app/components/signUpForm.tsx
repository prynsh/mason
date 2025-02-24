'use client'
import type React from "react"
import { memo } from "react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { AuthButton, AuthCard, EmailInput, PasswordInput } from "./authComponents"


const SignupFormContent = memo(() => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post("http://localhost:3001/signup", { email, password })

      if (res.status === 200) {
        router.push("/signin")
      } else {
        setError("Failed to create account. Please try again.")
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <EmailInput value={email} onChange={setEmail} />
        <PasswordInput value={password} onChange={setPassword} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <AuthButton 
          onClick={handleSubmit} 
          loading={loading}
          text="Sign Up"
          loadingText="Signing Up..."
        />
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/signin" className="underline underline-offset-4">
          Log in
        </a>
      </div>
    </>
  )
})
SignupFormContent.displayName = "SignupFormContent"

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard title="Create an account">
        <SignupFormContent />
      </AuthCard>
    </div>
  )
}