// pages/api/posts.js
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { userId, text, attachments } = JSON.parse(req.body)
  const words = text.trim().split(/\s+/).length

  if (words > 500) {
    return res.status(400).json({ error: 'Máximo 500 palabras.' })
  }

  // Fecha de hoy (UTC)
  const start = new Date()
  start.setUTCHours(0,0,0,0)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate()+1)

  // Cuenta posts de este usuario hoy
  const { count, error: errCount } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString())

  if (errCount) return res.status(500).json({ error: errCount.message })
  if (count >= 10) {
    return res.status(400).json({ error: 'Has superado 10 publicaciones hoy.' })
  }

  // Inserta
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      user_id: userId,
      content: text,
      word_count: words,
      attachments
    }])

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ post: data[0] })
}
