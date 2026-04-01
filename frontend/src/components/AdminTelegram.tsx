import React from 'react';
import { TelegramGroup, TelegramMember } from '../types';
import { MessageSquare, ArrowLeft } from 'lucide-react';

interface AdminTelegramProps {
  groups: TelegramGroup[];
  members: TelegramMember[];
  selectedGroup: TelegramGroup | null;
  onSelectGroup: (chatId: number, group: TelegramGroup) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const AdminTelegram: React.FC<AdminTelegramProps> = ({
  groups,
  members,
  selectedGroup,
  onSelectGroup,
  onBack,
  isLoading
}) => {
  return (
    <div className="main-content fade-in">
      {!selectedGroup ? (
        <>
          <div className="admin-header">
            <div className="header-icon-box" style={{ background: 'rgba(56, 189, 248, 0.2)' }}>
              <MessageSquare size={28} color="#7dd3fc" />
            </div>
            <div>
              <h2 className="admin-title">Nhóm & Chat Telegram</h2>
              <p className="admin-subtitle">Quản lý các nhóm chat có sự hiện diện của AI Business Agent</p>
            </div>
          </div>
          
          <div className="table-container fade-up">
            <table className="custom-table">
              <thead>
                <tr>
                  <th><div className="th-content">Tên Nhóm / Cuộc trò chuyện</div></th>
                  <th><div className="th-content">Thể loại</div></th>
                  <th><div className="th-content">Cập nhật gần nhất</div></th>
                  <th><div className="th-content">Hành động</div></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      <div className="loader"></div>
                      <p>Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : groups.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      Chưa có nhóm nào. Vui lòng thêm bot vào nhóm Telegram và nhắn tin.
                    </td>
                  </tr>
                ) : (
                  groups.map((g, i) => (
                    <tr key={g.chat_id} style={{ animationDelay: `${i * 0.05}s` }} className="table-row-animate">
                      <td className="font-semibold text-white">{g.title || 'Private Chat'}</td>
                      <td>
                        <span className={`role-badge ${g.type === 'private' ? 'user' : 'admin'}`}>
                          {g.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-muted">{new Date(g.updated_at).toLocaleString('vi-VN')}</td>
                      <td>
                        <button 
                          className="action-btn" 
                          onClick={() => onSelectGroup(g.chat_id, g)}
                        >
                          Xem Thành viên
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="admin-header with-back">
            <button className="back-btn" onClick={onBack}>
              <ArrowLeft size={18} />
              Trở lại danh sách
            </button>
            <div className="title-group fade-in-right">
              <h2 className="admin-title" style={{ marginTop: 12 }}>
                Thành viên nhóm: <span className="highlight-text">{selectedGroup.title || 'Private Chat'}</span>
              </h2>
            </div>
          </div>
          
          <div className="table-container fade-up">
            <table className="custom-table">
              <thead>
                <tr>
                  <th><div className="th-content">Username</div></th>
                  <th><div className="th-content">Tên hiển thị</div></th>
                  <th><div className="th-content">Lần cuối tương tác</div></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="empty-state">
                      <div className="loader"></div>
                      <p>Đang tải thành viên...</p>
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="empty-state">
                      Nhóm này chưa ghi nhận thành viên nào ngoài Bot.
                    </td>
                  </tr>
                ) : (
                  members.map((m, i) => (
                    <tr key={m.user_id} style={{ animationDelay: `${i * 0.05}s` }} className="table-row-animate">
                      <td className="font-semibold text-blue">
                        {m.username ? `@${m.username}` : 'N/A'}
                      </td>
                      <td className="text-white">
                        {m.first_name || ''} {m.last_name || ''}
                      </td>
                      <td className="text-muted">{new Date(m.updated_at).toLocaleString('vi-VN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
