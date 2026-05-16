require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  const folderPath = './spotify-data'

  const files = fs.readdirSync(folderPath)

  const jsonFiles = files.filter(file =>
    file.endsWith('.json')
  )

  for (const file of jsonFiles) {
    console.log(`Importing ${file}...`)

    const raw = fs.readFileSync(
      path.join(folderPath, file),
      'utf8'
    )

    const data = JSON.parse(raw)

    for (const item of data) {
      const { error } = await supabase
        .from('streams')
        .insert({
          ts: item.ts,
          track_name:
            item.master_metadata_track_name,
          artist_name:
            item.master_metadata_album_artist_name,
          album_name:
            item.master_metadata_album_album_name,
          ms_played: item.ms_played
        })

      if (error) {
        console.log(error)
      }
    }

    console.log(`${file} imported`)
  }

  console.log('ALL DONE')
}

run()