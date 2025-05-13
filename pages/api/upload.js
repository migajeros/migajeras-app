// pages/api/upload.js
import { supabase } from '../../lib/supabaseClient'
import { IncomingForm } from 'formidable'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const form = new IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message })

    const file = files.file
    const filePath = `migajeras/${Date.now()}_${file.originalFilename}`

    // Sube a Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('media')
      .upload(filePath, file.filepath, { contentType: file.mimetype })

    if (error) return res.status(500).json({ error: error.message })

    // Obtén URL pública
    const { publicURL } = supabase
      .storage
      .from('media')
      .getPublicUrl(data.Key)

    res.status(200).json({ url: publicURL })
  })
}
