'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });


export default function MyComponent() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token'); 

    try {
      const response = await axios.post('http://localhost:3001/notes/create', {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
      }, {
        headers: {
          Authorization: token 
        }
      });

      setSuccess('Note created successfully!');
      setTitle('');
      setContent('');
      setTags('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-8">
      <div className="flex flex-col">
        <Label htmlFor="title" className="text-xl font-semibold">Title</Label>
        <Input
          id="title"
          placeholder="Enter the title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 p-3"
        />
      </div>
      <div className="flex flex-col">
        <Label htmlFor="content" className="text-xl font-semibold">Content</Label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="mt-2 h-56"
        />
      </div>
      <div className="flex flex-col">
        <Label htmlFor="tags" className="pt-5 text-xl font-semibold">Tags</Label>
        <Input
          id="tags"
          placeholder="Enter tags separated by commas"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-2 p-3"
        />
      </div>
      <div className="mt-6">
        <Button onClick={handleSubmit} variant="outline" className="px-6 py-2 rounded-lg" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
}



