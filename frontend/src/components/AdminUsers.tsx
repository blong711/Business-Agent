import React from 'react';
import { UserItem } from '../types';
import { Users } from 'lucide-react';

interface AdminUsersProps {
  userList: UserItem[];
  isLoading: boolean;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ userList, isLoading }) => {
  return (
    <div className="main-content fade-in">
      <div className="admin-header">
        <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
          <Users size={28} color="#c4b5fd" />
        </div>
        <div>
          <h2 className="admin-title">Danh sách Tài khoản Hệ thống</h2>
          <p className="admin-subtitle">Giám sát và quản lý các thành viên trong hệ thống AI Business Agent</p>
        </div>
      </div>
      
      <div className="table-container fade-up">
        <table className="custom-table">
          <thead>
            <tr>
              <th><div className="th-content">Tài khoản</div></th>
              <th><div className="th-content">Phân quyền</div></th>
              <th><div className="th-content">Telegram ID</div></th>
              <th><div className="th-content">Ngày gia nhập</div></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  <div className="loader"></div>
                  <p>Đang tải danh sách...</p>
                </td>
              </tr>
            ) : userList.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  <p>Không có dữ liệu</p>
                </td>
              </tr>
            ) : (
              userList.map((u, i) => (
                <tr key={u.username} style={{ animationDelay: `${i * 0.05}s` }} className="table-row-animate">
                  <td className="font-semibold text-white">{u.username}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role.toUpperCase()}</span>
                  </td>
                  <td className="text-blue font-mono">{u.telegram_id || 'Chưa liên kết'}</td>
                  <td className="text-muted">{new Date(u.created_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
