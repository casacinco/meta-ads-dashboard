import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus('idle');
    try {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const res = await fetch(
        `/api/sync/trigger?startDate=${yesterday}&endDate=${today}`,
        { method: 'POST', headers: { Authorization: 'Bearer jacyra' } }
      );
      const data = await res.json();
      setSyncStatus(data.success ? 'success' : 'error');
    } catch {
      setSyncStatus('error');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const linkStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    fontFamily: 'var(--sans)',
    color: isActive ? 'var(--text)' : 'var(--text-dim)',
    background: isActive ? 'var(--surface-alt)' : 'transparent',
    transition: 'all 0.15s',
  });

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      boxSizing: 'border-box',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'var(--surface-alt)',
          borderRadius: '8px',
          marginBottom: '4px',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontFamily: 'var(--mono)',
            color: 'var(--accent)',
            fontWeight: 600,
          }}>
            B
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--sans)' }}>
            Meta Dashboard
          </span>
        </div>
      </div>
      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px' }} />
      {/* Nav */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          padding: '0 12px',
          marginBottom: '8px',
          fontFamily: 'var(--sans)',
        }}>
          Relatórios
        </div>
        <NavLink to="/meta-ads" style={({ isActive }) => linkStyle(isActive)}>
          <span style={{ color: 'inherit', fontSize: '14px' }}>◈</span>
          Meta Ads
        </NavLink>
        <NavLink to="/financeiro" style={({ isActive }) => linkStyle(isActive)} end>
          <span style={{ color: 'inherit', fontSize: '14px' }}>$</span>
          Financeiro
        </NavLink>
      </div>
      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />
      {/* Sync Button */}
      <button
        onClick={handleSync}
        disabled={syncing}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: syncStatus === 'success' ? 'var(--accent-dim)' : syncStatus === 'error' ? '#3a1a1a' : 'var(--surface-alt)',
          color: syncStatus === 'success' ? 'var(--accent)' : syncStatus === 'error' ? '#f87171' : 'var(--text-dim)',
          fontSize: '12px',
          fontFamily: 'var(--sans)',
          cursor: syncing ? 'wait' : 'pointer',
          transition: 'all 0.15s',
          width: '100%',
        }}
      >
        <span style={{ fontSize: '14px' }}>
          {syncing ? '⏳' : syncStatus === 'success' ? '✓' : syncStatus === 'error' ? '✗' : '↻'}
        </span>
        {syncing ? 'Sincronizando...' : syncStatus === 'success' ? 'Sincronizado!' : syncStatus === 'error' ? 'Erro no sync' : 'Sincronizar dados'}
      </button>
      {/* Footer */}
      <div style={{
        marginTop: 'auto',
        fontSize: '11px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--sans)',
        padding: '0 12px',
      }}>
        Meta Marketing API
      </div>
    </aside>
  );
}