import { useState, useEffect } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

export type Author = { id: number; name: string; bio?: string };

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [editing, setEditing] = useState<Author | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api('/authors');
      setAuthors(data);
    } catch (e) {
      toast.error('Failed to load authors');
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
        await api(`/authors/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: form.name, bio: form.bio || null })
        });
        toast.success('Author updated');
        setEditing(null);
      } else {
        await api('/authors', {
          method: 'POST',
          body: JSON.stringify({ name: form.name, bio: form.bio || null })
        });
        toast.success('Author created');
        setCreating(false);
      }
      setForm({ name: '', bio: '' });
      load();
    } catch (e) {
      toast.error('Failed to save author');
    }
  };

  const remove = async (id: number | null) => {
    if (!id) return;
    try {
      await api(`/authors/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      setDeleteId(null);
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (author: Author) => {
    setEditing(author);
    setForm({ name: author.name, bio: author.bio || '' });
  };

  const startCreate = () => {
    setCreating(true);
    setForm({ name: '', bio: '' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', bio: '' });
  };

  const cancelCreate = () => {
    setCreating(false);
    setForm({ name: '', bio: '' });
  };

  const updateForm = (updates: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  return {
    // State
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