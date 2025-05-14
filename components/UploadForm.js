// components/UploadForm.js
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Cargamos el botón de wallet solo en cliente
const ConnectWalletNoSSR = dynamic(
  () => import('@thirdweb-dev/react').then(m => m.ConnectWallet),
  { ssr: false }
)

export default function UploadForm({ onUpload }) {
  const [files, setFiles]         = useState([])
  const [previews, setPreviews]   = useState([])
  const [error, setError]         = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFiles = e => {
    const sel = Array.from(e.target.files)
    if (sel.length > 2) {
      setError('Máximo 2 archivos.')
      return
    }
    const totalSize = sel.reduce((sum, f) => sum + f.size, 0)
    if (totalSize > 5 * 1024 * 1024) {
      setError('Total mayor a 5 MB.')
      return
    }
    setError('')
    setFiles(sel)
    setPreviews(sel.map(f => URL.createObjectURL(f)))
  }

  const upload = async () => {
    if (!files.length) return
    setUploading(true)

    const fd = new FormData()
    files.forEach(f => fd.append('file', f))

    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { urls, error: upErr } = await res.json()
    setUploading(false)

    if (upErr) {
      setError(upErr)
    } else {
      onUpload(urls)   // recibes el array de URLs subidas
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <header><ConnectWalletNoSSR /></header>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      <div style={{ display: 'flex', gap: 10, margin: '10px 0' }}>
        {previews.map((p, i) => (
          <img
            key={i}
            src={p}
            alt={`Preview ${i+1}`}
            style={{ maxWidth: 100, borderRadius: 4 }}
          />
        ))}
      </div>

      <button
        onClick={upload}
        disabled={uploading || files.length === 0}
      >
        {uploading ? 'Subiendo…' : 'Subir Imágenes'}
      </button>
    </div>
  )
}
