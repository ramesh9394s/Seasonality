import type { BestSellDate, BucketStat, HoldingPeriodRecommendation, SeasonalityResult } from '../types';

function formatPct(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function BestSellDateCallout({ bestSellDate }: { bestSellDate: BestSellDate }) {
  return (
    <div className="recommendation">
      <strong>📅 Best date to sell:</strong> historically, <strong>{bestSellDate.label}</strong>{' '}
      (day {bestSellDate.daysFromStart} of the window) has marked the high point — averaging{' '}
      <strong className={bestSellDate.avgPctFromStart >= 0 ? 'positive' : 'negative'}>
        {formatPct(bestSellDate.avgPctFromStart)}
      </strong>{' '}
      above the period's starting price, across {bestSellDate.sampleSize} years.
    </div>
  );
}

function RecommendationCallout({ rec }: { rec: HoldingPeriodRecommendation }) {
  const direction = rec.suggestedDays < rec.originalDays ? 'selling sooner' : 'holding longer';
  return (
    <div className="recommendation">
      <strong>💡 Recommendation:</strong> {direction} has historically paid off better — exiting
      after <strong>{rec.suggestedDays} days</strong> instead of {rec.originalDays} averaged{' '}
      <strong className={rec.suggestedAvgReturnPct >= 0 ? 'positive' : 'negative'}>
        {formatPct(rec.suggestedAvgReturnPct)}
      </strong>{' '}
      (vs. {formatPct(rec.originalAvgReturnPct)}), a {formatPct(rec.improvementPct)} improvement
      across {rec.suggestedSampleSize} years.
    </div>
  );
}

function BucketTable({ title, buckets }: { title: string; buckets: BucketStat[] }) {
  return (
    <div className="bucket-table">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Price vs. period start</th>
            <th>Samples</th>
          </tr>
        </thead>
        <tbody>
          {buckets.map((b, i) => (
            <tr key={b.label} className={i === 0 ? 'best' : ''}>
              <td>{i === 0 ? `${b.label} ★` : b.label}</td>
              <td className={b.avgPctFromStart >= 0 ? 'positive' : 'negative'}>
                {formatPct(b.avgPctFromStart)}
              </td>
              <td>{b.sampleSize}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SymbolDetail({ result }: { result: SeasonalityResult }) {
  return (
    <div className="card symbol-detail">
      <h2>{result.symbol}</h2>
      <p>
        Avg return {formatPct(result.avgReturnPct ?? 0)} · Win rate{' '}
        {result.winRatePct?.toFixed(0)}% · {result.sampleSize} years of data
      </p>

      {result.bestSellDate && <BestSellDateCallout bestSellDate={result.bestSellDate} />}

      {result.holdingPeriodRecommendation && (
        <RecommendationCallout rec={result.holdingPeriodRecommendation} />
      )}

      {(result.weekdayBreakdown || result.monthPartBreakdown) && (
        <div className="best-time-to-sell">
          <h3 className="section-title">Best time to sell, within this window</h3>
          <p className="hint">
            Based on how close to the period's start price each day has historically been —
            higher means the stock has tended to be further into its seasonal gain.
          </p>
          <div className="bucket-tables">
            {result.weekdayBreakdown && (
              <BucketTable title="By day of week" buckets={result.weekdayBreakdown} />
            )}
            {result.monthPartBreakdown && (
              <BucketTable title="By time of month" buckets={result.monthPartBreakdown} />
            )}
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>From</th>
            <th>To</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {result.years
            .slice()
            .reverse()
            .map((y) => (
              <tr key={y.year}>
                <td>{y.year}</td>
                <td>{y.startDate}</td>
                <td>{y.endDate}</td>
                <td className={y.returnPct >= 0 ? 'positive' : 'negative'}>
                  {formatPct(y.returnPct)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
