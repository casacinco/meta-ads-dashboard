import type { Ad } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../lib/format';
interface Props {
  ads: Ad[];
}
export default function AdTable({ ads }: Props) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--sans)' }}>
          Anúncios
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--sans)' }}>
          <thead>
            <tr>
              {['Anúncio', 'Valor Usado', 'Checkouts', 'Custo/Checkout', 'Conversões', 'Ratio', 'Receita', 'CPM', 'CTR'].map((h) => (
                <th key={h} style={{
                  padding: '10px 16px',
                  textAlign: h === 'Anúncio' ? 'left' : 'right',
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
            {ads.map((a, i) => (
              <tr
                key={a.adId}
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
                    {a.adName ?? '—'}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)' }}>
                  {formatBRL(a.valorUsado ?? 0)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatNumber(a.resultados ?? 0)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {(a.custoPorResultado ?? 0) > 0 ? formatBRL(a.custoPorResultado) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatNumber(a.conversoes ?? 0)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-dim)' }}>
                  {(a.conversoes ?? 0) > 0 ? `${((a.resultados ?? 0) / a.conversoes).toFixed(2)}` : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {(a.receita ?? 0) > 0 ? formatBRL(a.receita) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatBRL(a.cpm ?? 0)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {formatPercent(a.ctr ?? 0)}
                </td>
              </tr>
            ))}
            {ads.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Nenhum anúncio no período
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}