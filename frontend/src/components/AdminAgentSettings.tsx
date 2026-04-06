import React, { useState, useEffect } from 'react';
import { Shield, Settings, CheckCircle, XCircle, Info, Eye, EyeOff, Copy } from 'lucide-react';
import { apiService } from '../api';
import { translations, Language } from '../i18n';

interface Capability {
  id: string;
  name: string;
  desc: string;
  roles: string[];
}

interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: Capability[];
}

interface ProviderKeys {
  customcat_key: string;
  pentifine_key: string;
  merchize_key: string;
  model_api_key: string;
  model_api_url: string;
  default_model: string;
  telegram_token: string;
  eleven_key: string;
  voice_id: string;
  eleven_model_id: string;
}

interface AdminAgentSettingsProps {
  lang: Language;
}

export const AdminAgentSettings: React.FC<AdminAgentSettingsProps> = ({ lang }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [keys, setKeys] = useState<ProviderKeys>({
    customcat_key: '',
    pentifine_key: '',
    merchize_key: '',
    model_api_key: '',
    model_api_url: '',
    default_model: '',
    telegram_token: '',
    eleven_key: '',
    voice_id: '',
    eleven_model_id: ''
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [savingKeys, setSavingKeys] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agentsData, keysData] = await Promise.all([
        apiService.fetchAgents(),
        apiService.fetchProviderKeys()
      ]);
      setAgents(agentsData);
      setKeys(keysData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateKeys = async () => {
    setSavingKeys(true);
    try {
      await apiService.updateProviderKeys(keys);
      alert(t.updateSuccess);
    } catch (e) {
      console.error(e);
      alert('Failed to update provider keys');
    } finally {
      setSavingKeys(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple toast would be better, but alert for now
    // Or just a visual feedback on the button
  };

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePermission = async (agentId: string, cap: Capability) => {
    const isEveryone = cap.roles.includes('user');
    const newRoles = isEveryone ? ['admin'] : ['admin', 'user'];
    
    setUpdating(`${agentId}-${cap.id}`);
    try {
      await apiService.updateAgentCapability(agentId, cap.id, newRoles);
      // Update local state
      setAgents((prev: Agent[]) => prev.map((a: Agent) => {
        if (a.id === agentId) {
          return {
            ...a,
            capabilities: a.capabilities.map((c: Capability) => {
              if (c.id === cap.id) return { ...c, roles: newRoles };
              return c;
            })
          };
        }
        return a;
      }));
    } catch (e) {
      console.error(e);
      alert('Failed to update permission');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-container fade-in">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container fade-in">
      <div className="admin-header">
        <div className="admin-title-group">
          <Settings className="admin-icon" size={28} />
          <div>
            <h1>{t.adminAgentSettingsTitle}</h1>
            <p className="admin-subtitle">{t.adminAgentSettingsSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="agents-grid slide-up">
        {agents.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card-header">
              <div className="agent-icon-wrapper">
                <Settings size={22} />
              </div>
              <h3>{(t as any)[`agent_${agent.id}`] || agent.name}</h3>
            </div>
            <p className="agent-desc">{(t as any)[`agent_${agent.id}_desc`] || agent.description}</p>
            
            <div className="capabilities-list">
              <div className="list-header">
                <span>{t.capability}</span>
                <span>{t.access}</span>
              </div>
              
              {agent.capabilities.map(cap => {
                const isEveryone = cap.roles.includes('user');
                const isUpdating = updating === `${agent.id}-${cap.id}`;
                const capName = (t as any)[`cap_${cap.id}`] || cap.name;
                const capDesc = (t as any)[`cap_${cap.id}_desc`] || cap.desc;
                
                return (
                  <div key={cap.id} className="capability-item">
                    <div className="cap-info">
                      <div className="cap-name">
                        {capName}
                        <div className="cap-tooltip">
                          <Info size={12} />
                          <span className="tooltip-text">{capDesc}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className={`perm-toggle ${isEveryone ? 'everyone' : 'admin-only'} ${isUpdating ? 'loading' : ''}`}
                      onClick={() => togglePermission(agent.id, cap)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="mini-spinner"></div>
                      ) : isEveryone ? (
                        <><CheckCircle size={14} /> {t.everyone}</>
                      ) : (
                        <><Shield size={14} /> {t.onlyAdmin}</>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="provider-keys-section glass-panel slide-up">
        <div className="section-header">
          <Shield className="text-secondary" size={24} />
          <div>
            <h2>{t.providerKeysTitle}</h2>
            <p>{t.providerKeysSubtitle}</p>
          </div>
        </div>

        <div className="config-categories">
          {/* AI Configuration Section */}
          <div className="config-category">
            <h4 className="category-title">AI Intelligence</h4>
            <div className="keys-grid">
              {[
                { id: 'model_api_key' as const, label: t.modelApiKey, val: keys.model_api_key },
                { id: 'model_api_url' as const, label: t.modelApiUrl, val: keys.model_api_url },
                { id: 'default_model' as const, label: t.defaultModel, val: keys.default_model },
              ].map(item => (
                <div key={item.id} className="key-input-group">
                  <label>{item.label}</label>
                  <div className="input-with-actions">
                    <input 
                      type={showKeys[item.id] ? "text" : "password"} 
                      value={item.val || ''}
                      onChange={e => setKeys({...keys, [item.id]: e.target.value})}
                      placeholder={t.keyPlaceholder}
                    />
                    <div className="input-actions">
                      <button className="action-icon-btn" onClick={() => toggleShowKey(item.id)}>
                        {showKeys[item.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button className="action-icon-btn" onClick={() => copyToClipboard(item.val)}>
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="config-divider"></div>

          {/* Telegram Section */}
          <div className="config-category">
            <h4 className="category-title">Communication Hub</h4>
            <div className="keys-grid">
              <div className="key-input-group">
                <label>{t.telegramToken}</label>
                <div className="input-with-actions">
                  <input 
                    type={showKeys['telegram_token'] ? "text" : "password"} 
                    value={keys.telegram_token}
                    onChange={e => setKeys({...keys, telegram_token: e.target.value})}
                    placeholder={t.keyPlaceholder}
                  />
                  <div className="input-actions">
                    <button className="action-icon-btn" onClick={() => toggleShowKey('telegram_token')}>
                      {showKeys['telegram_token'] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button className="action-icon-btn" onClick={() => copyToClipboard(keys.telegram_token)}>
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="config-divider"></div>

          {/* ElevenLabs Section */}
          <div className="config-category">
            <h4 className="category-title">Voice & Audio (ElevenLabs)</h4>
            <div className="keys-grid">
              {[
                { id: 'eleven_key' as const, label: t.elevenKey, val: keys.eleven_key },
                { id: 'voice_id' as const, label: t.voiceId, val: keys.voice_id },
                { id: 'eleven_model_id' as const, label: t.elevenModelId, val: keys.eleven_model_id },
              ].map(item => (
                <div key={item.id} className="key-input-group">
                  <label>{item.label}</label>
                  <div className="input-with-actions">
                    <input 
                      type={showKeys[item.id] ? "text" : "password"} 
                      value={item.val || ''}
                      onChange={e => setKeys({...keys, [item.id]: e.target.value})}
                      placeholder={t.keyPlaceholder}
                    />
                    <div className="input-actions">
                      <button className="action-icon-btn" onClick={() => toggleShowKey(item.id)}>
                        {showKeys[item.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button className="action-icon-btn" onClick={() => copyToClipboard(item.val)}>
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="config-divider"></div>

          {/* Production Partners Section */}
          <div className="config-category">
            <h4 className="category-title">Production Partners</h4>
            <div className="keys-grid">
              {[
                { id: 'customcat_key' as const, label: t.customCatKey, val: keys.customcat_key },
                { id: 'pentifine_key' as const, label: t.pentifineKey, val: keys.pentifine_key },
                { id: 'merchize_key' as const, label: t.merchizeKey, val: keys.merchize_key },
              ].map(item => (
                <div key={item.id} className="key-input-group">
                  <label>{item.label}</label>
                  <div className="input-with-actions">
                    <input 
                      type={showKeys[item.id] ? "text" : "password"} 
                      value={item.val || ''}
                      onChange={e => setKeys({...keys, [item.id]: e.target.value})}
                      placeholder={t.keyPlaceholder}
                    />
                    <div className="input-actions">
                      <button className="action-icon-btn" onClick={() => toggleShowKey(item.id)}>
                        {showKeys[item.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button className="action-icon-btn" onClick={() => copyToClipboard(item.val)}>
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-footer">
          <button 
            className={`save-btn ${savingKeys ? 'loading' : ''}`}
            onClick={handleUpdateKeys}
            disabled={savingKeys}
          >
            {savingKeys ? t.saving : t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};
