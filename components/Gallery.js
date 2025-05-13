// components/Gallery.js
import useSWR from 'swr'

export default function Gallery() {
  const fetcher = async () => {
    const res = await fetch('/api/get-posts')
    const { posts } = await res.json()
    return posts
  }
  const { data: posts, error } = useSWR('posts-list', fetcher)

  if (error) return <p>Error cargando posts</p>
  if (!posts) return <p>Cargando…</p>
  if (!posts.length) return <p>No hay publicaciones aún</p>

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))',
      gap: 16,
      padding: 20
    }}>
      {posts.map(p => (
        <div key={p.id} style={{
          border: '1px solid #ccc', borderRadius: 8,
          padding: 12, background: '#fff'
        }}>
          {p.attachments.map((url,i) =>
            <img
              key={i}
              src={url}
              alt={`Adjunto ${i+1}`}
              style={{ width: '100%', marginBottom: 8, borderRadius: 4 }}
            />
          )}
          <p style={{ fontSize: 14, lineHeight: 1.4 }}>{p.content}</p>
          <small style={{ color: '#666' }}>
            {new Date(p.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  )
}
