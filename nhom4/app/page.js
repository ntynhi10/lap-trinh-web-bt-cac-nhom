'use client'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'

export default function Home() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('notes')) || []
    setNotes(data)
  }, [])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 
      bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617]">

      <div className="w-full max-w-2xl px-4">
        <Header count={notes.length} />
        <NoteForm setNotes={setNotes} />
        <NoteList notes={notes} deleteNote={deleteNote} />
      </div>
    </div>
  )
}