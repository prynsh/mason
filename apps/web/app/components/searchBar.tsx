import { useState } from 'react';
import { useNoteManagementStore } from '../store/noteManagement';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchNotes = useNoteManagementStore(state => state.searchNotes);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchNotes(value);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Search notes..."
      className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};