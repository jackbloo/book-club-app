import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

type Author = { id:number; name:string; bio?:string };

export default function AuthorsPanel(){
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', bio:'' });
  const [editing, setEditing] = useState<Author| null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api('/authors');
      setAuthors(data);
    } catch (e) {
      toast.error('Failed to load authors');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api(`/authors/${editing.id}`, { method:'PUT', body: JSON.stringify({ name: form.name, bio: form.bio || null }) });
        toast.success('Author updated');
        setEditing(null);
      } else {
        await api('/authors', { method:'POST', body: JSON.stringify({ name: form.name, bio: form.bio || null }) });
        toast.success('Author created');
      }
      setForm({ name:'', bio:'' });
      load();
    } catch (e) {
      toast.error('Failed to save author');
    }
  };

  const remove = async (id:number) => {
    if (!confirm('Delete this author?')) return;
    try {
      await api(`/authors/${id}`, { method:'DELETE' });
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (a:Author) => {
    setEditing(a);
    setForm({ name: a.name, bio: a.bio || '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Authors</h2>
      <form onSubmit={submit} className="mb-4">
        <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="border p-2 rounded w-full mb-2"/>
        <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Bio (optional)" className="border p-2 rounded w-full mb-2"></textarea>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded">{editing? 'Update':'Create'}</button>
          {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({name:'',bio:''}) }} className="px-3 py-1 border rounded">Cancel</button>}
        </div>
      </form>

      {loading && <div>Loading...</div>}
      {!loading && authors.length===0 && <div className="text-gray-500">No authors yet</div>}

      <ul className="space-y-2">
        {authors.map(a=>(
          <li key={a.id} className="p-3 border rounded flex justify-between items-start">
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-gray-600">{a.bio}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>startEdit(a)} className="text-sm px-2 py-1 border rounded">Edit</button>
              <button onClick={()=>remove(a.id)} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
