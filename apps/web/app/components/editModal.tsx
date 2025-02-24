'use client'

import React, { useEffect, useCallback, Suspense, memo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { editNote } from "../store/editNote";
import { TitleInput } from "./titleInput";
import { TextEditor } from "./textEditor";
import { TagsInput } from "./tagsInput";
import CancelButton from "./cancelButton";
import { SubmitButton } from "./submitButton";
import { useGenerate } from "../hooks/useGenerate";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditNoteModalProps {
  noteId: string;
  closeModal: () => void;
  onNoteUpdate: (updatedNote: { _id: string; title: string; content: string; tags: string[] }) => void;
}

const MemoizedSubmitButton = memo(SubmitButton);

const EditNoteModal = ({ noteId, closeModal, onNoteUpdate }:EditNoteModalProps) => {
  const { title, content, tags, loading, fetchNote, updateNote, setTitle, setContent, setTags } = editNote();
  const {generateContent}= useGenerate()

  useEffect(() => {
    fetchNote(noteId);
  }, [noteId, fetchNote]);

  const handleSave = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await updateNote(noteId, token, generateContent, () => {
        onNoteUpdate({ _id: noteId, title, content, tags });
        closeModal();
      });
    } else {
      console.error('No token found');
    }
  }, [updateNote, noteId, onNoteUpdate, title, content, tags, closeModal, generateContent]);
  

  const handleTitleChange = useCallback((value: string) => setTitle(value), [setTitle]);
  const handleContentChange = useCallback((value: string) => setContent(value), [setContent]);
  const handleTagsChange = useCallback((value: string) => setTags(value.split(",")), [setTags]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Note</h2>

        <TitleInput value={title} onChange={handleTitleChange} />
        <TextEditor value={content} onChange={handleContentChange} />
        <TagsInput value={tags.join(",")} onChange={handleTagsChange} />

        <div className="flex justify-end space-x-2 mt-4">
          <Suspense fallback={<div>Loading...</div>}>
            <CancelButton onClick={closeModal} />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <MemoizedSubmitButton loading={loading} onClick={handleSave} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default memo(EditNoteModal);
