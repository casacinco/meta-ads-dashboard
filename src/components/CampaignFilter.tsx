import { useState, useRef, useEffect } from 'react';
import type { Campaign } from '../types';

interface Props {
  campaigns: Campaign[];
  selected: string[];
  onChange: (campaignIds: string[]) => void;
}

export default function CampaignFilter({ campaigns, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function toggleCampaign(campaignId: string) {
    if (selected.includes(campaignId)) {
      onChange(selected.filter((id) => id !== campaignId));
    } else {
      onChange([...selected, campaignId]);
    }
  }

  function clearAll() {
    onChange([]);
  }

  function selectAll() {
    const ids = filtered.map((c) => c.campaignId);
    const allAlreadySelected = ids.every((id) => selected.includes(id));
    if (allAlreadySelected) {
      onChange(selected.filter((id) => !ids.includes(id)));
    } else {
      const merged = Array.from(new Set([...selected, ...ids]));
      onChange(merged);
    }
  }

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selected.includes(c.campaignId));

  const label =
    selected.length === 0
      ? 'Todas as campanhas'
      : selected.length === 1
      ? campaigns.find((c) => c.campaignId === selected[0])?.campaignName ?? '1 campanha'
      : `${selected.length} campanhas selecionadas`;

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
            border: `1px solid ${open || selected.length > 0 ? 'var(--border-light)' : 'var(--border)'}`,
            background: 'var(--surface)',
            color: selected.length > 0 ? 'var(--text)' : 'var(--text-muted)',
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
            {label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {selected.length > 0 && (
              <span
                onClick={(e) => { e.stopPropagation(); clearAll(); }}
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  lineHeight: 1,
                  cursor: 'pointer',
                  padding: '0 2px',
                }}
                title="Limpar filtro"
              >
                ×
              </span>
            )}
            <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>▾</span>
          </div>
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
            <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
              {filtered.length > 0 && (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    background: allFilteredSelected ? 'var(--surface-alt)' : 'transparent',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { if (!allFilteredSelected) (e.currentTarget as HTMLElement).style.background = 'var(--surface-alt)'; }}
                  onMouseLeave={(e) => { if (!allFilteredSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={selectAll}
                    style={{ width: '14px', height: '14px', accentColor: 'var(--accent)', flexShrink: 0, cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    {search ? 'Selecionar resultado da busca' : 'Selecionar todos'}
                  </span>
                </label>
              )}
              {filtered.length === 0 && (
                <div style={{ padding: '12px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center' }}>
                  Nenhuma campanha encontrada
                </div>
              )}

              {filtered.map((c) => {
                const isChecked = selected.includes(c.campaignId);
                return (
                  <label
                    key={c.campaignId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: isChecked ? 'var(--surface-alt)' : 'transparent',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (!isChecked) (e.currentTarget as HTMLElement).style.background = 'var(--surface-alt)'; }}
                    onMouseLeave={(e) => { if (!isChecked) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCampaign(c.campaignId)}
                      style={{
                        width: '14px',
                        height: '14px',
                        accentColor: 'var(--accent)',
                        flexShrink: 0,
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '12px',
                      color: isChecked ? 'var(--text)' : 'var(--text-dim)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {c.campaignName}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Footer */}
            {selected.length > 0 && (
              <div style={{
                padding: '8px 12px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {selected.length} selecionada{selected.length > 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearAll}
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '11px',
                    color: 'var(--accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Limpar tudo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
