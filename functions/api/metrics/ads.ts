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
        ad_id as adId,
        MAX(ad_name) as adName,
        MAX(campaign_id) as campaignId,
        COALESCE(SUM(spend), 0) as valorUsado,
        COALESCE(SUM(reach), 0) as alcance,
        COALESCE(SUM(impressions), 0) as impressions,
        COALESCE(SUM(inline_link_clicks), 0) as linkClicks,
        COALESCE(SUM(results), 0) as resultados,
        CASE WHEN COALESCE(SUM(results), 0) > 0
          THEN SUM(spend) / SUM(results)
          ELSE 0
        END as custoPorResultado,
        COALESCE(SUM(conversions), 0) as conversoes,
        COALESCE(SUM(revenue), 0) as receita
      FROM meta_ad_metrics
      WHERE date_ref >= ? AND date_ref <= ?
      GROUP BY ad_id
      ORDER BY valorUsado DESC
    `).bind(startDate, endDate).all<{
      adId: string;
      adName: string;
      campaignId: string;
      valorUsado: number;
      alcance: number;
      impressions: number;
      linkClicks: number;
      resultados: number;
      custoPorResultado: number;
      conversoes: number;
      receita: number;
    }>();

    const data = (rows.results || []).map((row) => {
      const cpm = row.impressions > 0 ? (row.valorUsado / row.impressions) * 1000 : 0;
      const ctr = row.impressions > 0 ? (row.linkClicks / row.impressions) * 100 : 0;
      return {
        adId: row.adId,
        adName: row.adName,
        campaignId: row.campaignId,
        valorUsado: row.valorUsado,
        alcance: row.alcance,
        cpm,
        ctr,
        impressions: row.impressions,
        resultados: row.resultados ?? 0,
        custoPorResultado: row.custoPorResultado ?? 0,
        conversoes: row.conversoes ?? 0,
        receita: row.receita ?? 0,
      };
    });

    return Response.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
};