# Department of Gambling

**Quantitative Sports Research & Portfolio Management**

A sophisticated, data-driven sports betting portfolio tracker with a unique aesthetic inspired by government documents and modern technical design.

![Department of Gambling](public/seal.svg)

## 🎯 Features

### Portfolio Management
- **Live Portfolio Status**: Real-time balance, P/L, ROI tracking
- **Performance Analytics**: Sharpe Ratio, Kelly Criterion, Closing Line Value
- **Sport-by-Sport Breakdown**: NBA, NFL performance metrics
- **Bet Type Analysis**: Props, Spreads, Totals performance comparison
- **Recent Positions Timeline**: Detailed bet history with EV calculations
- **Portfolio Growth Chart**: Interactive Chart.js visualization

### Design Philosophy

This project merges two distinct aesthetics:

**Prompt A - Electric Utilitarianism**
- Grid-based architectural spatial system
- Stark monochrome foundation (Navy, Steel Blue, Off-white)
- Single electric accent color (Magenta #FF0080)
- Engineered, geometric typography
- Sharp, decisive, magnetic motion
- Controlled intelligence and data-vault confidence

**Prompt B - Financial Credibility**
- Government document aesthetic with horizontal rules
- Professional financial terminology (Sharpe, Kelly, CLV)
- Transparent bet tracking with all results visible
- Systematic, data-driven presentation
- Quantitative analysis focus

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to
http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
department-of-gambling/
├── app/
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── page.tsx            # Main portfolio page
│   └── globals.css         # Tailwind + custom styles
├── components/
│   ├── Hero.tsx            # Hero section with seal & title
│   ├── PortfolioStatus.tsx # Main stats dashboard
│   ├── SportBreakdown.tsx  # NBA/NFL performance cards
│   ├── BetTypeBreakdown.tsx # Props/Spreads/Totals analysis
│   ├── RecentBets.tsx      # Bet history timeline
│   ├── QuantitativeMetrics.tsx # Advanced statistics
│   ├── PortfolioChart.tsx  # Growth chart
│   └── Footer.tsx          # Footer with links
├── data/
│   ├── portfolio.json      # Portfolio summary data
│   ├── bets.json           # Individual bet records
│   ├── metrics.json        # Advanced metrics & breakdowns
│   └── chartData.json      # Historical balance data
├── lib/
│   └── utils.ts            # Helper functions & formatters
└── public/
    └── seal.svg            # Government seal logo
```

## 🎨 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animation**: GSAP with ScrollTrigger
- **Charts**: Chart.js with react-chartjs-2
- **Data**: Mock JSON (ready for API integration)

## 🎨 Design System

### Color Palette

```css
Primary Navy:     #0A1F44
Steel Blue:       #4A90E2
Light Blue:       #7CB9E8
Electric Magenta: #FF0080  /* Accent */
Success Green:    #2ECC71
Loss Red:         #E74C3C
Background:       #F8F9FA
Text:             #2C3E50
```

### Typography

- **Headers**: Inter (Geometric Sans-Serif), 700-900 weight
- **Body**: Inter, 400-600 weight
- **Numbers**: Courier New (Monospace) for data credibility

### Animation Principles

- **Hero**: Seal fade-in, line drawing from center, text reveals
- **Cards**: Staggered slide-in from left/bottom/right
- **Numbers**: Count-up animation for statistics
- **Chart**: Line draws from left to right
- **Scroll**: GSAP ScrollTrigger reveals

## 📊 Data Structure

### Portfolio Data (`data/portfolio.json`)
```json
{
  "balance": 11247.83,
  "startingBalance": 10000.00,
  "netPL": 1247.83,
  "roi": 12.48,
  "record": { "wins": 31, "losses": 17 },
  "winRate": 64.6,
  "unitsWon": 12.48
}
```

### Bet Data (`data/bets.json`)
```json
[
  {
    "id": 1,
    "date": "2025-11-05T20:00:00.000Z",
    "sport": "NBA",
    "description": "Wembanyama O12.5 rebounds",
    "odds": -114,
    "stake": 1.0,
    "result": "win",
    "edge": 14,
    "expectedValue": 25.2,
    "profit": 87.72
  }
]
```

## 🔮 Future Enhancements

### Planned Features
- [ ] Google Sheets API integration for live data
- [ ] User authentication & multiple portfolios
- [ ] Advanced filtering & search
- [ ] Export to CSV/PDF
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Real-time odds comparison
- [ ] Machine learning predictions

### Integration Ready
The codebase is structured to easily swap mock JSON data with:
- Google Sheets API
- REST API endpoints
- GraphQL
- Real-time WebSocket feeds

## 📱 Responsive Design

- **Desktop**: Full multi-column layout with animations
- **Tablet**: Stacked cards, simplified chart
- **Mobile**: Single column, touch-friendly, collapsible sections

## 🧪 Development

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Format code
npx prettier --write .
```

## 📄 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

- Design inspired by Uniswap Cup aesthetic
- Built with Next.js, Tailwind, and GSAP
- Powered by quantitative analysis and data transparency

---

**DEPARTMENT OF GAMBLING**
*Office of Odds & Wagers*

"Systematic. Transparent. Mathematically Driven."
