import React from 'react';

type Book = { id: number; title: string; author_id: number; description?: string; publishedYear?: number; author_name?: string };

interface BookContentProps {
  book: Book;
}

export default function BookContent({ book }: BookContentProps) {
  return (
    <div>
      <div className="font-medium">
        {book.title}{' '}
        <span className="text-sm text-gray-500">({book.publishedYear || '—'})</span>
      </div>
      <div className="text-sm text-gray-600">{book.author_name}</div>
      <div className="text-sm mt-2">{book.description}</div>
    </div>
  );
}