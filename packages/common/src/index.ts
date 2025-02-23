import z from "zod";

export const SignupSchema  = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const SignInSchema = z.object({
    email: z.string(),
    password: z.string(),
})
export const NotesSchema = z.object({
    title: z.string(),
    content: z.string(),
    tags: z.string().array(),
    aiSummary: z.string().optional(),
})

