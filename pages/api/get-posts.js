// pages/api/get-posts.js
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, content, attachments, created_at')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ posts })
}
