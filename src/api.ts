import type { MonthlyLeadersResponse, ScanResponse, SeasonalityCalendar } from './types';

const BASE_URL = '/api';

export async function fetchSeasonalityScan(
  start: string,
  end: string,
  symbols: string[],
  lookbackYears: number,
): Promise<ScanResponse> {
  const params = new URLSearchParams({ start, end, lookbackYears: String(lookbackYears) });
  if (symbols.length > 0) params.set('symbols', symbols.join(','));

  const res = await fetch(`${BASE_URL}/seasonality?${params}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? 'Request failed');
  return body;
}

export async function fetchSeasonalityCalendar(
  symbol: string,
  lookbackYears: number,
): Promise<SeasonalityCalendar> {
  const params = new URLSearchParams({ lookbackYears: String(lookbackYears) });
  const res = await fetch(`${BASE_URL}/seasonality-calendar/${encodeURIComponent(symbol)}?${params}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? 'Request failed');
  return body;
}

export async function fetchMonthlyLeaders(
  symbols: string[],
  lookbackYears: number,
  topN: number,
): Promise<MonthlyLeadersResponse> {
  const params = new URLSearchParams({ lookbackYears: String(lookbackYears), topN: String(topN) });
  if (symbols.length > 0) params.set('symbols', symbols.join(','));

  const res = await fetch(`${BASE_URL}/monthly-leaders?${params}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? 'Request failed');
  return body;
}
