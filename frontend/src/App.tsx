import React from 'react'
import AuthorsPanel from './views/AuthorsPanel'
import BooksPanel from './views/BooksPanel'
import { ToastContainer } from 'react-toastify'

export default function App(){
  return (
    <div className="container">
      <header className="mb-6">
        <h1 className="text-4xl font-bold">Book Club</h1>
        <p className="text-gray-600">Manage authors and books — built with Prisma & Fastify</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card"><AuthorsPanel /></div>
        <div className="card"><BooksPanel /></div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
