import React, { useState, useEffect } from 'react';
import { apiService } from '../api';
import { Package, Save, RefreshCcw, Clock, AlertCircle, CheckCircle2, TrendingUp, Info, BarChart3, Settings } from 'lucide-react';

import { translations, Language } from '../i18n';

interface ProductionTime {
  product_type: string;
  min_days: number;
  max_days: number;
  updated_at?: string;
}

interface AdminProductionTimesProps {
  lang: Language;
}

export const AdminProductionTimes: React.FC<AdminProductionTimesProps> = ({ lang }) => {
  const t = translations[lang];
  const [times, setTimes] = useState<ProductionTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiService.fetchProductionTimes();
      setTimes(data);
      setError(null);
    } catch (err) {
      setError(t.connError || 'Lost connection to production server (EFS Node 1).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (productType: string, minDays: number, maxDays: number) => {
    setSaving(productType);
    setSuccessMsg(null);
    try {
      await apiService.updateProductionTime(productType, minDays, maxDays);
      setSuccessMsg(t.synchronized);
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadData();
    } catch (err) {
      setError(t.updateProdError || 'Update failed: Kernel error during synchronization.');
    } finally {
      setSaving(null);
    }
  };

  const handleInputChange = (productType: string, field: 'min_days' | 'max_days', value: string) => {
    const numValue = parseInt(value) || 0;
    setTimes(prev => prev.map(t => 
      t.product_type === productType ? { ...t, [field]: numValue } : t
    ));
  };

  if (loading) return (
    <div className="prod-loading-container">
      <div className="prod-loader"></div>
      <p className="prod-loading-text">RECALIBRATING NEURAL ENGINE...</p>
    </div>
  );

  return (
    <div className="main-content prod-page-container">
      {/* Background Decor */}
      <div className="prod-bg-glow"></div>
      
      {/* Success Notification */}
      {successMsg && (
        <div className="prod-toast">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="prod-inner-scroll">
        {/* Header */}
        <header className="aura-header slide-up">
          <div className="header-icon-box">
            <Settings size={28} className="spin-slow" />
          </div>
          <div className="header-info-group">
            <h2 className="aura-title">{t.adminProdTitle}</h2>
            <p className="aura-subtitle">{t.adminProdSubtitle}</p>
          </div>
        </header>

        {/* Stats Board */}
        <div className="prod-stats-grid">
          <div className="prod-stat-item">
            <div className="prod-stat-label">{t.systemNodes}</div>
            <div className="prod-stat-value">{times.length}</div>
            <div className="prod-stat-tag blue">{t.stable}</div>
          </div>
          <div className="prod-stat-item">
            <div className="prod-stat-label">{t.avgLatency}</div>
            <div className="prod-stat-value">2ms</div>
            <div className="prod-stat-tag green">{t.fast}</div>
          </div>
          <div className="prod-stat-item">
            <div className="prod-stat-label">{t.agentSync}</div>
            <div className="prod-stat-value">LIVE</div>
            <div className="prod-stat-tag orange">{t.ready}</div>
          </div>
        </div>

        {error && (
          <div className="prod-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Cards Grid */}
        <div className="prod-cards-grid">
          {times.map((item, idx) => (
            <div 
              key={item.product_type}
              className="glass-card prod-node-card fade-up"
              style={{ animationDelay: `${idx * 0.1}s`, padding: '24px' }}
            >
              <div className="prod-card-inner">
                <div className="prod-card-top">
                  <div className="prod-type-id">ID-{item.product_type.slice(0,3).toUpperCase()}</div>
                  <div className="prod-icon-box">
                    <Package size={20} />
                  </div>
                </div>

                <h3 className="prod-card-name">{item.product_type}</h3>
                
                <div className="prod-inputs-group">
                  <div className="prod-input-box">
                    <label>{t.minEstimate}</label>
                    <div className="input-field-wrap">
                      <input 
                        type="number"
                        value={item.min_days}
                        onChange={(e) => handleInputChange(item.product_type, 'min_days', e.target.value)}
                      />
                      <div className="input-unit">{t.days}</div>
                    </div>
                  </div>

                  <div className="prod-input-box">
                    <label>{t.maxEstimate}</label>
                    <div className="input-field-wrap">
                      <input 
                        type="number"
                        value={item.max_days}
                        onChange={(e) => handleInputChange(item.product_type, 'max_days', e.target.value)}
                      />
                      <div className="input-unit">{t.days}</div>
                    </div>
                  </div>
                </div>

                <div className="prod-card-footer">
                  <div className="prod-timestamp">
                    {item.updated_at ? `LOG: ${new Date(item.updated_at).toLocaleDateString()}` : 'GENESIS'}
                  </div>
                  <button
                    onClick={() => handleUpdate(item.product_type, item.min_days, item.max_days)}
                    disabled={saving === item.product_type}
                    className="prod-save-btn"
                  >
                    {saving === item.product_type ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>{t.synchronize}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instruction Panel */}
        <div className="prod-info-panel">
          <div className="prod-info-header">
            <BarChart3 size={20} className="text-amber-500" />
            <h3>{t.logicAnalysis}</h3>
          </div>
          <p>
            {t.prodLogicInfo} 
            <br/>
            {t.prodLogicFormula}
            <br/>
            <em>{t.prodLogicNote}</em>
          </p>
        </div>
      </div>

      <style>{`
        .prod-page-container {
          position: relative;
          z-index: 1;
          background: transparent;
          min-height: 100%;
        }

        .prod-inner-scroll {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .prod-bg-glow {
          position: fixed;
          top: -100px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--primary-glow), transparent 70%);
          z-index: -1;
          pointer-events: none;
          opacity: 0.3;
        }

        /* Stats Board */
        .prod-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .prod-stat-item {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          padding: 24px;
          border-radius: 24px;
          position: relative;
          box-shadow: var(--shadow-md);
        }

        .prod-stat-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .prod-stat-value {
          font-size: 28px;
          font-weight: 900;
          color: var(--text-main);
        }

        .prod-stat-tag {
          position: absolute;
          top: 24px;
          right: 24px;
          font-size: 9px;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .prod-stat-tag.blue { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
        .prod-stat-tag.green { background: rgba(16, 185, 129, 0.1); color: #34d399; }
        .prod-stat-tag.orange { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }

        /* Cards Style */
        .prod-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .prod-node-card {
          position: relative;
          min-height: 280px;
          background: var(--glass-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--glass-border);
          border-radius: 32px;
          box-shadow: var(--shadow-lg);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .prod-node-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.2);
        }

        .prod-card-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .prod-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .prod-type-id {
          font-family: monospace;
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 700;
        }

        .prod-icon-box {
          color: var(--primary);
          background: var(--primary-glow);
          padding: 10px;
          border-radius: 14px;
        }

        .prod-card-name {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 32px;
          text-transform: capitalize;
        }

        .prod-inputs-group {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .prod-input-box {
          flex: 1;
        }

        .prod-input-box label {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: var(--text-muted);
          margin-bottom: 10px;
          letter-spacing: 0.1em;
        }

        .input-field-wrap {
          position: relative;
          background: var(--input-bg);
          border: 1px solid var(--glass-border);
          border-radius: 18px;
          transition: 0.3s;
        }

        .input-field-wrap:focus-within {
          border-color: var(--primary);
          background: var(--dropdown-bg);
          box-shadow: 0 0 20px var(--primary-glow);
        }

        .input-field-wrap input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 16px;
          padding-right: 45px;
          color: var(--text-main);
          font-size: 20px;
          font-weight: 800;
          outline: none;
          text-align: left;
        }

        .input-unit {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 8px;
          font-weight: 800;
          color: var(--text-muted);
        }

        .prod-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid var(--glass-border);
        }

        .prod-timestamp {
          font-family: monospace;
          font-size: 10px;
          color: var(--text-muted);
        }

        .prod-save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .prod-save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px var(--primary-glow);
        }

        /* Generic Alerts/Toasts */
        .prod-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          font-weight: 600;
          font-size: 14px;
        }

        .prod-toast {
          position: fixed;
          top: 30px;
          right: 30px;
          background: #10b981;
          color: white;
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: var(--shadow-lg);
          font-weight: 800;
          font-size: 13px;
          z-index: 10000;
        }

        /* Loading */
        .prod-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 500px;
        }

        .prod-loader {
          width: 48px; height: 48px;
          border: 4px solid var(--primary-glow);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 24px;
        }

        .prod-loading-text {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: var(--primary);
        }

        .prod-info-panel {
          margin-top: 64px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: 32px;
          border-radius: 32px;
          box-shadow: var(--shadow-md);
        }

        .prod-info-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .prod-info-header h3 {
          font-size: 14px;
          font-weight: 800;
          color: var(--primary);
          margin: 0;
          letter-spacing: 0.05em;
        }

        .prod-info-panel p {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.8;
          margin: 0;
        }

        /* Animations */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin 8s linear infinite; }
        
        @keyframes slideUpFade {
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Helpers */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none; margin: 0;
        }
      `}</style>
    </div>
  );
};

export default AdminProductionTimes;
