'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import { useGenerate } from '../hooks/useGenerate';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ValidationErrors {
  title?: string;
  content?: string;
  tags?: string;
}

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});


  const { generateContent, loading: aiLoading, error: aiError } = useGenerate();


  const generateAISummaryAndTags = async (content: string) => {
    try {
      const aiResponse = await generateContent({
        title,
        content
      });
      
      return aiResponse;
    } catch (error) {
      console.error('Error generating AI content:', error);
      throw error;
    }
  };


  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!content.trim()) {
      errors.content = 'Content is required';
      isValid = false;
    }

    if (!tags.trim()) {
      errors.tags = 'At least one tag is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');

    try {
      const aiResponse = await generateAISummaryAndTags(content);
      console.log('AI Response:', aiResponse);
  
      const response = await axios.post('http://localhost:3001/notes/create', {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        aiSummary: aiResponse, 
      }, {
        headers: {
          Authorization: token
        }
      });
  
      setSuccess('Note created successfully!');
      setTimeout(() => {
        router.push('/');
      }, 1000);
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-8">
      <div className="flex flex-col">
        <Label htmlFor="title" className="text-xl font-semibold">
          Title 
        </Label>
        <Input
          id="title"
          placeholder="Enter the title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setValidationErrors({ ...validationErrors, title: undefined });
          }}
          className={`mt-2 p-3 ${validationErrors.title ? 'border-red-500' : ''}`}
        />
        {validationErrors.title && (
          <span className="text-red-500 text-sm mt-1">{validationErrors.title}</span>
        )}
      </div>

      <div className="flex flex-col">
        <Label htmlFor="content" className="text-xl font-semibold">
          Content
        </Label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => {
            setContent(value);
            setValidationErrors({ ...validationErrors, content: undefined });
          }}
          className={`mt-2 h-56 ${validationErrors.content ? 'border-red-500' : ''}`}
        />
        {validationErrors.content && (
          <span className="text-red-500 text-sm mt-1">{validationErrors.content}</span>
        )}
      </div>

      <div className="flex flex-col">
        <Label htmlFor="tags" className="pt-5 text-xl font-semibold">
          Tags 
        </Label>
        <Input
          id="tags"
          placeholder="Enter tags separated by commas"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
            setValidationErrors({ ...validationErrors, tags: undefined });
          }}
          className={`mt-2 p-3 ${validationErrors.tags ? 'border-red-500' : ''}`}
        />
        {validationErrors.tags && (
          <span className="text-red-500 text-sm mt-1">{validationErrors.tags}</span>
        )}
      </div>

      <div className="mt-6">
        <Button 
          onClick={handleSubmit} 
          variant="outline" 
          className={`px-6 py-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
}