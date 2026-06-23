import { useState } from 'react';
import { fetchMonthlyLeaders } from '../api';
import type { MonthlyLeaderboard } from '../types';

function formatPct(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function MonthlyLeaders() {
  const [lookbackYears, setLookbackYears] = useState(15);
  const [topN, setTopN] = useState(5);
  const [symbolsInput, setSymbolsInput] = useState('');
  const [months, setMonths] = useState<MonthlyLeaderboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runScan() {
    setLoading(true);
    setError(null);
    try {
      const symbols = symbolsInput
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
      const response = await fetchMonthlyLeaders(symbols, lookbackYears, topN);
      setMonths(response.months);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="monthly-leaders">
      <h2 className="section-heading">Top performers by month</h2>
      <p className="hint">
        Scans the watchlist across all 12 calendar months and ranks the strongest historical
        performers for each one.
      </p>

      <form
        className="card calendar-form"
        onSubmit={(e) => {
          e.preventDefault();
          runScan();
        }}
      >
        <label className="symbols-field">
          Symbols (optional, comma-separated — leave blank for the default watchlist)
          <input
            type="text"
            placeholder="e.g. GOOGL, AAPL, SPY"
            value={symbolsInput}
            onChange={(e) => setSymbolsInput(e.target.value)}
          />
        </label>
        <label>
          Lookback (years)
          <input
            type="number"
            min={3}
            max={30}
            value={lookbackYears}
            onChange={(e) => setLookbackYears(Number(e.target.value))}
          />
        </label>
        <label>
          Top N per month
          <input
            type="number"
            min={1}
            max={10}
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
          />
        </label>
        <button type="submit" className="scan-button" disabled={loading}>
          {loading ? 'Scanning...' : 'Find monthly leaders'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {months.length > 0 && (
        <div className="month-grid">
          {months.map((m) => (
            <div className="card month-card" key={m.month}>
              <h3>{m.month}</h3>
              {m.topSymbols.length === 0 ? (
                <p className="hint">No data</p>
              ) : (
                <ol>
                  {m.topSymbols.map((s) => (
                    <li key={s.symbol}>
                      <span className="symbol">{s.symbol}</span>
                      <span className={s.avgReturnPct >= 0 ? 'positive' : 'negative'}>
                        {formatPct(s.avgReturnPct)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
