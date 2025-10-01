import React from 'react';
import CreateModal from '../components/CreateModal';
import EditModal from '../components/EditModal';
import DeleteModal from '../components/DeleteModal';
import ListItem from '../components/ListItem';
import AuthorContent from '../components/AuthorContent';
import AuthorForm from '../components/AuthorForm';
import AuthorSkeleton from '../components/AuthorSkeleton';
import { useAuthors } from '../hooks/useAuthors';

export default function AuthorsPanel(){
  const {
    authors,
    loading,
    form,
    editing,
    deleteId,
    isCreating,
    submit,
    remove,
    startEdit,
    startCreate,
    cancelCreate,
    cancelEdit,
    updateForm,
    setDeleteId
  } = useAuthors();

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
          <h2 className="text-xl font-semibold mb-2">Authors</h2>
          <button className="px-4 py-2 bg-[#234C6A] text-white rounded-lg shadow-sm hover:shadow-md hover:bg-[#1d3f58] transition" onClick={startCreate}>
            Create
          </button>
      </div>

      {loading && <AuthorSkeleton count={5} />}
      {!loading && authors.length === 0 && <div className="text-gray-500">No authors yet</div>}
      {!loading && authors.length > 0 && (
        <ul className="space-y-2">
          {authors.map(author =>(
            <ListItem
              key={author.id}
              id={author.id}
              onEdit={() => startEdit(author)}
              onDelete={setDeleteId}
              editLabel={`Edit ${author.name}`}
              deleteLabel={`Delete ${author.name}`}
            >
              <AuthorContent author={author} />
            </ListItem>
          ))}
        </ul>
      )}

      <CreateModal
        open={isCreating}
        onClose={cancelCreate}
        onSubmit={submit}
        title="Create Author"
      >
        <AuthorForm
          name={form.name}
          bio={form.bio}
          onNameChange={(name) => updateForm({name})}
          onBioChange={(bio) => updateForm({bio})}
        />
      </CreateModal>

      <EditModal
        open={!!editing}
        onClose={cancelEdit}
        onSubmit={submit}
        title="Edit Author"
      >
        <AuthorForm
          name={form.name}
          bio={form.bio}
          onNameChange={(name) => updateForm({name})}
          onBioChange={(bio) => updateForm({bio})}
        />
      </EditModal>

      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => remove(deleteId)}
        title="Delete Author"
        itemName={authors.find(a => a.id === deleteId)?.name}
      />

    </div>
  );
}