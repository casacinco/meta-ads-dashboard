import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimeseriesPoint } from '../types';
import { formatBRL, formatDateBR } from '../lib/format';

interface Props {
  data: TimeseriesPoint[];
}

export default function SpendChart({ data }: Props) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '16px', fontFamily: 'var(--sans)' }}>
        Gasto Diário
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tickFormatter={(v: any) => formatDateBR(v)}
            tick={{ fontSize: 11, fontFamily: 'var(--mono)', fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: any) => `R$${v}`}
            tick={{ fontSize: 11, fontFamily: 'var(--mono)', fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--surface-alt)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--text)',
            }}
            formatter={(value: any) => [formatBRL(value as number), 'Valor Usado']}
            labelFormatter={(label: any) => formatDateBR(label as string)}
          />
          <Line
            type="monotone"
            dataKey="valorUsado"
            stroke="var(--amber)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
