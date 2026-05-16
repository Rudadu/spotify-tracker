import axios from 'axios'

export async function getAlbumCover(
  track: string,
  artist: string
) {
  try {

    const query =
      `${track} ${artist}`

    const url =
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`

    const response = await axios.get(url)

    const results = response.data.results

    if (!results.length)
      return null

    // Try to find best artist match
    const bestMatch = results.find((song: any) =>
      song.artistName
        ?.toLowerCase()
        .includes(artist.toLowerCase())
    )

    const image =
      bestMatch?.artworkUrl100 ||
      results[0]?.artworkUrl100

    // Higher quality image
    return image?.replace(
      '100x100',
      '300x300'
    )

  } catch {
    return null
  }
}