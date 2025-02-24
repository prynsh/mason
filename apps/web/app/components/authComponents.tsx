
import type React from "react"
import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const AuthCard = memo(({ title, children }: { 
  title: string;
  children: React.ReactNode 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
})
AuthCard.displayName = "AuthCard"

export const EmailInput = memo(({ value, onChange }: { 
  value: string; 
  onChange: (value: string) => void 
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id="email"
        type="email"
        placeholder="example@email.com"
        required
      />
    </div>
  )
})
EmailInput.displayName = "EmailInput"

export const PasswordInput = memo(({ value, onChange }: {
  value: string;
  onChange: (value: string) => void
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="password">Password</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id="password"
        type="password"
        placeholder="********"
        required
      />
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"

export const AuthButton = memo(({ onClick, loading, text, loadingText }: {
  onClick: () => void;
  loading: boolean;
  text: string;
  loadingText: string;
}) => {
  return (
    <Button
      onClick={onClick}
      type="submit"
      className="w-full"
      disabled={loading}
    >
      {loading ? loadingText : text}
    </Button>
  )
})
AuthButton.displayName = "AuthButton"