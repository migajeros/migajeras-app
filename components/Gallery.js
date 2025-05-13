// components/Gallery.js
import useSWR from 'swr'
import { supabase } from '../lib/supabaseClient'

export default function Gallery() {
  const fetcher = async () => {
    const { data } = await supabase.storage.from('media').list('migajeras', { limit: 100 })
    return data.map(f => supabase.storage.from('media').getPublicUrl(f.name).publicURL)
  }
  const { data: urls, error } = useSWR('media-list', fetcher)
  if (error) return <p>Error cargando galería</p>
  if (!urls) return <p>Cargando…</p>
  return (
    <div style={{ padding: 20, display:'flex', gap:10, flexWrap:'wrap' }}>
      {urls.map((u,i) =>
        u.match(/\.(mp3|wav)$/i)
          ? <audio key={i} src={u} controls style={{ width:200 }} />
          : <img key={i} src={u} style={{ maxWidth:200 }} />
      )}
    </div>
  )
}
