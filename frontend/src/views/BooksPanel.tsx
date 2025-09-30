import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

type Book = { id:number; title:string; author_id:number; description?:string; publishedYear?:number; author_name?:string };
type Author = { id:number; name:string };

export default function BooksPanel(){
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title:'', author_id:'', description:'', publishedYear:'' });
  const [editing, setEditing] = useState<Book | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [b,a] = await Promise.all([api('/books'), api('/authors')]);
      setBooks(b);
      setAuthors(a);
    } catch (e) {
      toast.error('Failed to load books');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api(`/books/${editing.id}`, { method:'PUT', body: JSON.stringify({
          title: form.title,
          author_id: Number(form.author_id),
          description: form.description || null,
          published_year: form.publishedYear ? Number(form.publishedYear) : null
        })});
        toast.success('Book updated');
        setEditing(null);
      } else {
        await api('/books', { method:'POST', body: JSON.stringify({
          title: form.title,
          author_id: Number(form.author_id),
          description: form.description || null,
          published_year: form.publishedYear ? Number(form.publishedYear) : null
        })});
        toast.success('Book created');
      }
      setForm({ title:'', author_id:'', description:'', publishedYear:'' });
      load();
    } catch (e) {
      toast.error('Failed to save book');
    }
  };

  const remove = async (id:number) => {
    if (!confirm('Delete this book?')) return;
    try {
      await api(`/books/${id}`, { method:'DELETE' });
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (b:Book) => {
    setEditing(b);
    setForm({ title: b.title, author_id: String(b.author_id), description: b.description || '', publishedYear: b.publishedYear ? String(b.publishedYear) : '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Books</h2>
      <form onSubmit={submit} className="mb-4">
        <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="border p-2 rounded w-full mb-2"/>
        <select required value={form.author_id} onChange={e=>setForm({...form,author_id:e.target.value})} className="border p-2 rounded w-full mb-2">
          <option value="">Choose author</option>
          {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <input value={form.publishedYear} onChange={e=>setForm({...form,publishedYear:e.target.value})} placeholder="Published year" className="border p-2 rounded w-full mb-2"/>
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="border p-2 rounded w-full mb-2"></textarea>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded">{editing? 'Update':'Create'}</button>
          {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({ title:'', author_id:'', description:'', publishedYear:'' }) }} className="px-3 py-1 border rounded">Cancel</button>}
        </div>
      </form>

      {loading && <div>Loading...</div>}
      {!loading && books.length===0 && <div className="text-gray-500">No books yet</div>}

      <ul className="space-y-2">
        {books.map(b => (
          <li key={b.id} className="p-3 border rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{b.title} <span className="text-sm text-gray-500">({b.publishedYear || '—'})</span></div>
                <div className="text-sm text-gray-600">{b.author_name}</div>
                <div className="text-sm mt-2">{b.description}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(b)} className="text-sm px-2 py-1 border rounded">Edit</button>
                <button onClick={() => remove(b.id)} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
