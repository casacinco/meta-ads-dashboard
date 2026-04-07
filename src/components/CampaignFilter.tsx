import type { Campaign } from '../types';

interface Props {
  campaigns: Campaign[];
  selected: string | null;
  onChange: (campaignId: string | null) => void;
}

export default function CampaignFilter({ campaigns, selected, onChange }: Props) {
  if (campaigns.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      <span style={{ fontSize: '11px', fontFamily: 'var(--sans)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '4px' }}>
        Campanha
      </span>
      <button
        onClick={() => onChange(null)}
        style={{
          padding: '4px 12px',
          borderRadius: '6px',
          border: `1px solid ${selected === null ? 'var(--border-light)' : 'var(--border)'}`,
          background: selected === null ? 'var(--surface-alt)' : 'transparent',
          color: selected === null ? 'var(--text)' : 'var(--text-muted)',
          fontFamily: 'var(--mono)',
          fontSize: '12px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.1s',
        }}
      >
        Todas
      </button>
      {campaigns.map((c) => (
        <button
          key={c.campaignId}
          onClick={() => onChange(c.campaignId)}
          style={{
            padding: '4px 12px',
            borderRadius: '6px',
            border: `1px solid ${selected === c.campaignId ? 'var(--border-light)' : 'var(--border)'}`,
            background: selected === c.campaignId ? 'var(--surface-alt)' : 'transparent',
            color: selected === c.campaignId ? 'var(--text)' : 'var(--text-muted)',
            fontFamily: 'var(--mono)',
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.1s',
          }}
        >
          {c.campaignName}
        </button>
      ))}
    </div>
  );
}
