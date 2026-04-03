// Date utilities for São Paulo timezone
const TZ = 'America/Sao_Paulo';

function toSPDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const parts = new Intl.DateTimeFormat('en-CA', options).format(date);
  return parts; // en-CA gives YYYY-MM-DD
}

export function getTodaySP(): string {
  return toSPDate(new Date());
}

export function getYesterdaySP(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toSPDate(d);
}

export function getDefaultDateRange(): { startDate: string; endDate: string } {
  return {
    startDate: getYesterdaySP(),
    endDate: getTodaySP(),
  };
}
