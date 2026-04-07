import { useState, useRef, useEffect } from 'react';
import type { Campaign } from '../types';

interface Props {
  campaigns: Campaign[];
  selected: string | null;
  onChange: (campaignId: string | null) => void;
}

export default function CampaignFilter({ campaigns, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCampaign = campaigns.find((c) => c.campaignId === selected) ?? null;

  const filtered = campaigns.filter((c) =>
    c.campaignName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleOpen() {
    setOpen(true);
    setSearch('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleSelect(campaignId: string | null) {
    onChange(campaignId);
    setOpen(false);
    setSearch('');
  }

  if (campaigns.length === 0) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{
        fontSize: '11px',
        fontFamily: 'var(--sans)',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
      }}>
        Campanha
      </span>

      <div ref={containerRef} style={{ position: 'relative', width: '320px' }}>
        {/* Trigger */}
        <button
          onClick={handleOpen}
          style={{
            width: '100%',
            padding: '7px 12px',
            borderRadius: '8px',
            border: `1px solid ${open ? 'var(--border-light)' : 'var(--border)'}`,
            background: 'var(--surface)',
            color: selectedCampaign ? 'var(--text)' : 'var(--text-muted)',
            fontFamily: 'var(--mono)',
            fontSize: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            transition: 'border-color 0.1s',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedCampaign ? selectedCampaign.campaignName : 'Todas as campanhas'}
          </span>
          <span style={{ color: 'var(--text-muted)', flexShrink: 0, fontSize: '10px' }}>▾</span>
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            zIndex: 100,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {/* Search input */}
            <div style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar campanha..."
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)',
                  color: 'var(--text)',
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Options */}
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              <button
                onClick={() => handleSelect(null)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  textAlign: 'left',
                  background: selected === null ? 'var(--surface-alt)' : 'transparent',
                  color: selected === null ? 'var(--text)' : 'var(--text-dim)',
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-alt)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = selected === null ? 'var(--surface-alt)' : 'transparent')}
              >
                Todas as campanhas
              </button>

              {filtered.length === 0 && (
                <div style={{ padding: '12px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center' }}>
                  Nenhuma campanha encontrada
                </div>
              )}

              {filtered.map((c) => (
                <button
                  key={c.campaignId}
                  onClick={() => handleSelect(c.campaignId)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    textAlign: 'left',
                    background: selected === c.campaignId ? 'var(--surface-alt)' : 'transparent',
                    color: selected === c.campaignId ? 'var(--text)' : 'var(--text-dim)',
                    fontFamily: 'var(--mono)',
                    fontSize: '12px',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-alt)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = selected === c.campaignId ? 'var(--surface-alt)' : 'transparent')}
                >
                  {c.campaignName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
