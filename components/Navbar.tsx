import Link from 'next/link'

export default function Navbar() {

  return (

    <nav
      className="
        bg-zinc-950
        border-b
        border-zinc-800
        px-8
        py-5
        flex
        items-center
        justify-between
      "
    >

      <h1 className="text-2xl font-bold text-green-400">
        Spotify Tracker
      </h1>

      <div className="flex gap-6 text-lg">

        <Link
          href="/"
          className="
            hover:text-green-400
            transition
          "
        >
          Tracks
        </Link>

        <Link
          href="/artists"
          className="
            hover:text-green-400
            transition
          "
        >
          Artists
        </Link>

      </div>

    </nav>
  )
}