import { useState } from 'react';
import { fetchSeasonalityCalendar } from '../api';
import type { MonthSeasonality } from '../types';
import { SymbolDetail } from './SymbolDetail';

function formatPct(value: number | null | undefined) {
  if (value == null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function TickerCalendar() {
  const [symbolInput, setSymbolInput] = useState('');
  const [lookbackYears, setLookbackYears] = useState(15);
  const [months, setMonths] = useState<MonthSeasonality[]>([]);
  const [symbol, setSymbol] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = months.find((m) => m.month === selectedMonth) ?? null;

  async function runLookup() {
    const trimmed = symbolInput.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSeasonalityCalendar(trimmed, lookbackYears);
      setMonths(response.months);
      setSymbol(response.symbol);
      setSelectedMonth(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const withData = months.filter((m) => m.sampleSize > 0);
  const withoutData = months.filter((m) => m.sampleSize === 0);

  return (
    <section className="ticker-calendar">
      <h2 className="section-heading">When is a ticker's seasonality good?</h2>
      <p className="hint">
        Pick a single symbol to see which calendar months it has historically performed best in.
      </p>

      <form
        className="card calendar-form"
        onSubmit={(e) => {
          e.preventDefault();
          runLookup();
        }}
      >
        <label className="symbols-field">
          Ticker symbol
          <input
            type="text"
            placeholder="e.g. GOOGL"
            value={symbolInput}
            onChange={(e) => setSymbolInput(e.target.value)}
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
        <button type="submit" className="scan-button" disabled={loading}>
          {loading ? 'Checking...' : 'Check seasonality'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {withData.length > 0 && (
        <div className="results-layout calendar-results">
          <div className="card results">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Month</th>
                  <th>Avg return</th>
                  <th>Win rate</th>
                  <th>Std dev</th>
                  <th>Years</th>
                </tr>
              </thead>
              <tbody>
                {withData.map((m, i) => (
                  <tr
                    key={m.month}
                    className={m.month === selectedMonth ? 'selected' : ''}
                    onClick={() => setSelectedMonth(m.month)}
                  >
                    <td>{i + 1}</td>
                    <td className="symbol">{m.month}</td>
                    <td className={m.avgReturnPct! >= 0 ? 'positive' : 'negative'}>
                      {formatPct(m.avgReturnPct)}
                    </td>
                    <td>{formatPct(m.winRatePct)}</td>
                    <td>{m.stdDevPct != null ? `${m.stdDevPct.toFixed(2)}%` : '—'}</td>
                    <td>{m.sampleSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {withoutData.length > 0 && (
              <p className="hint">
                No data for: {withoutData.map((m) => m.month).join(', ')}
              </p>
            )}
          </div>

          {selected && <SymbolDetail result={{ symbol: `${symbol} · ${selected.month}`, ...selected }} />}
        </div>
      )}
    </section>
  );
}
