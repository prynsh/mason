'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '../store/useNote';
import { TitleInput } from './titleInput';
import { TextEditor } from './textEditor';
import { TagsInput } from './tagsInput';
import { SubmitButton } from './submitButton';
import { useGenerate } from '../hooks/useGenerate';

export default function CreatePage() {
  const router = useRouter();
  const { generateContent } = useGenerate();

  const title = useNoteStore(state => state.title);
  const content = useNoteStore(state => state.content);
  const tags = useNoteStore(state => state.tags);
  const loading = useNoteStore(state => state.loading);
  const error = useNoteStore(state => state.error);
  const success = useNoteStore(state => state.success);
  const validationErrors = useNoteStore(state => state.validationErrors);
  const setTitle = useNoteStore(state => state.setTitle);
  const setContent = useNoteStore(state => state.setContent);
  const setTags = useNoteStore(state => state.setTags);
  const createNote = useNoteStore(state => state.createNote);

  const handleSubmit = React.useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      createNote(token, router, generateContent);
    } else {
      console.error('No token found');
    }
  }, [createNote, router, generateContent]);

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-8">
      <TitleInput 
        value={title} 
        onChange={setTitle} 
        error={validationErrors.title} 
      />
      <TextEditor 
        value={content} 
        onChange={setContent} 
        error={validationErrors.content} 
      />
      <TagsInput 
        value={tags} 
        onChange={setTags} 
        error={validationErrors.tags} 
      />

      <div className="mt-6">
        <SubmitButton loading={loading} onClick={handleSubmit} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
}