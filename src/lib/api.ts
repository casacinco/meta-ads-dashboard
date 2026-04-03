import type { KPIs, TimeseriesPoint, Campaign, Ad, FinanceiroData } from '../types';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export function fetchKPIs(startDate: string, endDate: string): Promise<KPIs> {
  return apiFetch(`/api/metrics/kpis?startDate=${startDate}&endDate=${endDate}`);
}

export function fetchTimeseries(startDate: string, endDate: string): Promise<TimeseriesPoint[]> {
  return apiFetch(`/api/metrics/timeseries?startDate=${startDate}&endDate=${endDate}`);
}

export function fetchCampaigns(startDate: string, endDate: string): Promise<Campaign[]> {
  return apiFetch(`/api/metrics/campaigns?startDate=${startDate}&endDate=${endDate}`);
}

export function fetchAds(startDate: string, endDate: string): Promise<Ad[]> {
  return apiFetch(`/api/metrics/ads?startDate=${startDate}&endDate=${endDate}`);
}

export function fetchFinanceiro(): Promise<FinanceiroData> {
  return apiFetch('/api/metrics/financeiro');
}
