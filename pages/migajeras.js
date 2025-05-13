// pages/migajeras.js
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Carga el ConnectWallet sólo en cliente (sin SSR)
const ConnectWalletNoSSR = dynamic(
  () => import('@thirdweb-dev/react').then(mod => mod.ConnectWallet),
  { ssr: false }
)

export default function Migajeras() {
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFile = e => {
    const f = e.target.files[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const upload = async () => {
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    setPreview(url)
    setUploading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <header>
        <ConnectWalletNoSSR />
      </header>

      <h1>Comparte tu Migajera</h1>

      <input
        type="file"
        accept="image/*,audio/*"
        onChange={handleFile}
      />

      {preview && (
        file.type.startsWith('image')
          ? <img src={preview} alt="preview" style={{ maxWidth: 300 }} />
          : <audio src={preview} controls />
      )}

      <button onClick={upload} disabled={uploading}>
        {uploading ? 'Subiendo…' : 'Upload'}
      </button>
    </div>
  )
}
