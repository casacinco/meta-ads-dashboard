import type { Env } from './types';
const BASE = 'https://graph.facebook.com/v21.0';
export interface MetaInsight {
  ad_id: string;
  ad_name: string;
  adset_id: string;
  adset_name: string;
  campaign_id: string;
  campaign_name: string;
  spend: string;
  impressions: string;
  cpm: string;
  clicks: string;
  ctr: string;
  reach: string;
  frequency: string;
  inline_link_clicks?: string;
  inline_link_click_ctr?: string;
  actions?: Array<{ action_type: string; value: string }>;
  cost_per_action_type?: Array<{ action_type: string; value: string }>;
  date_start: string;
}
export interface MetaAccountInfo {
  name: string;
  currency: string;
  timezone_name: string;
  account_id: string;
}
export interface MetaMonthlySpend {
  spend: string;
  date_start: string;
}
export function extractResults(actions: Array<{ action_type: string; value: string }> | undefined): number {
  if (!actions) return 0;
  const priority = ['omni_initiated_checkout', 'lead', 'onsite_conversion.lead_grouped', 'omni_purchase'];
  for (const type of priority) {
    const found = actions.find((a) => a.action_type === type);
    if (found) return parseInt(found.value, 10);
  }
  return 0;
}
export function extractCostPerResult(costPerAction: Array<{ action_type: string; value: string }> | undefined): number {
  if (!costPerAction) return 0;
  const priority = ['omni_initiated_checkout', 'lead', 'onsite_conversion.lead_grouped', 'omni_purchase'];
  for (const type of priority) {
    const found = costPerAction.find((a) => a.action_type === type);
    if (found) return parseFloat(found.value);
  }
  return 0;
}
export async function fetchMetaInsights(
  env: Env,
  startDate: string,
  endDate: string
): Promise<MetaInsight[]> {
  const params = new URLSearchParams({
    level: 'ad',
    time_increment: '1',
    fields: [
      'ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name',
      'spend', 'impressions', 'cpm', 'clicks', 'ctr', 'reach', 'frequency',
      'actions', 'cost_per_action_type', 'inline_link_clicks', 'inline_link_click_ctr',
    ].join(','),
    time_range: JSON.stringify({ since: startDate, until: endDate }),
    limit: '500',
    access_token: env.META_ACCESS_TOKEN,
  });
  const results: MetaInsight[] = [];
  let url: string | null = `${BASE}/${env.META_AD_ACCOUNT_ID}/insights?${params}`;
  while (url) {
    const res = await fetch(url);
    const json = await res.json() as { data: MetaInsight[]; paging?: { next?: string }; error?: { message: string } };
    if (json.error) throw new Error(`Meta API error: ${json.error.message}`);
    results.push(...(json.data || []));
    url = json.paging?.next || null;
  }
  return results;
}
export async function fetchAccountInfo(env: Env): Promise<MetaAccountInfo> {
  const params = new URLSearchParams({
    fields: 'name,currency,timezone_name,account_id',
    access_token: env.META_ACCESS_TOKEN,
  });
  const res = await fetch(`${BASE}/${env.META_AD_ACCOUNT_ID}?${params}`);
  const json = await res.json() as MetaAccountInfo & { error?: { message: string } };
  if ((json as any).error) throw new Error(`Meta API error: ${(json as any).error.message}`);
  return json;
}
export async function fetchMonthlySpend(env: Env): Promise<MetaMonthlySpend[]> {
  const today = new Date().toISOString().split('T')[0];
  const params = new URLSearchParams({
    level: 'account',
    time_increment: 'monthly',
    fields: 'spend',
    time_range: JSON.stringify({ since: '2025-01-01', until: today }),
    access_token: env.META_ACCESS_TOKEN,
  });
  const res = await fetch(`${BASE}/${env.META_AD_ACCOUNT_ID}/insights?${params}`);
  const json = await res.json() as { data: MetaMonthlySpend[]; error?: { message: string } };
  if (json.error) throw new Error(`Meta API error: ${json.error.message}`);
  return json.data || [];
}