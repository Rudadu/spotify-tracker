const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://khxehrfuhrjmvehvprfu.supabase.co/rest/v1/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoeGVocmZ1aHJqbXZlaHZwcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY0OTAxMywiZXhwIjoyMDk0MjI1MDEzfQ.no_4XBIcQJ_IYSprcw2m48De5nAVa6w45G3B2pd_ypM'
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
      path.join(folderPath, file)
    )

    const data = JSON.parse(raw)

    const formatted = data.map(item => ({
      ts: item.ts,
      track_name: item.master_metadata_track_name,
      artist_name:
        item.master_metadata_album_artist_name,
      album_name:
        item.master_metadata_album_album_name,
      ms_played: item.ms_played
    }))

    const { error } = await supabase
      .from('streams')
      .insert(formatted)

    if (error) {
      console.log(error)
    } else {
      console.log(`${file} imported`)
    }
  }

  console.log('ALL DONE')
}

run()