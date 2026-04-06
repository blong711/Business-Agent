import React, { useState } from 'react';
import { Employee } from '../types';
import { apiService } from '../api';

import { translations, Language } from '../i18n';

interface AdminEmployeesProps {
  employees: Employee[];
  isLoading: boolean;
  onRefresh: () => void;
  lang: Language;
}

export const AdminEmployees: React.FC<AdminEmployeesProps> = ({ employees, isLoading, onRefresh, lang }) => {
  const t = translations[lang];
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (emp: Employee) => {
    setEditingEmployee({ ...emp });
  };

  const handleSave = async () => {
    if (!editingEmployee) return;
    setIsSaving(true);
    try {
      await apiService.updateEmployee(editingEmployee.username, editingEmployee);
      setEditingEmployee(null);
      onRefresh();
    } catch (e) {
      console.error(e);
      alert(t.updateError || 'Update failed!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="main-content fade-in">
      <header className="aura-header slide-up">
        <div className="header-icon-box">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M10.29 11.71a4 4 0 1 0 5.42-5.42"/></svg>
        </div>
        <div className="header-info-group">
          <h2 className="aura-title">{t.adminEmpTitle}</h2>
          <p className="aura-subtitle">{t.adminEmpSubtitle}</p>
        </div>
      </header>

      {isLoading ? (
        <div className="glass-card flex-center" style={{ minHeight: '300px' }}>
          <div className="loader"></div>
          <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>{t.syncNexus}</p>
        </div>
      ) : (
        <div className="glass-card table-card fade-up">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th><div className="th-content">{t.username} / {t.empName}</div></th>
                  <th><div className="th-content">{t.empPosition}</div></th>
                  <th><div className="th-content">{t.department}</div></th>
                  <th><div className="th-content">{t.salary}</div></th>
                  <th><div className="th-content">{t.allowance}</div></th>
                  <th><div className="th-content">{t.actions}</div></th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-state">{t.noEmpData}</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.username} className="table-row-animate">
                      <td>
                        <div className="flex-align-center" style={{ gap: '12px' }}>
                          <span className="font-semibold text-white">{emp.name}</span>
                          <span className="text-muted text-xs">({emp.username})</span>
                        </div>
                      </td>
                      <td>{emp.position}</td>
                      <td><span className="role-badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>{emp.team}</span></td>
                      <td className="font-semibold text-green">
                        {emp.contract_salary.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} {lang === 'vi' ? '₫' : '$'}
                      </td>
                      <td className="text-muted">
                        {(emp.fuel_phone + emp.other + emp.meal).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} {lang === 'vi' ? '₫' : '$'}
                      </td>
                      <td>
                        <div className="action-group">
                          <button className="icon-btn edit" onClick={() => handleEdit(emp)} title={t.edit}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingEmployee && (
        <div className="modal-overlay">
          <div className="modal-content glass-card slide-up">
            <h3>{t.editEmp} {editingEmployee.name}</h3>

            <div className="form-group">
              <label>{t.empPosition}</label>
              <select
                className="modal-select"
                value={editingEmployee.position}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
              >
                <option value={t.posDirector}>{t.posDirector}</option>
                <option value={t.posSales}>{t.posSales}</option>
                <option value={t.posDev}>{t.posDev}</option>
                <option value={t.posAccountant}>{t.posAccountant}</option>
                <option value={t.posProd}>{t.posProd}</option>
                <option value={t.posMarketing}>{t.posMarketing}</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t.contractSalary}</label>
                <input
                  type="number"
                  value={editingEmployee.contract_salary}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, contract_salary: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>{t.department}</label>
                <input
                  type="text"
                  value={editingEmployee.team}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, team: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t.allowanceFuel}</label>
                <input
                  type="number"
                  value={editingEmployee.fuel_phone}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, fuel_phone: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>{t.allowanceMeal}</label>
                <input
                  type="number"
                  value={editingEmployee.meal}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, meal: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t.allowanceOther}</label>
              <input
                type="number"
                value={editingEmployee.other}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, other: Number(e.target.value) })}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setEditingEmployee(null)}>{t.cancel}</button>
              <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? t.loading : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
