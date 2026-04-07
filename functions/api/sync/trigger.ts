import type { Env } from '../../lib/types';
import { getDefaultDateRange } from '../../lib/date-utils';
import { fetchMetaInsights, fetchAccountInfo, fetchMonthlySpend, extractResults, extractCostPerResult, extractConversions, extractRevenue } from '../../lib/meta-api';

const TAX_RATE = 0.1215;
const TAX_START = '2026-01-01';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (token !== env.SYNC_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const defaults = getDefaultDateRange();
    const startDate = url.searchParams.get('startDate') || defaults.startDate;
    const endDate = url.searchParams.get('endDate') || defaults.endDate;

    const db = env.DB;

    const insights = await fetchMetaInsights(env, startDate, endDate);

    const stmts = insights.map((ins) => {
      return db.prepare(`
        INSERT INTO meta_ad_metrics (
          ad_id, date_ref, ad_name, adset_id, adset_name, campaign_id, campaign_name,
          spend, impressions, cpm, clicks, ctr, reach, frequency,
          inline_link_clicks, inline_link_click_ctr, results, cost_per_result,
          conversions, revenue, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT (ad_id, date_ref) DO UPDATE SET
          ad_name = excluded.ad_name,
          adset_id = excluded.adset_id,
          adset_name = excluded.adset_name,
          campaign_id = excluded.campaign_id,
          campaign_name = excluded.campaign_name,
          spend = excluded.spend,
          impressions = excluded.impressions,
          cpm = excluded.cpm,
          clicks = excluded.clicks,
          ctr = excluded.ctr,
          reach = excluded.reach,
          frequency = excluded.frequency,
          inline_link_clicks = excluded.inline_link_clicks,
          inline_link_click_ctr = excluded.inline_link_click_ctr,
          results = excluded.results,
          cost_per_result = excluded.cost_per_result,
          conversions = excluded.conversions,
          revenue = excluded.revenue,
          updated_at = datetime('now')
      `).bind(
        ins.ad_id,
        ins.date_start,
        ins.ad_name,
        ins.adset_id,
        ins.adset_name,
        ins.campaign_id,
        ins.campaign_name,
        parseFloat(ins.spend || '0'),
        parseInt(ins.impressions || '0', 10),
        parseFloat(ins.cpm || '0'),
        parseInt(ins.clicks || '0', 10),
        parseFloat(ins.ctr || '0'),
        parseInt(ins.reach || '0', 10),
        parseFloat(ins.frequency || '0'),
        parseInt(ins.inline_link_clicks || '0', 10),
        parseFloat(ins.inline_link_click_ctr || '0'),
        extractResults(ins.actions),
        extractCostPerResult(ins.cost_per_action_type),
        extractConversions(ins.actions),
        extractRevenue(ins.action_values),
      );
    });

    for (let i = 0; i < stmts.length; i += 100) {
      await db.batch(stmts.slice(i, i + 100));
    }

    const account = await fetchAccountInfo(env);
    await db.prepare(`
      INSERT INTO meta_account (account_id, name, currency, timezone_name, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT (account_id) DO UPDATE SET
        name = excluded.name,
        currency = excluded.currency,
        timezone_name = excluded.timezone_name,
        updated_at = datetime('now')
    `).bind(account.account_id, account.name, account.currency, account.timezone_name).run();

    const monthly = await fetchMonthlySpend(env);
    const finStmts = monthly.map((m) => {
      const spend = parseFloat(m.spend || '0');
      const hasTax = m.date_start >= TAX_START;
      const total = hasTax ? spend / (1 - TAX_RATE) : spend;
      const tax = hasTax ? total - spend : 0;
      return db.prepare(`
        INSERT INTO meta_financeiro (month_start, spend, tax, total, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT (month_start) DO UPDATE SET
          spend = excluded.spend,
          tax = excluded.tax,
          total = excluded.total,
          updated_at = datetime('now')
      `).bind(m.date_start, spend, tax, total);
    });

    if (finStmts.length > 0) {
      for (let i = 0; i < finStmts.length; i += 100) {
        await db.batch(finStmts.slice(i, i + 100));
      }
    }

    return Response.json({
      success: true,
      synced: insights.length,
      financeiro: monthly.length,
      dateRange: { startDate, endDate },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
};