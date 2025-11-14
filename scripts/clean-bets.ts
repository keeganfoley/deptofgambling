import fs from 'fs'
import path from 'path'

const betsPath = path.join(process.cwd(), 'data/bets.json')
const bets = JSON.parse(fs.readFileSync(betsPath, 'utf-8'))

console.log(`Total bets before cleaning: ${bets.length}`)

// Sort by date (newest first) and take the most recent 45
const recentBets = bets
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 45)

console.log(`Keeping most recent 45 bets`)
console.log(`Date range: ${recentBets[recentBets.length - 1].date} to ${recentBets[0].date}`)

// Save back to file
fs.writeFileSync(betsPath, JSON.stringify(recentBets, null, 2))

console.log('✅ Cleaned bets.json - ready for migration!')
