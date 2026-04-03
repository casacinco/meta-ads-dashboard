import type { TimeWindow } from '../types';

interface Props {
  value: TimeWindow;
  onChange: (w: TimeWindow) => void;
}

const OPTIONS: { value: TimeWindow; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: '7d', label: '7 dias' },
  { value: '14d', label: '14 dias' },
  { value: '30d', label: '30 dias' },
  { value: 'this_month', label: 'Este mês' },
  { value: 'last_month', label: 'Mês passado' },
];

export default function TimeWindowPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: `1px solid ${value === opt.value ? 'var(--border-light)' : 'transparent'}`,
            background: value === opt.value ? 'var(--surface-alt)' : 'transparent',
            color: value === opt.value ? 'var(--text)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
