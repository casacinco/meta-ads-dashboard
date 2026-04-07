import { useState } from 'react';
import { useMetaAdsData } from '../hooks/useMetaAdsData';
import TimeWindowPicker from '../components/TimeWindowPicker';
import KPICards from '../components/KPICards';
import SpendChart from '../components/SpendChart';
import CampaignTable from '../components/CampaignTable';
import AdTable from '../components/AdTable';
import CampaignFilter from '../components/CampaignFilter';
import { formatDateBR } from '../lib/format';

export default function MetaAds() {
  const { kpis, timeseries, campaigns, ads, loading, error, dateRange, timeWindow, setTimeWindow } = useMetaAdsData();
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

  const filteredCampaigns = selectedCampaigns.length > 0
    ? campaigns.filter((c) => selectedCampaigns.includes(c.campaignId))
    : campaigns;

  const filteredAds = selectedCampaigns.length > 0
    ? ads.filter((a) => selectedCampaigns.includes(a.campaignId))
    : ads;

  return (
    <div style={{ padding: '32px', width: '80%', maxWidth: 'none' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--green-dim)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '12px',
            fontFamily: 'var(--mono)',
            color: 'var(--green)',
          }}>
            <span className="status-dot" />
            Conta Meta Ads
          </span>
        </div>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontFamily: 'var(--sans)', fontWeight: 700, color: 'var(--text)' }}>
          Meta Ads
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--sans)' }}>
          Relatório geral da conta
        </p>
      </div>

      {/* Time picker */}
      <div style={{ marginBottom: '24px' }}>
        <TimeWindowPicker value={timeWindow} onChange={setTimeWindow} />
        <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
          {formatDateBR(dateRange.startDate)} → {formatDateBR(dateRange.endDate)}
        </div>
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

      {!loading && kpis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <KPICards kpis={kpis} />
          {timeseries.length > 0 && <SpendChart data={timeseries} />}
          <CampaignFilter
            campaigns={campaigns}
            selected={selectedCampaigns}
            onChange={setSelectedCampaigns}
          />
          <CampaignTable campaigns={filteredCampaigns} />
          <AdTable ads={filteredAds} />
        </div>
      )}
    </div>
  );
}
