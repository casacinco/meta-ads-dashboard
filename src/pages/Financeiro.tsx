import { useState, useEffect } from 'react';
import type { FinanceiroData, FinanceiroMonth } from '../types';
import { fetchFinanceiro } from '../lib/api';
import { formatBRL, formatMonthBR } from '../lib/format';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Financeiro() {
  const [data, setData] = useState<FinanceiroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);

  useEffect(() => {
    fetchFinanceiro()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro'))
      .finally(() => setLoading(false));
  }, []);

  const years = data
    ? [...new Set(data.months.map((m) => parseInt(m.monthStart.split('-')[0], 10)))].sort((a, b) => b - a)
    : [];

  const filtered: FinanceiroMonth[] = data
    ? data.months.filter((m) => {
        const [y, mo] = m.monthStart.split('-').map(Number);
        if (filterYear !== null && y !== filterYear) return false;
        if (filterMonth !== null && mo !== filterMonth) return false;
        return true;
      })
    : [];

  const totals = filtered.reduce((acc, m) => ({
    spend: acc.spend + m.spend,
    tax: acc.tax + m.tax,
    total: acc.total + m.total,
  }), { spend: 0, tax: 0, total: 0 });

  const maxSpend = Math.max(...filtered.map((m) => m.spend), 1);

  const summaryCards = [
    { label: 'Gasto', value: totals.spend, color: 'var(--accent)', colorDim: 'var(--accent-dim)' },
    { label: 'Impostos', value: totals.tax, color: 'var(--amber)', colorDim: 'var(--amber-dim)' },
    { label: 'Total Cobrado', value: totals.total, color: 'var(--red)', colorDim: 'var(--red-dim)' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1280px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        {data && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--accent-dim)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              fontFamily: 'var(--mono)',
              color: 'var(--accent)',
            }}>
              {data.account.name}
            </span>
          </div>
        )}
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontFamily: 'var(--sans)', fontWeight: 700, color: 'var(--text)' }}>
          Financeiro
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--sans)' }}>
          Gasto mensal + impostos
        </p>
      </div>

      {loading && (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '13px', padding: '40px 0' }}>
          Carregando...
        </div>
      )}

      {error && (
        <div style={{
          background: 'var(--red-dim)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: 'var(--red)',
          fontSize: '13px',
          fontFamily: 'var(--mono)',
          marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {MONTHS.map((m, i) => (
              <button
                key={m}
                onClick={() => setFilterMonth(filterMonth === i + 1 ? null : i + 1)}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${filterMonth === i + 1 ? 'var(--border-light)' : 'transparent'}`,
                  background: filterMonth === i + 1 ? 'var(--surface-alt)' : 'transparent',
                  color: filterMonth === i + 1 ? 'var(--text)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {m}
              </button>
            ))}
            <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setFilterYear(filterYear === y ? null : y)}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${filterYear === y ? 'var(--border-light)' : 'transparent'}`,
                  background: filterYear === y ? 'var(--surface-alt)' : 'transparent',
                  color: filterYear === y ? 'var(--text)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {y}
              </button>
            ))}
            {(filterYear !== null || filterMonth !== null) && (
              <button
                onClick={() => { setFilterYear(null); setFilterMonth(null); }}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid transparent',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                Tudo
              </button>
            )}
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {summaryCards.map((card, i) => (
              <div
                key={card.label}
                className="fade-up"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${card.colorDim} 0%, transparent 60%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  fontSize: '11px',
                  fontFamily: 'var(--sans)',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  position: 'relative',
                }}>
                  {card.label}
                </div>
                <div style={{
                  fontSize: '22px',
                  fontFamily: 'var(--mono)',
                  fontWeight: 700,
                  color: card.color,
                  position: 'relative',
                }}>
                  {formatBRL(card.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--sans)' }}>
                <thead>
                  <tr>
                    {['Mês', 'Gasto', 'Impostos', 'Total'].map((h) => (
                      <th key={h} style={{
                        padding: '12px 20px',
                        textAlign: h === 'Mês' ? 'left' : 'right',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr
                      key={m.monthStart}
                      className="fade-up"
                      style={{
                        animationDelay: `${i * 0.04}s`,
                        borderTop: '1px solid var(--border)',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px', color: 'var(--text)', fontSize: '13px', fontFamily: 'var(--mono)' }}>
                        {formatMonthBR(m.monthStart)}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                          <div style={{
                            width: '80px',
                            height: '4px',
                            background: 'var(--border)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${(m.spend / maxSpend) * 100}%`,
                              height: '100%',
                              background: 'var(--accent)',
                              borderRadius: '2px',
                            }} />
                          </div>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)', minWidth: '90px', textAlign: 'right' }}>
                            {formatBRL(m.spend)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)' }}>
                        {m.tax > 0 ? formatBRL(m.tax) : '—'}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
                        {formatBRL(m.total)}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr style={{ borderTop: '2px solid var(--border-light)', background: 'var(--surface-alt)' }}>
                    <td style={{ padding: '14px 20px', fontSize: '13px', fontFamily: 'var(--sans)', color: 'var(--text-dim)', fontWeight: 600 }}>
                      Total
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>
                      {formatBRL(totals.spend)}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)', fontWeight: 600 }}>
                      {formatBRL(totals.tax)}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text)', fontWeight: 700 }}>
                      {formatBRL(totals.total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Updated at */}
          {data.updatedAt && (
            <div style={{ marginTop: '16px', fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
              Atualizado em {format(toZonedTime(new Date(data.updatedAt), 'America/Sao_Paulo'), 'dd/MM/yyyy HH:mm')}
            </div>
          )}
        </>
      )}
    </div>
  );
}
