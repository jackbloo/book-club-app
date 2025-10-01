import { useState, useEffect } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

export type Book = { id: number; title: string; author_id: number; description?: string; publishedYear?: number; author_name?: string; authorId?: number; };
export type Author = { id: number; name: string };

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', authorId: '', description: '', publishedYear: '', author_id: '' });
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [b, a] = await Promise.all([api('/books'), api('/authors')]);
      setBooks(b);
      setAuthors(a);
    } catch (e) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    try {
      if (editing) {
        await api(`/books/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: form.title,
            author_id: Number(form.author_id || editing?.authorId),
            description: form.description || null,
            published_year: form.publishedYear ? Number(form.publishedYear) : null
          })
        });
        toast.success('Book updated');
        setEditing(null);
      } else {
        await api('/books', {
          method: 'POST',
          body: JSON.stringify({
            title: form.title,
            author_id: Number(form.author_id),
            description: form.description || null,
            published_year: form.publishedYear ? Number(form.publishedYear) : null
          })
        });
        toast.success('Book created');
        setCreating(false);
      }
      setForm({ title: '', author_id: '', description: '', publishedYear: '', authorId: '' });
      load();
    } catch (e) {
      toast.error('Failed to save book');
    }
  };

  const remove = async (id: number | null) => {
    if (!id) return;
    try {
      await api(`/books/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      setDeleteId(null);
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (book: Book) => {
    setEditing(book);
    setForm({
      title: book.title,
      author_id: String(book.authorId),
      description: book.description || '',
      publishedYear: book.publishedYear ? String(book.publishedYear) : '',
      authorId: ''
    });
  };

  const startCreate = () => {
    setCreating(true);
    setForm({ title: '', author_id: '', description: '', publishedYear: '', authorId: '' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ title: '', author_id: '', description: '', publishedYear: '', authorId: ''   });
  };

  const cancelCreate = () => {
    setCreating(false);
    setForm({ title: '', author_id: '', description: '', publishedYear: '', authorId: '' });
  };

  const updateForm = (updates: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  return {
    // State
    books,
    authors,
    loading,
    form,
    editing,
    deleteId,
    isCreating,
    
    // Actions
    submit,
    remove,
    startEdit,
    startCreate,
    cancelEdit,
    cancelCreate,
    updateForm,
    setDeleteId,
    setEditing,
    setCreating,
    load
  };
}