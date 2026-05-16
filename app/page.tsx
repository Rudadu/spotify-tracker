export const dynamic = 'force-dynamic'
import { supabase } from '@/src/lib/supabase'

export default async function Home() {

  const { data } = await supabase
    .from('streams')
    .select('track_name, artist_name, ms_played', {
      count: 'exact'
    })
    .limit(100000)
  
  console.log('TOTAL ROWS:', data?.length)

  const counts: any = {}

  data?.forEach((song) => {

    if (!song.track_name || !song.artist_name)
      return

    // Only count listens longer than 30s
    if (song.ms_played < 30000)
      return

    // Normalize for matching
    const normalizedTrack =
      song.track_name.trim().toLowerCase()

    const normalizedArtist =
      song.artist_name.trim().toLowerCase()

    const key =
      `${normalizedTrack}|||${normalizedArtist}`

    // Create entry if doesn't exist
    if (!counts[key]) {
      counts[key] = {
        track: song.track_name.trim(),
        artist: song.artist_name.trim(),
        plays: 0,
      }
    }

    // Increase play count
    counts[key].plays += 1
  })

  const sorted = Object.values(counts)
    .sort((a: any, b: any) => b.plays - a.plays)
    .slice(0, 20)

  return (
    <main className="min-h-screen bg-black text-white p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          My Top Tracks
        </h1>

        <p className="text-gray-400 mb-10">
          Spotify listening analytics
        </p>

        <div className="grid gap-4">

          {sorted.map((track: any, i) => (

            <div
              key={i}
              className="
                bg-zinc-900
                hover:bg-zinc-800
                transition
                rounded-2xl
                p-5
                flex
                items-center
                justify-between
                border
                border-zinc-800
              "
            >

              <div className="flex items-center gap-5">

                <div
                  className="
                    text-2xl
                    font-bold
                    text-green-400
                    w-12
                  "
                >
                  #{i + 1}
                </div>

                <div>

                  <h2 className="text-xl font-semibold">
                    {track.track}
                  </h2>

                  <p className="text-gray-400">
                    {track.artist}
                  </p>

                </div>
              </div>

              <div
                className="
                  bg-green-500/20
                  text-green-400
                  px-4
                  py-2
                  rounded-full
                  font-medium
                "
              >
                {track.plays} plays
              </div>

            </div>
          ))}

        </div>

      </div>

    </main>
  )
}