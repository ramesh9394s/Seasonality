import { useMemo, useState } from 'react';
import { fetchSeasonalityScan } from './api';
import { ScanForm, type DateField } from './components/ScanForm';
import { ResultsTable } from './components/ResultsTable';
import { SymbolDetail } from './components/SymbolDetail';
import { MonthlyLeaders } from './components/MonthlyLeaders';
import { TickerCalendar } from './components/TickerCalendar';
import type { SeasonalityResult } from './types';
import './App.css';

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function App() {
  const [start, setStart] = useState<DateField>({ month: 7, day: 1 });
  const [end, setEnd] = useState<DateField>({ month: 7, day: 31 });
  const [lookbackYears, setLookbackYears] = useState(15);
  const [symbolsInput, setSymbolsInput] = useState('');
  const [results, setResults] = useState<SeasonalityResult[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedResult = useMemo(
    () => results.find((r) => r.symbol === selectedSymbol) ?? null,
    [results, selectedSymbol],
  );

  async function runScan() {
    setLoading(true);
    setError(null);
    try {
      const symbols = symbolsInput
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
      const response = await fetchSeasonalityScan(
        `${pad(start.month)}-${pad(start.day)}`,
        `${pad(end.month)}-${pad(end.day)}`,
        symbols,
        lookbackYears,
      );
      setResults(response.results);
      setSelectedSymbol(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function selectFullMonth(month: number) {
    setStart({ month, day: 1 });
    setEnd({ month, day: DAYS_IN_MONTH[month - 1] });
  }

  return (
    <div className="app">
      <header>
        <h1>Seasonality</h1>
        <p>Which stocks and ETFs have historically performed best over a given date range?</p>
      </header>

      <ScanForm
        start={start}
        end={end}
        lookbackYears={lookbackYears}
        symbolsInput={symbolsInput}
        loading={loading}
        onStartChange={setStart}
        onEndChange={setEnd}
        onLookbackYearsChange={setLookbackYears}
        onSymbolsInputChange={setSymbolsInput}
        onSelectFullMonth={selectFullMonth}
        onSubmit={runScan}
      />

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <div className="results-layout">
          <ResultsTable
            results={results}
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
          />
          {selectedResult && <SymbolDetail result={selectedResult} />}
        </div>
      )}

      <MonthlyLeaders />
      <TickerCalendar />
    </div>
  );
}

export default App;
