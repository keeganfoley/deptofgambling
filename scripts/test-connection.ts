import { supabase } from '../lib/supabase'

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
    } else {
      console.log('✅ Connection successful!')
      console.log('Current bets in database:', data?.length || 0)
    }
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

testConnection()