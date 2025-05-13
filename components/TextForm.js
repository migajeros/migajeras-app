// components/TextForm.js
import { useState } from 'react'

export default function TextForm({ onSubmit }) {
  const [text, setText] = useState('')
  const words = text.trim().split(/\s+/).filter(Boolean).length

  const handleChange = e => {
    const w = e.target.value.trim().split(/\s+/).filter(Boolean).length
    if (w > 500) return
    setText(e.target.value)
  }

  return (
    <div style={{ margin: 20 }}>
      <textarea
        rows={6}
        style={{ width: '100%' }}
        value={text}
        onChange={handleChange}
        placeholder="Escribe hasta 500 palabras…"
      />
      <p>{words} / 500 palabras</p>
      <button onClick={() => onSubmit(text)} disabled={!text}>
        Publicar Texto
      </button>
    </div>
  )
}
