import React from 'react';

type Author = { id: number; name: string };

interface BookFormProps {
  title: string;
  authorId?: number | string;
  publishedYear: string;
  description: string;
  authors: Author[];
  onTitleChange: (title: string) => void;
  onAuthorIdChange: (authorId: string) => void;
  onPublishedYearChange: (year: string) => void;
  onDescriptionChange: (description: string) => void;
}

export default function BookForm({
  title,
  authorId,
  publishedYear,
  description,
  authors,
  onTitleChange,
  onAuthorIdChange,
  onPublishedYearChange,
  onDescriptionChange
}: BookFormProps) {

  return (
    <>
      <input 
        required 
        value={title} 
        onChange={e => onTitleChange(e.target.value)} 
        placeholder="Title" 
        className="border p-2 rounded w-full mb-2"
      />
      <select 
        required 
        value={authorId} 
        onChange={e => onAuthorIdChange(e.target.value)} 
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Choose author</option>
        {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <input 
        value={publishedYear} 
        onChange={e => onPublishedYearChange(e.target.value)} 
        placeholder="Published year" 
        type="number"
        className="border p-2 rounded w-full mb-2"
      />
      <textarea 
        value={description} 
        onChange={e => onDescriptionChange(e.target.value)} 
        placeholder="Description" 
        className="border p-2 rounded w-full mb-2"
        rows={3}
      ></textarea>
    </>
  );
}