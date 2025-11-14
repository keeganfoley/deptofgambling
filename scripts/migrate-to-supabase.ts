import { supabase } from '../lib/supabase'
import fs from 'fs'
import path from 'path'

async function migrateBets() {
  console.log('🚀 Starting migration to Supabase...')

  // Read bets.json
  const betsPath = path.join(process.cwd(), 'data/bets.json')
  const bets = JSON.parse(fs.readFileSync(betsPath, 'utf-8'))

  console.log(`📊 Found ${bets.length} bets to migrate`)

  // Transform data to match Supabase schema
  const transformedBets = bets.map((bet: any) => ({
    game_id: bet.slug || `bet-${bet.id}`,
    date_placed: bet.date,
    sport: bet.sport,
    bet_type: bet.betType,
    pick: bet.description,
    odds_at_placement: bet.odds.toString(),
    units: bet.stake,
    reasoning: bet.finalStat,
    result: bet.result,
    profit_loss: bet.profit,
    sportsbook: 'FanDuel', // Default, adjust if you track this
  }))

  // Insert into Supabase
  const { data, error } = await supabase
    .from('bets')
    .insert(transformedBets)

  if (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }

  console.log('✅ Migration complete!')
  console.log(`✅ Successfully migrated ${bets.length} bets to Supabase`)

  // Verify
  const { count } = await supabase
    .from('bets')
    .select('*', { count: 'exact', head: true })

  console.log(`📈 Total bets in database: ${count}`)
}

migrateBets()
