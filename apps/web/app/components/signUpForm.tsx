'use client'
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit() {
        setLoading(true);
        setError(null); 

        try {
            const res = await axios.post("http://localhost:3001/signup", { email, password });

            if (res.status === 200) {
                router.push("/signin");
            } else {
                setError("Failed to create account. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6 border rounded-lg", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                placeholder="********"
                                type="password"
                                required
                            />
                        </div>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <Button 
                            onClick={handleSubmit} 
                            type="submit" 
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <a href="/signin" className="underline underline-offset-4">
                            Log in
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
