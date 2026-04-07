import type { KPIs } from '../types';
import { formatBRL } from '../lib/format';

interface Props {
  kpis: KPIs;
}

interface CardDef {
  label: string;
  value: string;
  color: string;
  colorDim: string;
}

export default function KPICards({ kpis }: Props) {
  const cards: CardDef[] = [
    {
      label: 'VALOR USADO',
      value: formatBRL(kpis.valorUsado),
      color: 'var(--amber)',
      colorDim: 'var(--amber-dim)',
    },
    {
      label: 'FATURAMENTO',
      value: formatBRL(kpis.faturamento),
      color: 'var(--green)',
      colorDim: 'var(--green-dim)',
    },
    {
      label: 'ROAS',
      value: kpis.roas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      color: 'var(--purple)',
      colorDim: 'var(--purple-dim)',
    },
    {
      label: 'CPA',
      value: formatBRL(kpis.cpa),
      color: 'var(--red)',
      colorDim: 'var(--red-dim)',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="fade-up"
          style={{
            animationDelay: `${i * 0.04}s`,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--sans)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}>
            {card.label}
          </div>
          <div style={{
            fontSize: '24px',
            fontFamily: 'var(--mono)',
            fontWeight: 700,
            color: card.color,
          }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
