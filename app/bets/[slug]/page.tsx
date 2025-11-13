import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatDate, formatOdds } from '@/lib/utils';

interface BetAnalysis {
  slug: string;
  player?: string;
  team?: string;
  line: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss';
  finalStat: string;
  profit: number;
  gameDetails: {
    matchup: string;
    date: string;
    gameTime: string;
    venue: string;
    finalScore: string;
  };
  preGameAnalysis: {
    edge: number;
    expectedValue: number;
    estimatedProbability: number;
    impliedProbability: number;
    recentPerformance: {
      hitRate: string;
      seasonAverage?: string;
      last3Games?: string;
      last5Games?: string;
      homeRecord?: string;
      recentForm?: string;
      cushion: string;
    };
    keyFactors: Array<{
      title: string;
      description: string;
    }>;
    riskFactors: string[];
  };
  gameResults: {
    playerStats?: Record<string, string | number>;
    teamStats?: Record<string, string | number>;
    keyPlayers?: Record<string, any>;
    quarterBreakdown: Array<{
      quarter: string;
      score?: string;
      points?: number;
      description: string;
      estimatedPoints?: string;
      estimatedRebounds?: string;
      halftimeTotal?: string;
    }>;
    whenCleared?: string;
    whenMissed?: string;
    turningPoint?: string;
    gamePace: string;
    teamOffense?: string;
    foulTrouble?: string;
  };
  postGameAnalysis: {
    whatWentRight?: Array<{
      title: string;
      description: string;
    }>;
    whatWentWrong?: Array<{
      title: string;
      description: string;
    }>;
    statisticalContext: {
      vsSeasonAverage: string;
      vsRecentForm: string;
      vsPropLine: string;
      percentileRanking: string;
    };
    wasNormalVariance?: string;
  };
  closingLineValue: {
    ourOdds: number;
    closingOdds: number;
    clvCents: number;
    clvPercentage: number;
    verdict: string;
  };
  keyTakeaways: string[];
  wouldBetAgain: boolean;
  verdict?: string;
}

async function getBetAnalysis(slug: string): Promise<BetAnalysis | null> {
  try {
    const analysis = await import(`@/data/bet-analysis/${slug}.json`);
    return analysis.default;
  } catch (error) {
    return null;
  }
}

export default async function BetDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const analysis = await getBetAnalysis(params.slug);

  if (!analysis) {
    notFound();
  }

  const isWin = analysis.result === 'win';

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-steel hover:text-accent transition-colors mb-8"
        >
          <span>←</span>
          <span>Back to Portfolio</span>
        </Link>

        {/* Header Card */}
        <div className={`card-float p-6 sm:p-8 mb-8 border-l-4 ${isWin ? 'border-success' : 'border-loss'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                {analysis.player || analysis.team} {analysis.line}
              </h1>
              <p className="text-steel text-base sm:text-lg">
                {analysis.gameDetails.matchup} • {formatDate(analysis.gameDetails.date)}
              </p>
            </div>
            <div className={`text-left sm:text-right ${isWin ? 'text-success' : 'text-loss'}`}>
              <div className="text-3xl sm:text-4xl font-bold mb-1">
                {isWin ? '✅ HIT' : '❌ MISS'}
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                {formatCurrency(analysis.profit, true)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <div className="data-label">Final Result</div>
              <div className="data-value">{analysis.finalStat}</div>
            </div>
            <div>
              <div className="data-label">Odds</div>
              <div className="data-value">{formatOdds(analysis.odds)}</div>
            </div>
            <div>
              <div className="data-label">Stake</div>
              <div className="data-value">{analysis.stake}u</div>
            </div>
            <div>
              <div className="data-label">Risk/Win</div>
              <div className="data-value">
                {formatCurrency(analysis.stake * Math.abs(analysis.odds) / 100)}
              </div>
            </div>
          </div>
        </div>

        {/* Pre-Game Analysis */}
        <section className="card-float p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 pb-3 border-b border-gray-200">
            📊 Pre-Game Analysis
          </h2>

          {/* Edge Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <div className="data-label">Edge</div>
              <div className="data-value text-accent">
                +{analysis.preGameAnalysis.edge}%
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="data-label">Expected Value</div>
              <div className="data-value text-accent">
                +{analysis.preGameAnalysis.expectedValue}%
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="data-label">True Probability</div>
              <div className="data-value">{analysis.preGameAnalysis.estimatedProbability}%</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="data-label">Implied Probability</div>
              <div className="data-value">{analysis.preGameAnalysis.impliedProbability.toFixed(2)}%</div>
            </div>
          </div>

          {/* Recent Performance */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="data-label">Hit Rate</div>
                <div className="text-sm text-gray-700">{analysis.preGameAnalysis.recentPerformance.hitRate}</div>
              </div>
              {analysis.preGameAnalysis.recentPerformance.seasonAverage && (
                <div>
                  <div className="data-label">Season Average</div>
                  <div className="text-sm text-gray-700">{analysis.preGameAnalysis.recentPerformance.seasonAverage}</div>
                </div>
              )}
              {analysis.preGameAnalysis.recentPerformance.homeRecord && (
                <div>
                  <div className="data-label">Home Record</div>
                  <div className="text-sm text-gray-700">{analysis.preGameAnalysis.recentPerformance.homeRecord}</div>
                </div>
              )}
              {analysis.preGameAnalysis.recentPerformance.last3Games && (
                <div>
                  <div className="data-label">Last 3 Games</div>
                  <div className="text-sm text-gray-700">{analysis.preGameAnalysis.recentPerformance.last3Games}</div>
                </div>
              )}
              {analysis.preGameAnalysis.recentPerformance.last5Games && (
                <div>
                  <div className="data-label">Last 5 Games</div>
                  <div className="text-sm text-gray-700">{analysis.preGameAnalysis.recentPerformance.last5Games}</div>
                </div>
              )}
              {analysis.preGameAnalysis.recentPerformance.recentForm && (
                <div>
                  <div className="data-label">Recent Form</div>
                  <div className="text-sm text-gray-700">{analysis.preGameAnalysis.recentPerformance.recentForm}</div>
                </div>
              )}
              <div>
                <div className="data-label">Cushion</div>
                <div className="text-sm text-gray-700">{analysis.preGameAnalysis.recentPerformance.cushion}</div>
              </div>
            </div>
          </div>

          {/* Key Factors */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Key Factors</h3>
            <div className="space-y-3">
              {analysis.preGameAnalysis.keyFactors.map((factor, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded">
                  <div className="font-bold text-gray-900 mb-1">{factor.title}</div>
                  <div className="text-sm text-gray-700">{factor.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Risk Factors</h3>
            <ul className="list-disc list-inside space-y-2">
              {analysis.preGameAnalysis.riskFactors.map((risk, idx) => (
                <li key={idx} className="text-sm text-gray-700">{risk}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Game Results */}
        <section className="card-float p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 pb-3 border-b border-gray-200">
            📈 Game Results
          </h2>

          {/* Player Stats - for player props */}
          {analysis.gameResults.playerStats && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Player Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(analysis.gameResults.playerStats).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded">
                    <div className="data-label capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Stats - for spreads/totals */}
          {analysis.gameResults.teamStats && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Team Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(analysis.gameResults.teamStats).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded">
                    <div className="data-label capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Players - for spreads/totals */}
          {analysis.gameResults.keyPlayers && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Key Performances</h3>
              <div className="space-y-4">
                {Object.entries(analysis.gameResults.keyPlayers).map(([playerKey, player]: [string, any]) => (
                  <div key={playerKey} className="bg-gray-50 p-4 rounded">
                    <div className="font-bold text-gray-900 mb-2 capitalize">
                      {playerKey.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {Object.entries(player).map(([statKey, statValue]) => (
                        <div key={statKey}>
                          <div className="data-label capitalize text-xs">
                            {statKey.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="font-medium text-gray-900">{statValue as string}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quarter Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Quarter-by-Quarter</h3>
            <div className="space-y-3">
              {analysis.gameResults.quarterBreakdown.map((quarter, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded">
                  <div className="font-bold text-gray-900 mb-1">{quarter.quarter}</div>
                  <div className="text-sm text-gray-700 mb-2">{quarter.description}</div>
                  {quarter.halftimeTotal && (
                    <div className="text-sm font-medium text-accent">
                      {quarter.halftimeTotal}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* When Cleared/Missed */}
          {(analysis.gameResults.whenCleared || analysis.gameResults.whenMissed) && (
            <div className="bg-gray-50 p-4 rounded mb-6">
              <div className="font-bold text-gray-900 mb-2">
                {isWin ? '✅ When Line Was Cleared' : '❌ When Line Was Missed'}
              </div>
              <div className="text-sm text-gray-700">
                {analysis.gameResults.whenCleared || analysis.gameResults.whenMissed}
              </div>
            </div>
          )}

          {/* Game Context */}
          <div className="space-y-3">
            {analysis.gameResults.turningPoint && (
              <div className="bg-accent bg-opacity-10 p-4 rounded border border-accent">
                <div className="font-bold text-gray-900 mb-1">🔄 Turning Point</div>
                <div className="text-sm text-gray-700">{analysis.gameResults.turningPoint}</div>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-bold text-gray-900 mb-1">Game Pace</div>
              <div className="text-sm text-gray-700">{analysis.gameResults.gamePace}</div>
            </div>
            {analysis.gameResults.teamOffense && (
              <div className="bg-gray-50 p-4 rounded">
                <div className="font-bold text-gray-900 mb-1">Team Offense</div>
                <div className="text-sm text-gray-700">{analysis.gameResults.teamOffense}</div>
              </div>
            )}
            {analysis.gameResults.foulTrouble && (
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <div className="font-bold text-red-900 mb-1">⚠️ Foul Trouble</div>
                <div className="text-sm text-red-700">{analysis.gameResults.foulTrouble}</div>
              </div>
            )}
          </div>
        </section>

        {/* Post-Game Analysis */}
        <section className="card-float p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 pb-3 border-b border-gray-200">
            🔍 Post-Game Analysis
          </h2>

          {/* What Went Right/Wrong */}
          {(analysis.postGameAnalysis.whatWentRight || analysis.postGameAnalysis.whatWentWrong) && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {isWin ? 'What Went Right' : 'What Went Wrong'}
              </h3>
              <div className="space-y-3">
                {(isWin ? analysis.postGameAnalysis.whatWentRight : analysis.postGameAnalysis.whatWentWrong)?.map(
                  (item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded">
                      <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                      <div className="text-sm text-gray-700">{item.description}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Statistical Context */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Statistical Context</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="data-label">vs Season Average</div>
                <div className="text-sm text-gray-700">{analysis.postGameAnalysis.statisticalContext.vsSeasonAverage}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="data-label">vs Recent Form</div>
                <div className="text-sm text-gray-700">{analysis.postGameAnalysis.statisticalContext.vsRecentForm}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="data-label">vs Prop Line</div>
                <div className="text-sm text-gray-700">{analysis.postGameAnalysis.statisticalContext.vsPropLine}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="data-label">Percentile Ranking</div>
                <div className="text-sm text-gray-700">{analysis.postGameAnalysis.statisticalContext.percentileRanking}</div>
              </div>
            </div>
          </div>

          {/* Variance Analysis */}
          {analysis.postGameAnalysis.wasNormalVariance && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <div className="font-bold text-blue-900 mb-2">Variance Analysis</div>
              <div className="text-sm text-blue-700">{analysis.postGameAnalysis.wasNormalVariance}</div>
            </div>
          )}
        </section>

        {/* Closing Line Value */}
        <section className="card-float p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 pb-3 border-b border-gray-200">
            💰 Closing Line Value (CLV)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <div className="data-label">Our Odds</div>
              <div className="data-value">{formatOdds(analysis.closingLineValue.ourOdds)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="data-label">Closing Odds</div>
              <div className="data-value">{formatOdds(analysis.closingLineValue.closingOdds)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="data-label">CLV</div>
              <div className={`data-value ${analysis.closingLineValue.clvCents > 0 ? 'text-success' : 'text-gray-600'}`}>
                {analysis.closingLineValue.clvCents > 0 ? '+' : ''}{analysis.closingLineValue.clvCents}¢
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="data-label">CLV %</div>
              <div className={`data-value ${analysis.closingLineValue.clvPercentage > 0 ? 'text-success' : 'text-gray-600'}`}>
                {analysis.closingLineValue.clvPercentage > 0 ? '+' : ''}{analysis.closingLineValue.clvPercentage.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <div className="font-bold text-gray-900 mb-2">Verdict</div>
            <div className="text-sm text-gray-700">{analysis.closingLineValue.verdict}</div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="card-float p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 pb-3 border-b border-gray-200">
            📝 Key Takeaways
          </h2>

          <ul className="space-y-3">
            {analysis.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">•</span>
                <span className="text-gray-700 flex-1">{takeaway}</span>
              </li>
            ))}
          </ul>

          {analysis.verdict && (
            <div className="mt-6 bg-accent/10 p-4 rounded border border-accent/20">
              <div className="font-bold text-accent mb-2">Final Verdict</div>
              <div className="text-sm text-gray-700">{analysis.verdict}</div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Would bet this again under identical circumstances?
            </div>
            <div className={`text-xl font-bold ${analysis.wouldBetAgain ? 'text-success' : 'text-loss'}`}>
              {analysis.wouldBetAgain ? '✅ Yes' : '❌ No'}
            </div>
          </div>
        </section>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-steel hover:text-accent transition-colors"
        >
          <span>←</span>
          <span>Back to Portfolio</span>
        </Link>
      </div>
    </main>
  );
}
