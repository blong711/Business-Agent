import React from 'react';
import { HelpCircle, BookOpen, MessageSquare, Shield, Target, Zap, ChevronRight, PlayCircle, Settings, Key } from 'lucide-react';
import { translations, Language } from '../i18n';

interface DocsProps {
  lang: Language;
}

export const Docs: React.FC<DocsProps> = ({ lang }) => {
  const t = translations[lang];

  const sections = [
    {
      id: 'intro',
      title: t.docsIntro,
      icon: <BookOpen size={20} />,
      content: lang === 'vi' 
        ? "Business Agent là hệ thống trợ lý AI đa nghiệp vụ, được thiết kế để hỗ trợ vận hành doanh nghiệp TMĐT. Hệ thống tích hợp sâu với các nhà in (CustomCat, Merchize, Pentifine) và các kênh liên lạc (Telegram) để cung cấp dữ liệu thời gian thực."
        : "Business Agent is a multi-talented AI assistant system designed to support E-commerce operations. The system integrates deeply with print providers (CustomCat, Merchize, Pentifine) and communication channels (Telegram) to provide real-time data."
    },
    {
      id: 'usage',
      title: t.docsUsage,
      icon: <Zap size={20} />,
      content: lang === 'vi'
        ? "Bạn có thể tương tác với bot thông qua khung chat bằng ngôn ngữ tự nhiên. Bot sẽ tự động phân tích ý định (Intent) của bạn để điều hướng đến bộ phận chuyên trách (Sản xuất, Kế toán, CSKH hoặc Marketing)."
        : "You can interact with the bot through the chat box using natural language. The bot will automatically analyze your intent to route you to the specialized department (Production, Accounting, CSKH, or Marketing)."
    },
    {
      id: 'skills',
      title: t.docsSkills,
      icon: <Target size={20} />,
      items: [
        { name: t.agent_production, desc: t.agent_production_desc },
        { name: t.agent_cskh, desc: t.agent_cskh_desc },
        { name: t.agent_accounting, desc: t.agent_accounting_desc },
        { name: t.agent_marketing, desc: t.agent_marketing_desc }
      ]
    },
    {
      id: 'setup',
      title: t.docsSetup,
      icon: <Settings size={20} />,
      content: t.docsSetupDesc,
      subsections: [
        {
          title: t.docsTeleSetup,
          steps: [t.docsTeleStep1, t.docsTeleStep2, t.docsTeleStep3]
        },
        {
          title: t.docsKeysSetup,
          text: lang === 'vi' 
            ? "Truy cập 'Cấu hình Agent' để nhập các API Key cần thiết. Model API Key là quan trọng nhất để AI có thể hoạt động."
            : "Go to 'Agent Settings' to enter the required API Keys. The Model API Key is the most important for the AI to function."
        }
      ]
    }
  ];

  const faqs = lang === 'vi' ? [
    { q: "Làm thế nào để liên kết Telegram?", a: "Truy cập mục 'Dữ liệu Telegram', chọn nhóm bạn muốn quản lý hoặc sử dụng lệnh /link trong trò chuyện riêng với Bot." },
    { q: "Số lượng token tiêu tốn là gì?", a: "Hệ thống hiển thị lượng tài nguyên AI đã sử dụng cho mỗi câu hỏi để bạn dễ dàng quản lý chi phí vận hành." },
    { q: "Làm cách nào để đổi Model AI?", a: "Quản trị viên có thể thay đổi Model API Key và URL trong phần 'Cấu hình Agent'." }
  ] : [
    { q: "How to link Telegram?", a: "Go to 'Telegram Data', select the group you want to manage or use the /link command in a private chat with the Bot." },
    { q: "What is token usage?", a: "The system displays the AI resources used for each question to help you manage operational costs." },
    { q: "How to change AI Model?", a: "Administrators can change the Model API Key and URL in the 'Agent Settings' section." }
  ];

  return (
    <div className="main-content docs-page fade-in">
      <header className="aura-header slide-up">
        <div className="header-icon-box">
          <HelpCircle size={28} />
        </div>
        <div className="header-info-group">
          <h2 className="aura-title">{t.docsTitle}</h2>
          <p className="aura-subtitle">{t.docsSubtitle}</p>
        </div>
      </header>

      <div className="docs-grid">
        <div className="docs-main-content">
          {sections.map((section, idx) => (
            <div key={section.id} className="glass-card docs-card slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="card-header">
                {section.icon}
                <h3>{section.title.toUpperCase()}</h3>
              </div>
              <div className="card-body">
                {section.content && <p className="docs-text">{section.content}</p>}
                {section.items && (
                  <div className="docs-skills-grid">
                    {section.items.map((item, i) => (
                      <div key={i} className="skill-guide-item">
                        <div className="skill-marker"></div>
                        <div>
                          <h4 className="skill-guide-name">{item.name}</h4>
                          <p className="skill-guide-desc">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(section as any).subsections && (
                  <div className="docs-subsections">
                    {(section as any).subsections.map((sub: any, i: number) => (
                      <div key={i} className="docs-sub-item">
                        <h4 className="sub-title">{sub.title}</h4>
                        {sub.steps && (
                          <div className="sub-steps">
                            {sub.steps.map((step: string, j: number) => (
                              <div key={j} className="step-row">
                                <span className="step-num">{j + 1}</span>
                                <span className="step-text">{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {sub.text && <p className="docs-text">{sub.text}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="docs-sidebar">
          <div className="glass-card faq-card slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-header">
              <MessageSquare size={20} />
              <h3>{t.docsFaq.toUpperCase()}</h3>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <div className="faq-q">
                    <ChevronRight size={14} className="q-icon" />
                    <span>{faq.q}</span>
                  </div>
                  <div className="faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .docs-page {
          padding: 40px;
          height: 100%;
          overflow-y: auto;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .docs-card {
          margin-bottom: 32px;
          padding: 32px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: var(--primary);
        }

        .card-header h3 {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin: 0;
          color: var(--text-main);
        }

        .docs-text {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0;
        }

        .docs-subsections {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .docs-sub-item {
          background: rgba(255,255,255,0.02);
          padding: 20px;
          border-radius: 16px;
          border: 1px dashed var(--glass-border);
        }

        .sub-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 16px 0;
        }

        .sub-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .step-num {
          width: 20px;
          height: 20px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .step-text {
          font-size: 13px;
          color: var(--text-main);
          line-height: 1.5;
        }

        .docs-skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }

        .skill-guide-item {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          transition: 0.3s;
        }

        .skill-guide-item:hover {
          background: rgba(255,255,255,0.06);
          transform: translateY(-4px);
          border-color: var(--primary-glow);
        }

        .skill-marker {
          width: 4px;
          height: 40px;
          background: var(--primary);
          border-radius: 4px;
          flex-shrink: 0;
        }

        .skill-guide-name {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 8px 0;
        }

        .skill-guide-desc {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }

        .faq-card {
          padding: 24px;
          margin-bottom: 24px;
        }

        .faq-item {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--glass-border);
        }

        .faq-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .faq-q {
          display: flex;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .q-icon {
          color: var(--primary);
          margin-top: 2px;
        }

        .faq-a {
          font-size: 12px;
          line-height: 1.6;
          color: var(--text-muted);
          padding-left: 22px;
        }

        .contact-support-card {
          padding: 24px;
        }

        .support-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .support-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .support-btn:hover {
          background: var(--secondary);
          transform: scale(1.02);
        }

        .support-note {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          margin: 0;
          font-family: monospace;
        }

        @media (max-width: 1100px) {
          .docs-grid {
            grid-template-columns: 1fr;
          }
          .docs-sidebar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .docs-skills-grid {
            grid-template-columns: 1fr;
          }
          .docs-sidebar {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
