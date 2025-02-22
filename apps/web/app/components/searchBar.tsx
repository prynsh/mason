"use client";
import React, { useState } from "react";
import { X } from "lucide-react"; 

interface SearchBarProps {
  notes: any[];
  setFilteredNotes: (notes: any[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ notes, setFilteredNotes }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setQuery(searchTerm);

    const filtered = notes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(searchTerm);
      const tagMatch = note.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm));
      return titleMatch || tagMatch;
    });

    setFilteredNotes(filtered);
  };

  const clearSearch = () => {
    setQuery("");
    setFilteredNotes(notes);
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search notes..."
        className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none pr-10"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
