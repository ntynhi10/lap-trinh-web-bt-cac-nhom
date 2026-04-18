'use client'

export default function NoteList({ notes, deleteNote }) {
  return (
    <div className="space-y-4">
      {notes.map(note => (
        <div
          key={note.id}
          className="flex justify-between items-center 
          p-4 rounded-xl 
          bg-white/5 border border-white/10 
          backdrop-blur-md 
          shadow-lg hover:scale-[1.01] transition"
        >
          <div>
            <p className="font-medium text-white">{note.text}</p>
            <p className="text-sm text-gray-400 mt-1">{note.time}</p>
          </div>

          <button
            onClick={() => deleteNote(note.id)}
            className="bg-red-500/20 text-red-300 px-3 py-1 rounded-lg 
            hover:bg-red-500/40"
          >
            Xóa
          </button>
        </div>
      ))}
    </div>
  )
}