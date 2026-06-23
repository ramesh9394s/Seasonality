export interface YearReturn {
  year: number;
  startDate: string;
  endDate: string;
  startClose: number;
  endClose: number;
  returnPct: number;
}

export interface BucketStat {
  label: string;
  avgPctFromStart: number;
  sampleSize: number;
}

export interface HoldingPeriodRecommendation {
  suggestedDays: number;
  suggestedAvgReturnPct: number;
  suggestedSampleSize: number;
  originalDays: number;
  originalAvgReturnPct: number;
  improvementPct: number;
}

export interface BestSellDate {
  label: string;
  daysFromStart: number;
  avgPctFromStart: number;
  sampleSize: number;
}

export interface WindowStats {
  years: YearReturn[];
  avgReturnPct: number | null;
  winRatePct: number | null;
  stdDevPct?: number;
  sampleSize: number;
  weekdayBreakdown?: BucketStat[];
  monthPartBreakdown?: BucketStat[];
  bestSellDate?: BestSellDate | null;
  holdingPeriodRecommendation?: HoldingPeriodRecommendation | null;
}

export interface SeasonalityResult extends WindowStats {
  symbol: string;
  error?: string;
}

export interface SeasonalityOptions {
  startMonthDay: string;
  endMonthDay: string;
  lookbackYears: number;
}

export interface ScanResponse {
  options: SeasonalityOptions;
  results: SeasonalityResult[];
}

export interface MonthSeasonality extends WindowStats {
  month: string;
  startMonthDay: string;
  endMonthDay: string;
}

export interface SeasonalityCalendar {
  symbol: string;
  months: MonthSeasonality[];
}

export interface MonthlyLeader {
  symbol: string;
  avgReturnPct: number;
  winRatePct: number;
  stdDevPct?: number;
  sampleSize: number;
  bestSellDate?: BestSellDate | null;
}

export interface MonthlyLeaderboard {
  month: string;
  topSymbols: MonthlyLeader[];
}

export interface MonthlyLeadersResponse {
  months: MonthlyLeaderboard[];
}
