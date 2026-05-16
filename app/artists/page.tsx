export const dynamic = 'force-dynamic'

import { supabase } from '@/src/lib/supabase'
import ArtistsPage from '@/components/ArtistsPage'

export default async function Page() {

  const { data } = await supabase
    .from('streams')
    .select('*')
    .limit(100000)

  return (
    <ArtistsPage data={data || []} />
  )
}