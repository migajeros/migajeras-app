// components/UploadForm.js
import { useState } from 'react'
import dynamic from 'next/dynamic'
const ConnectWalletNoSSR = dynamic(
  () => import('@thirdweb-dev/react').then(m => m.ConnectWallet),
  { ssr: false }
)

export default function UploadForm() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
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
      <header><ConnectWalletNoSSR /></header>
      <input type="file" onChange={handleFile} />
      {preview && (
        file.type.startsWith('image')
          ? <img src={preview} style={{ maxWidth: 300 }} />
          : <audio src={preview} controls />
      )}
      <button onClick={upload} disabled={uploading}>
        {uploading ? 'Subiendo…' : 'Upload'}
      </button>
    </div>
  )
}
