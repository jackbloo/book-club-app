import React from 'react';
import CreateModal from '../components/CreateModal';
import EditModal from '../components/EditModal';
import DeleteModal from '../components/DeleteModal';
import ListItem from '../components/ListItem';
import BookContent from '../components/BookContent';
import BookForm from '../components/BookForm';
import BookSkeleton from '../components/BookSkeleton';
import { useBooks } from '../hooks/useBooks';

export default function BooksPanel(){
  const {
    books,
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
  } = useBooks();
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className="text-xl font-semibold mb-2">Books</h2>
        <button className="px-4 py-2 bg-[#00361A] text-white rounded-lg shadow-sm hover:shadow-md hover:bg-[#002c15] transition" onClick={startCreate}>
          Create
        </button>
      </div>
      {loading && <BookSkeleton count={5} />}
      {!loading && books.length === 0 && <div className="text-gray-500">No books yet</div>}
      {!loading && books.length > 0 && (
        <ul className="space-y-2">
          {books.map(book => (
            <ListItem
              key={book.id}
              id={book.id}
              onEdit={() => startEdit(book)}
              onDelete={setDeleteId}
              editLabel={`Edit ${book.title}`}
              deleteLabel={`Delete ${book.title}`}
            >
              <BookContent book={book} />
            </ListItem>
          ))}
        </ul>
      )}

      <CreateModal
        open={isCreating}
        onClose={cancelCreate}
        onSubmit={submit}
        title="Create Book"
      >
        <BookForm
          title={form.title}
          authorId={form.authorId}
          publishedYear={form.publishedYear}
          description={form.description}
          authors={authors}
          onTitleChange={(title) => updateForm({title})}
          onAuthorIdChange={(author_id) => updateForm({author_id})}
          onPublishedYearChange={(publishedYear) => updateForm({publishedYear})}
          onDescriptionChange={(description) => updateForm({description})}
        />
      </CreateModal>

      <EditModal
        open={!!editing}
        onClose={cancelEdit}
        onSubmit={submit}
        title="Edit Book"
      >
        <BookForm
          title={form.title}
          authorId={form.author_id || editing?.authorId}
          publishedYear={form.publishedYear}
          description={form.description}
          authors={authors}
          onTitleChange={(title) => updateForm({title})}
          onAuthorIdChange={(author_id) => updateForm({author_id})}
          onPublishedYearChange={(publishedYear) => updateForm({publishedYear})}
          onDescriptionChange={(description) => updateForm({description})}
        />
      </EditModal>

      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => remove(deleteId)}
        title="Delete Book"
        itemName={books.find(b => b.id === deleteId)?.title}
      />
    </div>
  );
}
