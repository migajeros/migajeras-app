import { useEffect, useState } from 'react'
import UploadForm from './UploadForm'
import TextForm from './TextForm'
import Gallery from './Gallery'
import { useWallet } from '@thirdweb-dev/react'

export default function MigajerasPage() {
  const { address } = useWallet()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/get-posts')
      .then(r => r.json())
      .then(j => setPosts(j.posts))
  }, [])

  const handleUpload = attachments => {
    sessionStorage.setItem('lastAttachments', JSON.stringify(attachments))
    alert('Imágenes listas: ahora escribe tu texto.')
  }

  const handleText = async text => {
    const attachments = JSON.parse(sessionStorage.getItem('lastAttachments')||'[]')
    const res = await fetch('/api/posts',{
      method: 'POST',
      body: JSON.stringify({ userId: address, text, attachments })
    })
    const j = await res.json()
    if (j.error) return alert(j.error)
    setPosts([{ ...j.post, attachments }, ...posts])
    alert('¡Publicado!')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Cuenta tu Migajera</h1>
      {!address && <p>Por favor conecta tu wallet.</p>}
      {address && (
        <>
          <UploadForm onUpload={handleUpload} />
          <TextForm  onSubmit={handleText} />
          <hr style={{ margin: '24px 0' }} />
          <Gallery posts={posts} />
        </>
      )}
    </div>
  )
}
