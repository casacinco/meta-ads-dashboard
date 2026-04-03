import type { Env } from '../../lib/types';

export const onRequestGet: PagesFunction<Env> = async ({ request: _request, env }) => {
  try {
    const account = await env.DB.prepare(`
      SELECT account_id as accountId, name, currency, timezone_name as timezone, updated_at as updatedAt
      FROM meta_account
      LIMIT 1
    `).first<{ accountId: string; name: string; currency: string; timezone: string; updatedAt: string }>();

    const months = await env.DB.prepare(`
      SELECT month_start as monthStart, spend, tax, total
      FROM meta_financeiro
      ORDER BY month_start DESC
    `).all<{ monthStart: string; spend: number; tax: number; total: number }>();

    return Response.json({
      account: account || { accountId: '', name: 'Meta Ads', currency: 'BRL', timezone: 'America/Sao_Paulo' },
      months: months.results || [],
      updatedAt: account?.updatedAt || new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
};
