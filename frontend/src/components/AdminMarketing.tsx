import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, BookOpen, Copy, CheckCircle, RefreshCw } from 'lucide-react';
import { apiService } from '../api';
import { translations, Language } from '../i18n';

interface MarketingData {
  trending_niches: any[];
  content_library: any[];
}

export const AdminMarketing: React.FC<{ lang: Language }> = ({ lang }) => {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = translations[lang];

  const loadData = async () => {
    try {
      const res = await apiService.fetchMarketingData();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/v1/marketing/sync', { method: 'POST' });
      await loadData();
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="main-content fade-in">
      <header className="aura-header slide-up">
        <div className="header-icon-box">
          <Target size={28} />
        </div>
        <div className="header-info-group">
          <h2 className="aura-title">{t.adminMarketingTitle}</h2>
          <p className="aura-subtitle">{t.adminMarketingSubtitle}</p>
        </div>
        <div className="header-actions">
          <button 
            className={`aura-btn secondary ${syncing ? 'loading' : ''}`} 
            onClick={handleSync}
            disabled={syncing}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={syncing ? 'spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Trends'}</span>
          </button>
        </div>
      </header>

      <div className="marketing-grid slide-up">
        {/* Niche Analysis Section */}
        <div className="glass-card niche-section">
          <div className="card-header">
            <TrendingUp size={20} className="header-icon" />
            <h3>{t.trendingNiches}</h3>
          </div>
          <div className="niche-list">
            {data?.trending_niches.map((n) => (
              <div key={n.id} className="niche-item">
                <div className="niche-info">
                  <span className="niche-name">{n.niche}</span>
                  <span className={`status-badge ${n.status}`}>{n.status.toUpperCase()}</span>
                  <div className="niche-stat">
                    <span className="stat-label">{t.growth}</span>
                    <span className="stat-value text-green">
                      <TrendingUp size={16} />
                      {n.growth}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Library Section */}
        <div className="glass-card library-section">
          <div className="card-header">
            <BookOpen size={20} className="header-icon" />
            <h3>{t.contentLibrary}</h3>
          </div>
          <div className="content-list">
            {data?.content_library.map((c) => (
              <div key={c.id} className="content-item fade-in">
                <div className="content-type-badge">{c.type}</div>
                <div className="content-body">
                  <h4>{c.title}</h4>
                  <p>{c.description}</p>
                </div>
                <div className="content-footer">
                  <span className="content-date">{c.date}</span>
                  <button 
                    className={`copy-btn ${copiedId === c.id ? 'success' : ''}`}
                    onClick={() => handleCopy(c.id, `${c.title}\n\n${c.description}`)}
                  >
                    {copiedId === c.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copiedId === c.id ? 'Copied' : t.copyContent}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
