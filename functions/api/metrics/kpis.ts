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
        COALESCE(SUM(conversions), 0) as total_conversions,
        COALESCE(SUM(revenue), 0) as total_revenue
      FROM meta_ad_metrics
      WHERE date_ref >= ? AND date_ref <= ?
    `).bind(startDate, endDate).first<{
      total_spend: number;
      total_conversions: number;
      total_revenue: number;
    }>();

    if (!result) {
      return Response.json({ valorUsado: 0, faturamento: 0, roas: 0, cpa: 0 });
    }

    const roas = result.total_spend > 0 ? result.total_revenue / result.total_spend : 0;
    const cpa = result.total_conversions > 0 ? result.total_spend / result.total_conversions : 0;

    return Response.json({
      valorUsado: result.total_spend,
      faturamento: result.total_revenue,
      roas,
      cpa,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
};
