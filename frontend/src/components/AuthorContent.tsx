import React from 'react';

type Author = { id: number; name: string; bio?: string };

interface AuthorContentProps {
  author: Author;
}

export default function AuthorContent({ author }: AuthorContentProps) {
  return (
    <div>
      <div className="font-medium">{author.name}</div>
      <div className="text-sm text-gray-600">{author.bio}</div>
    </div>
  );
}