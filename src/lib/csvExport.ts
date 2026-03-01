/**
 * CSV export utility — converts tabular data to downloadable CSV files.
 */
import type { TabularData } from './chartRegistry.ts';

function escapeCell(val: string | number): string {
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCSVString(data: TabularData): string {
  const headerRow = data.headers.map(escapeCell).join(',');
  const bodyRows = data.rows.map((row) => row.map(escapeCell).join(','));
  return [headerRow, ...bodyRows].join('\n');
}

export function downloadCSV(data: TabularData, filename: string): void {
  const csv = toCSVString(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
