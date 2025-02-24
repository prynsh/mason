import { useState } from 'react';
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import dotenv from "dotenv"

dotenv.config()

interface GenerateResult {
  generateContent: (params: GenerateParams) => Promise<string>;
  result: string | null;
  loading: boolean;
  error: string | null;
}

interface GenerateParams {
  title: string;
  content: string;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API as string);

export const useGenerate = (): GenerateResult => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async ({ title, content }: GenerateParams): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const model: GenerativeModel = genAI.getGenerativeModel({ 
        model: "gemini-pro" 
      });

      const plainContent = content.replace(/<[^>]*>/g, '');

      const prompt = `Given the following note with title and content, please provide a brief summary of it and do not prefix it 
      with anything. Just give the summary

Title: ${title}
Content: ${plainContent}`;

      const response = await model.generateContent(prompt);
      const text = await response.response.text();
      
      setResult(text);
      return text;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error generating content:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    generateContent,
    result,
    loading,
    error,
  };
};