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
      SELECT date_ref as date, COALESCE(SUM(spend), 0) as valorUsado
      FROM meta_ad_metrics
      WHERE date_ref >= ? AND date_ref <= ?
      GROUP BY date_ref
      ORDER BY date_ref ASC
    `).bind(startDate, endDate).all<{ date: string; valorUsado: number }>();

    return Response.json(rows.results || []);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
};
