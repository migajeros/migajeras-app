// pages/migajeras.js
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import UploadForm from '../components/UploadForm'
import TextForm   from '../components/TextForm'
import Gallery    from '../components/Gallery'
import { useWallet } from '@thirdweb-dev/react'

// wallet y supresión de SSR para el botón
const ConnectWalletNoSSR = dynamic(
  () => import('@thirdweb-dev/react').then(m => m.ConnectWallet),
  { ssr: false }
)

export default function Migajeras() {
  const { address } = useWallet()
  const [posts, setPosts] = useState([])

  // 1) carga posts al montar
  useEffect(() => {
    fetch('/api/get-posts')
      .then(r => r.json())
      .then(j => setPosts(j.posts))
  }, [])

  // 2) recibo URLs del upload
  const handleUpload = attachments => {
    sessionStorage.setItem('lastAttachments', JSON.stringify(attachments))
    alert('Imágenes listas: ahora escribe tu texto.')
  }

  // 3) cuando envían texto, llamo a /api/posts
  const handleText = async text => {
    const attachments = JSON.parse(sessionStorage.getItem('lastAttachments')||'[]')
    const res = await fetch('/api/posts',{
      method: 'POST',
      body: JSON.stringify({
        userId: address,
        text,
        attachments
      })
    })
    const j = await res.json()
    if (j.error) return alert(j.error)
    // añado al estado inmediatamente
    setPosts([{ ...j.post, attachments }, ...posts])
    alert('Publicado!')
  }

  return (
    <div style={{ padding: 20 }}>
      <header><ConnectWalletNoSSR /></header>
      <h1>Cuenta tu Migajera</h1>
      {!address && <p>Por favor conecta tu wallet.</p>}
      {address && (
        <>
          <UploadForm onUpload={handleUpload} />
          <TextForm   onSubmit={handleText} />
          <hr style={{ margin: '24px 0' }} />
          <Gallery posts={posts} />
        </>
      )}
    </div>
  )
}
