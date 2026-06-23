import { useMemo, useState } from 'react';
import type { SeasonalityResult } from '../types';

function formatPct(value: number | null | undefined) {
  if (value == null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

type SortKey = 'symbol' | 'avgReturnPct' | 'winRatePct' | 'stdDevPct' | 'sampleSize' | 'bestDatePct';
type SortDirection = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'avgReturnPct', label: 'Avg return' },
  { key: 'winRatePct', label: 'Win rate' },
  { key: 'stdDevPct', label: 'Std dev' },
  { key: 'sampleSize', label: 'Years' },
  { key: 'bestDatePct', label: 'Best date to sell' },
];

interface ResultsTableProps {
  results: SeasonalityResult[];
  selectedSymbol: string | null;
  onSelectSymbol: (symbol: string) => void;
}

export function ResultsTable({ results, selectedSymbol, onSelectSymbol }: ResultsTableProps) {
  const [filterText, setFilterText] = useState('');
  const [maxStdDev, setMaxStdDev] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('avgReturnPct');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const failed = results.filter((r) => r.error || r.sampleSize === 0);

  const rows = useMemo(() => {
    const filterUpper = filterText.trim().toUpperCase();
    const maxStdDevNum = maxStdDev.trim() === '' ? null : Number(maxStdDev);
    const filtered = results
      .filter((r) => !r.error && r.sampleSize > 0)
      .filter((r) => r.symbol.includes(filterUpper))
      .filter((r) => maxStdDevNum == null || (r.stdDevPct ?? Infinity) < maxStdDevNum);

    const direction = sortDirection === 'asc' ? 1 : -1;
    return filtered.slice().sort((a, b) => {
      if (sortKey === 'symbol') return direction * a.symbol.localeCompare(b.symbol);
      if (sortKey === 'bestDatePct') {
        const aVal = a.bestSellDate?.avgPctFromStart ?? -Infinity;
        const bVal = b.bestSellDate?.avgPctFromStart ?? -Infinity;
        return direction * (aVal - bVal);
      }
      const aVal = a[sortKey] ?? -Infinity;
      const bVal = b[sortKey] ?? -Infinity;
      return direction * (aVal - bVal);
    });
  }, [results, filterText, maxStdDev, sortKey, sortDirection]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection(key === 'symbol' ? 'asc' : 'desc');
    }
  }

  return (
    <div className="card results">
      <div className="filter-row">
        <input
          type="text"
          className="ticker-filter"
          placeholder="Filter tickers..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <label className="std-dev-filter">
          Max std dev
          <input
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 20"
            value={maxStdDev}
            onChange={(e) => setMaxStdDev(e.target.value)}
          />
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            {COLUMNS.map((col) => (
              <th key={col.key}>
                <button type="button" className="sort-header" onClick={() => toggleSort(col.key)}>
                  {col.label}
                  {sortKey === col.key && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.symbol}
              className={r.symbol === selectedSymbol ? 'selected' : ''}
              onClick={() => onSelectSymbol(r.symbol)}
            >
              <td>{i + 1}</td>
              <td className="symbol">{r.symbol}</td>
              <td className={r.avgReturnPct! >= 0 ? 'positive' : 'negative'}>
                {formatPct(r.avgReturnPct)}
              </td>
              <td>{formatPct(r.winRatePct)}</td>
              <td>{r.stdDevPct != null ? `${r.stdDevPct.toFixed(2)}%` : '—'}</td>
              <td>{r.sampleSize}</td>
              <td>
                {r.bestSellDate
                  ? `${r.bestSellDate.label} (${formatPct(r.bestSellDate.avgPctFromStart)})`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && <p className="hint">No tickers match the current filters.</p>}

      {failed.length > 0 && (
        <p className="hint">
          No data for: {failed.map((r) => r.symbol).join(', ')}
        </p>
      )}
    </div>
  );
}
