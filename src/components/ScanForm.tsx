const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

interface DateField {
  month: number; // 1-12
  day: number;
}

interface ScanFormProps {
  start: DateField;
  end: DateField;
  lookbackYears: number;
  symbolsInput: string;
  loading: boolean;
  onStartChange: (field: DateField) => void;
  onEndChange: (field: DateField) => void;
  onLookbackYearsChange: (years: number) => void;
  onSymbolsInputChange: (value: string) => void;
  onSelectFullMonth: (month: number) => void;
  onSubmit: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function DateSelect({
  field,
  onChange,
}: {
  field: DateField;
  onChange: (field: DateField) => void;
}) {
  const maxDay = DAYS_IN_MONTH[field.month - 1];
  return (
    <span className="date-select">
      <select
        value={field.month}
        onChange={(e) => onChange({ ...field, month: Number(e.target.value) })}
      >
        {MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={Math.min(field.day, maxDay)}
        onChange={(e) => onChange({ ...field, day: Number(e.target.value) })}
      >
        {Array.from({ length: maxDay }, (_, i) => i + 1).map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </span>
  );
}

export function ScanForm({
  start,
  end,
  lookbackYears,
  symbolsInput,
  loading,
  onStartChange,
  onEndChange,
  onLookbackYearsChange,
  onSymbolsInputChange,
  onSelectFullMonth,
  onSubmit,
}: ScanFormProps) {
  return (
    <form
      className="card scan-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="quick-months">
        {MONTHS.map((name, i) => {
          const month = i + 1;
          const isActive =
            start.month === month &&
            end.month === month &&
            start.day === 1 &&
            end.day === DAYS_IN_MONTH[month - 1];
          return (
            <button
              type="button"
              key={name}
              className={`month-chip${isActive ? ' active' : ''}`}
              onClick={() => onSelectFullMonth(month)}
            >
              {name.slice(0, 3)}
            </button>
          );
        })}
      </div>

      <div className="field-row">
        <label>
          From
          <DateSelect field={start} onChange={onStartChange} />
        </label>
        <label>
          To
          <DateSelect field={end} onChange={onEndChange} />
        </label>
        <label>
          Lookback (years)
          <input
            type="number"
            min={3}
            max={30}
            value={lookbackYears}
            onChange={(e) => onLookbackYearsChange(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="field-row">
        <label className="symbols-field">
          Symbols (optional, comma-separated — leave blank to scan the default watchlist)
          <input
            type="text"
            placeholder="e.g. GOOGL, AAPL, SPY"
            value={symbolsInput}
            onChange={(e) => onSymbolsInputChange(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="scan-button" disabled={loading}>
        {loading ? 'Scanning...' : 'Scan seasonality'}
      </button>
      <p className="hint">
        Range: {pad(start.month)}-{pad(start.day)} to {pad(end.month)}-{pad(end.day)}
      </p>
    </form>
  );
}

export type { DateField };
