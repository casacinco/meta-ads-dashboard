import type { Campaign } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../lib/format';

interface Props {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: Props) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--sans)' }}>
          Campanhas
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--sans)' }}>
          <thead>
            <tr>
              {['Campanha', 'Valor Usado', 'Alcance', 'CPM', 'CTR', 'Resultados', 'Custo/Result.'].map((h) => (
                <th key={h} style={{
                  padding: '10px 16px',
                  textAlign: h === 'Campanha' ? 'left' : 'right',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr
                key={c.campaignId}
                className="fade-up"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  borderTop: '1px solid var(--border)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-alt)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px', color: 'var(--text)', fontSize: '13px', maxWidth: '240px' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.campaignName}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)' }}>
                  {formatBRL(c.valorUsado)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatNumber(c.alcance)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatBRL(c.cpm)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {formatPercent(c.ctr)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatNumber(c.resultados)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--red)' }}>
                  {c.custoPorResultado > 0 ? formatBRL(c.custoPorResultado) : '—'}
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Nenhuma campanha no período
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
