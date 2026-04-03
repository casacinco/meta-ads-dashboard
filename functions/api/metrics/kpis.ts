import type { Env } from '../../lib/types';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return Response.json({ error: 'startDate and endDate required' }, { status: 400 });
    }

    const result = await env.DB.prepare(`
      SELECT
        COALESCE(SUM(spend), 0) as total_spend,
        COALESCE(SUM(impressions), 0) as total_impressions,
        COALESCE(SUM(inline_link_clicks), 0) as total_link_clicks,
        COALESCE(SUM(reach), 0) as total_reach
      FROM meta_ad_metrics
      WHERE date_ref >= ? AND date_ref <= ?
    `).bind(startDate, endDate).first<{
      total_spend: number;
      total_impressions: number;
      total_link_clicks: number;
      total_reach: number;
    }>();

    if (!result) {
      return Response.json({ valorUsado: 0, alcance: 0, ctr: 0, cpm: 0, frequencia: 0 });
    }

    const impressions = result.total_impressions;
    const linkClicks = result.total_link_clicks;
    const reach = result.total_reach;

    const cpm = impressions > 0 ? (result.total_spend / impressions) * 1000 : 0;
    const ctr = impressions > 0 ? (linkClicks / impressions) * 100 : 0;
    const frequencia = reach > 0 ? impressions / reach : 0;

    return Response.json({
      valorUsado: result.total_spend,
      alcance: reach,
      ctr,
      cpm,
      frequencia,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
};
