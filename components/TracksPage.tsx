'use client'

import {
  useState,
  useMemo,
  useEffect
} from 'react'

import { getAlbumCover } from '@/src/lib/spotify'

export default function TracksPage({
  data,
}: any) {

  const [selectedYear, setSelectedYear] =
    useState('All Time')

  const [tracksWithImages, setTracksWithImages] =
    useState<any[]>([]) 

  const years = [
    'All Time',
    ...new Set(
      data.map((song: any) =>
        new Date(song.ts)
          .getFullYear()
          .toString()
      )
    )
  ].sort().reverse()

  const filteredData = useMemo(() => {

    if (selectedYear === 'All Time')
      return data

    return data.filter((song: any) =>
      new Date(song.ts)
        .getFullYear()
        .toString() === selectedYear
    )

  }, [data, selectedYear])

  const totalStreams = filteredData.filter(
    (song: any) => song.ms_played >= 30000
  ).length

  const totalMinutes = Math.floor(
    filteredData.reduce(
        (sum: number, song: any) =>
            sum + song.ms_played,
        0
    ) / 1000 / 60
  )

  const totalHours =
    (totalMinutes / 60).toFixed(1)

  const uniqueArtists = new Set(
    filteredData.map(
        (song: any) => song.artist_name
    )
  ).size

  const counts: any = {}

  filteredData.forEach((song: any) => {

    if (!song.track_name || !song.artist_name)
      return

    if (song.ms_played < 30000)
      return

    const normalizedTrack =
      song.track_name.trim().toLowerCase()

    const normalizedArtist =
      song.artist_name.trim().toLowerCase()

    const key =
      `${normalizedTrack}|||${normalizedArtist}`

    if (!counts[key]) {
      counts[key] = {
        track: song.track_name.trim(),
        artist: song.artist_name.trim(),
        plays: 0,
      }
    }

    counts[key].plays += 1
  })

  const sorted = Object.values(counts)
    .sort((a: any, b: any) => b.plays - a.plays)
    .slice(0, 20)

  useEffect(() => {

    async function loadImages() {

        const withImages = await Promise.all(
            sorted.map(async (track: any) => ({
                ...track,
                image: await getAlbumCover(
                    track.track,
                    track.artist
                )
            }))
        )

        setTracksWithImages(withImages)
    }

    loadImages()

  }, [selectedYear])

  return (
    <main className="min-h-screen bg-black text-white p-8">

      <div className="max-w-4xl mx-auto">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-10
        ">

          <div>
            <h1 className="text-5xl font-bold mb-2">
              My Top Tracks
            </h1>

            <p className="text-gray-400">
              Spotify listening analytics
            </p>
          </div>

          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(e.target.value)
            }
            className="
              bg-zinc-900
              border
              border-zinc-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          >
            {years.map((year: any) => (
              <option key={year}>
                {year}
              </option>
            ))}
          </select>

        </div>

        <div className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            mb-10
        ">

            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <p className="text-gray-400 text-sm">
                    Total Streams
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {totalStreams.toLocaleString('en-US')}
                </h2>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <p className="text-gray-400 text-sm">
                    Listening Hours
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {totalHours}
                </h2>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <p className="text-gray-400 text-sm">
                    Unique Tracks
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {Object.keys(counts).length.toLocaleString('en-US')}
                </h2>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <p className="text-gray-400 text-sm">
                    Unique Artists
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {uniqueArtists.toLocaleString('en-US')}
                </h2>
            </div>

        </div>

        <div className="grid gap-4">

          {tracksWithImages.map((track: any, i) => (

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

                {track.image && (
                    <img
                        src={track.image}
                        alt={track.track}
                        className="
                            w-16
                            h-16
                            rounded-xl
                            object-cover
                        "
                    />
                )}

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