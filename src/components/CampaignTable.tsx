import type { Campaign } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../lib/format';

interface Props {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: Props) {
  const sorted = [...campaigns].sort((a, b) => {
    const roasA = (a.receita ?? 0) > 0 && (a.valorUsado ?? 0) > 0 ? a.receita / a.valorUsado : 0;
    const roasB = (b.receita ?? 0) > 0 && (b.valorUsado ?? 0) > 0 ? b.receita / b.valorUsado : 0;
    return roasB - roasA;
  });

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
              {['Campanha', 'Valor Usado', 'Checkouts', 'Custo/Checkout', 'Conversões', 'Ratio', 'Custo Venda', 'Receita', 'Receita Total', 'ROAS', 'CPM', 'CTR'].map((h) => (
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
            {sorted.map((c, i) => (
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
                  {formatBRL(c.valorUsado ?? 0)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatNumber(c.resultados ?? 0)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {(c.custoPorResultado ?? 0) > 0 ? formatBRL(c.custoPorResultado) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatNumber(c.conversoes ?? 0)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-dim)' }}>
                  {(c.resultados ?? 0) > 0 ? `${((c.conversoes ?? 0) / c.resultados * 100).toFixed(2)}%` : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)' }}>
                  {(c.conversoes ?? 0) > 0 && (c.custoPorResultado ?? 0) > 0
                    ? formatBRL(((c.resultados ?? 0) / c.conversoes) * c.custoPorResultado)
                    : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {(c.receita ?? 0) > 0 && (c.conversoes ?? 0) > 0 ? formatBRL(c.receita / c.conversoes) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {(c.receita ?? 0) > 0 ? formatBRL(c.receita) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--purple)' }}>
                  {(c.receita ?? 0) > 0 && (c.valorUsado ?? 0) > 0 ? (c.receita / c.valorUsado).toFixed(2) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatBRL(c.cpm ?? 0)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {formatPercent(c.ctr ?? 0)}
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={12} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
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
