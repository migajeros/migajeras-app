// pages/api/upload.js
import formidable from 'formidable'
import { supabase } from '../../lib/supabaseClient'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const form = new formidable.IncomingForm()
  form.multiples = true    // si quieres admitir varios archivos

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message })

    // normaliza a array
    const fileArray = Array.isArray(files.file)
      ? files.file
      : [files.file]

    const urls = []
    for (const file of fileArray) {
      const path = `migajeras/${Date.now()}_${file.originalFilename}`
      const { data: up, error: upErr } = await supabase
        .storage
        .from('media')
        .upload(path, file.filepath, { contentType: file.mimetype })
      if (upErr) return res.status(500).json({ error: upErr.message })

      const { publicURL } = supabase
        .storage
        .from('media')
        .getPublicUrl(up.path)
      urls.push(publicURL)
    }

    res.status(200).json({ urls })
  })
}
