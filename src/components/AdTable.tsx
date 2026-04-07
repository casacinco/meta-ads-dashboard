import type { Ad } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../lib/format';
interface Props {
  ads: Ad[];
}
export default function AdTable({ ads }: Props) {
  const sorted = [...ads].sort((a, b) => {
    const roasA = (a.receita ?? 0) > 0 && (a.valorUsado ?? 0) > 0 ? a.receita / a.valorUsado : 0;
    const roasB = (b.receita ?? 0) > 0 && (b.valorUsado ?? 0) > 0 ? b.receita / b.valorUsado : 0;
    return roasB - roasA;
  });

  const totalValorUsado = sorted.reduce((s, a) => s + (a.valorUsado ?? 0), 0);
  const totalResultados = sorted.reduce((s, a) => s + (a.resultados ?? 0), 0);
  const totalConversoes = sorted.reduce((s, a) => s + (a.conversoes ?? 0), 0);
  const totalReceita = sorted.reduce((s, a) => s + (a.receita ?? 0), 0);
  const totalImpressions = sorted.reduce((s, a) => s + (a.impressions ?? 0), 0);
  const totalCustoPorCheckout = totalResultados > 0 ? totalValorUsado / totalResultados : 0;
  const totalRatio = totalResultados > 0 ? (totalConversoes / totalResultados) * 100 : 0;
  const totalCustoVenda = totalConversoes > 0 ? totalValorUsado / totalConversoes : 0;
  const totalReceitaPorConversao = totalConversoes > 0 ? totalReceita / totalConversoes : 0;
  const totalRoas = totalValorUsado > 0 ? totalReceita / totalValorUsado : 0;
  const totalCpm = totalImpressions > 0 ? (totalValorUsado / totalImpressions) * 1000 : 0;

  const totalRowStyle: React.CSSProperties = {
    background: 'var(--surface-alt)',
    borderTop: '2px solid var(--border-light)',
    fontWeight: 700,
  };

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
              {['Anúncio', 'Valor Usado', 'Checkouts', 'Custo/Checkout', 'Conversões', 'Ratio', 'Custo Venda', 'Receita', 'Receita Total', 'ROAS', 'CPM', 'CTR'].map((h) => (
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
            {sorted.map((a, i) => (
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
                  {(a.resultados ?? 0) > 0 ? `${((a.conversoes ?? 0) / a.resultados * 100).toFixed(2)}%` : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)' }}>
                  {(a.conversoes ?? 0) > 0 && (a.custoPorResultado ?? 0) > 0
                    ? formatBRL(((a.resultados ?? 0) / a.conversoes) * a.custoPorResultado)
                    : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {(a.receita ?? 0) > 0 && (a.conversoes ?? 0) > 0 ? formatBRL(a.receita / a.conversoes) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {(a.receita ?? 0) > 0 ? formatBRL(a.receita) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--purple)' }}>
                  {(a.receita ?? 0) > 0 && (a.valorUsado ?? 0) > 0 ? (a.receita / a.valorUsado).toFixed(2) : '—'}
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
                <td colSpan={12} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Nenhum anúncio no período
                </td>
              </tr>
            )}
            {sorted.length > 0 && (
              <tr style={totalRowStyle}>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--sans)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Total
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)' }}>
                  {formatBRL(totalValorUsado)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatNumber(totalResultados)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {totalCustoPorCheckout > 0 ? formatBRL(totalCustoPorCheckout) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {formatNumber(totalConversoes)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-dim)' }}>
                  {totalResultados > 0 ? `${totalRatio.toFixed(2)}%` : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)' }}>
                  {totalCustoVenda > 0 ? formatBRL(totalCustoVenda) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {totalReceitaPorConversao > 0 ? formatBRL(totalReceitaPorConversao) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                  {totalReceita > 0 ? formatBRL(totalReceita) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--purple)' }}>
                  {totalRoas > 0 ? totalRoas.toFixed(2) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)' }}>
                  {totalCpm > 0 ? formatBRL(totalCpm) : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
