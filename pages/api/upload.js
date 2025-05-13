// pages/api/upload.js
import { IncomingForm } from 'formidable'
import { supabase } from '../../lib/supabaseClient'

export const config = {
  api: { bodyParser: false }  // ya lo tenías bien
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const form = new IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message })

    // formidable guarda el fichero en `files.file`
    const file = files.file
    const filePath = `migajeras/${Date.now()}_${file.originalFilename}`

    // 1) súbelo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('media')
      .upload(filePath, file.filepath, { contentType: file.mimetype })

    if (uploadError) return res.status(500).json({ error: uploadError.message })

    // 2) genera la URL pública
    const { data: publicData, error: publicError } = supabase
      .storage
      .from('media')
      .getPublicUrl(uploadData.path)

    if (publicError) return res.status(500).json({ error: publicError.message })

    // 3) devuelve la URL
    return res.status(200).json({ url: publicData.publicUrl })
  })
}
