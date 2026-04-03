import type { Env } from '../../lib/types';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return Response.json({ error: 'startDate and endDate required' }, { status: 400 });
    }

    const rows = await env.DB.prepare(`
      SELECT
        campaign_id as campaignId,
        MAX(campaign_name) as campaignName,
        COALESCE(SUM(spend), 0) as valorUsado,
        COALESCE(SUM(reach), 0) as alcance,
        COALESCE(SUM(impressions), 0) as impressions,
        COALESCE(SUM(inline_link_clicks), 0) as linkClicks,
        COALESCE(SUM(results), 0) as resultados
      FROM meta_ad_metrics
      WHERE date_ref >= ? AND date_ref <= ?
      GROUP BY campaign_id
      ORDER BY valorUsado DESC
    `).bind(startDate, endDate).all<{
      campaignId: string;
      campaignName: string;
      valorUsado: number;
      alcance: number;
      impressions: number;
      linkClicks: number;
      resultados: number;
    }>();

    const data = (rows.results || []).map((row) => {
      const cpm = row.impressions > 0 ? (row.valorUsado / row.impressions) * 1000 : 0;
      const ctr = row.impressions > 0 ? (row.linkClicks / row.impressions) * 100 : 0;
      const custoPorResultado = row.resultados > 0 ? row.valorUsado / row.resultados : 0;
      return {
        campaignId: row.campaignId,
        campaignName: row.campaignName,
        valorUsado: row.valorUsado,
        alcance: row.alcance,
        cpm,
        ctr,
        resultados: row.resultados,
        custoPorResultado,
      };
    });

    return Response.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
};
