import { useState, useEffect, useCallback } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { KPIs, TimeseriesPoint, Campaign, Ad, TimeWindow } from '../types';
import { fetchKPIs, fetchTimeseries, fetchCampaigns, fetchAds } from '../lib/api';

const TZ = 'America/Sao_Paulo';

function getDateRange(window: TimeWindow): { startDate: string; endDate: string } {
  const now = toZonedTime(new Date(), TZ);
  const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

  switch (window) {
    case 'today':
      return { startDate: fmt(now), endDate: fmt(now) };
    case 'yesterday': {
      const y = subDays(now, 1);
      return { startDate: fmt(y), endDate: fmt(y) };
    }
    case '7d':
      return { startDate: fmt(subDays(now, 6)), endDate: fmt(now) };
    case '14d':
      return { startDate: fmt(subDays(now, 13)), endDate: fmt(now) };
    case '30d':
      return { startDate: fmt(subDays(now, 29)), endDate: fmt(now) };
    case 'this_month':
      return { startDate: fmt(startOfMonth(now)), endDate: fmt(now) };
    case 'last_month': {
      const last = subMonths(now, 1);
      return { startDate: fmt(startOfMonth(last)), endDate: fmt(endOfMonth(last)) };
    }
    default:
      return { startDate: fmt(subDays(now, 6)), endDate: fmt(now) };
  }
}

export interface MetaAdsState {
  kpis: KPIs | null;
  timeseries: TimeseriesPoint[];
  campaigns: Campaign[];
  ads: Ad[];
  loading: boolean;
  error: string | null;
  dateRange: { startDate: string; endDate: string };
  timeWindow: TimeWindow;
  setTimeWindow: (w: TimeWindow) => void;
  refresh: () => void;
}

export function useMetaAdsData(): MetaAdsState {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('today');
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateRange = getDateRange(timeWindow);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange(timeWindow);
      const [k, ts, c, a] = await Promise.all([
        fetchKPIs(startDate, endDate),
        fetchTimeseries(startDate, endDate),
        fetchCampaigns(startDate, endDate),
        fetchAds(startDate, endDate),
      ]);
      setKpis(k);
      setTimeseries(ts);
      setCampaigns(c);
      setAds(a);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [timeWindow]);

  useEffect(() => { load(); }, [load]);

  return { kpis, timeseries, campaigns, ads, loading, error, dateRange, timeWindow, setTimeWindow, refresh: load };
}
