import React from 'react';

interface AuthorFormProps {
  name: string;
  bio: string;
  onNameChange: (name: string) => void;
  onBioChange: (bio: string) => void;
}

export default function AuthorForm({ name, bio, onNameChange, onBioChange }: AuthorFormProps) {
  return (
    <>
      <input 
        required 
        value={name} 
        onChange={e => onNameChange(e.target.value)} 
        placeholder="Name" 
        className="border p-2 rounded w-full mb-2"
      />
      <textarea 
        value={bio} 
        onChange={e => onBioChange(e.target.value)} 
        placeholder="Bio (optional)" 
        className="border p-2 rounded w-full mb-2"
        rows={3}
      ></textarea>
    </>
  );
}