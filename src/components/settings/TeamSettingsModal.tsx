'use client';

import React, { useState } from 'react';
import { X, Users, Truck, UserPlus, Trash2, Shield, LogOut, Check, Phone, Mail, MapPin, DollarSign } from 'lucide-react';
import { UserRole, ROLE_PERMISSIONS } from '../../types/teamRoles';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useCODOrders } from '../../hooks/useCODOrders';
import { useAuth } from '../../hooks/useAuth';
import { formatFCFA } from '../../utils/formatters';

interface TeamSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'team' | 'riders' | 'account'>('team');
  const { members, addMember, removeMember } = useTeamMembers();
  const { livreurs, saveLivreurs } = useCODOrders();
  const { user, signOut } = useAuth();

  // New member form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('assistant');

  // New livreur form
  const [newLivreurName, setNewLivreurName] = useState('');
  const [newLivreurPhone, setNewLivreurPhone] = useState('');
  const [newLivreurZone, setNewLivreurZone] = useState('Cotonou & Calavi');
  const [newLivreurFee, setNewLivreurFee] = useState(1500);

  if (!isOpen) return null;

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    addMember({
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      phone: newMemberPhone.trim() || '+229 00 00 00 00',
      role: newMemberRole,
    });
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
  };

  const handleAddLivreurSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLivreurName.trim() || !newLivreurPhone.trim()) return;
    const newRider = {
      id: crypto.randomUUID(),
      name: newLivreurName.trim(),
      phone: newLivreurPhone.trim(),
      zone: newLivreurZone.trim(),
      deliveryFee: newLivreurFee,
      returnFee: 500,
    };
    saveLivreurs([...livreurs, newRider]);
    setNewLivreurName('');
    setNewLivreurPhone('');
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box settings-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <Users className="w-5 h-5 text-gold-deep" />
            <h2>⚙️ Paramètres, Équipe & Livreurs</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="settings-nav-tabs">
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Équipe & Assistant ({members.length})</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'riders' ? 'active' : ''}`}
            onClick={() => setActiveTab('riders')}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Livreurs & Zones ({livreurs.length})</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Mon Compte</span>
          </button>
        </div>

        <div className="settings-modal-body">
          {/* TAB 1: TEAM MEMBERS */}
          {activeTab === 'team' && (
            <div className="settings-pane">
              <p className="settings-desc">
                Ajoutez vos collaborateurs et votre assistant. Vous pouvez leur donner un accès total ou restreindre l'accès à certaines pages.
              </p>

              {/* Add Member Form */}
              <form onSubmit={handleAddMemberSubmit} className="add-member-form">
                <div className="form-input-row">
                  <input
                    type="text"
                    required
                    placeholder="Nom complet (ex: Marc KOFFI)"
                    className="po-text-input flex-1"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email collaborateur"
                    className="po-text-input flex-1"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                </div>

                <div className="form-input-row" style={{ marginTop: '8px' }}>
                  <input
                    type="tel"
                    placeholder="Numéro WhatsApp"
                    className="po-text-input flex-1"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                  />
                  <select
                    className="po-select-input flex-1"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                  >
                    <option value="assistant">🤝 Assistant de Direction (Accès 100% Total)</option>
                    <option value="media_buyer">🎬 Média Buyer (Ads & Pages de Vente)</option>
                    <option value="logistics">🚚 Responsable Logistique (Suivi COD)</option>
                    <option value="inventory">📦 Magasinier (Stocks)</option>
                  </select>
                  <button type="submit" className="btn-add-member">
                    <UserPlus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </form>

              {/* Members List */}
              <div className="team-members-list">
                {members.map((member) => {
                  const perm = ROLE_PERMISSIONS[member.role];
                  return (
                    <div key={member.id} className="team-member-card">
                      <div className="member-info">
                        <strong className="member-name">{member.name}</strong>
                        <div className="member-meta">
                          <span><Mail className="w-3 h-3 inline" /> {member.email}</span>
                          <span>·</span>
                          <span><Phone className="w-3 h-3 inline" /> {member.phone}</span>
                        </div>
                      </div>
                      <div className="member-role-actions">
                        <span className={`role-badge-pill ${member.role}`}>
                          {perm?.label || member.role}
                        </span>
                        {member.role !== 'admin' && (
                          <button
                            type="button"
                            className="btn-del-item"
                            title="Retirer ce collaborateur"
                            onClick={() => removeMember(member.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LIVREURS / RIDERS */}
          {activeTab === 'riders' && (
            <div className="settings-pane">
              <p className="settings-desc">
                Enregistrez vos livreurs de confiance. Vous pourrez ensuite leur assigner des colis en 1 clic dans l'onglet <strong>🚚 Suivi COD</strong> !
              </p>

              {/* Add Livreur Form */}
              <form onSubmit={handleAddLivreurSubmit} className="add-member-form">
                <div className="form-input-row">
                  <input
                    type="text"
                    required
                    placeholder="Nom du Livreur (ex: Boris Express)"
                    className="po-text-input flex-1"
                    value={newLivreurName}
                    onChange={(e) => setNewLivreurName(e.target.value)}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Numéro WhatsApp Livreur"
                    className="po-text-input flex-1"
                    value={newLivreurPhone}
                    onChange={(e) => setNewLivreurPhone(e.target.value)}
                  />
                </div>
                <div className="form-input-row" style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    placeholder="Zone couverte (ex: Cotonou & Calavi)"
                    className="po-text-input flex-1"
                    value={newLivreurZone}
                    onChange={(e) => setNewLivreurZone(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Commission / course (FCFA)"
                    className="po-text-input flex-1"
                    value={newLivreurFee}
                    onChange={(e) => setNewLivreurFee(Number(e.target.value) || 1500)}
                  />
                  <button type="submit" className="btn-add-member">
                    <UserPlus className="w-4 h-4" />
                    <span>Ajouter Livreur</span>
                  </button>
                </div>
              </form>

              {/* Livreur List */}
              <div className="team-members-list">
                {livreurs.map((r) => (
                  <div key={r.id} className="team-member-card">
                    <div className="member-info">
                      <strong className="member-name">{r.name}</strong>
                      <div className="member-meta">
                        <span><Phone className="w-3 h-3 inline text-emerald-600" /> {r.phone}</span>
                        <span>·</span>
                        <span><MapPin className="w-3 h-3 inline text-sky-600" /> {r.zone}</span>
                      </div>
                    </div>
                    <div className="member-role-actions">
                      <span className="livreur-fee-pill">
                        {formatFCFA(r.deliveryFee)} / course
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT & SIGNOUT */}
          {activeTab === 'account' && (
            <div className="settings-pane">
              <div className="account-info-box">
                <div className="account-avatar-large">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" />
                  ) : (
                    <span>👑</span>
                  )}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{user?.email || 'Admin Siftly'}</h3>
                  <span style={{ fontSize: '11.5px', color: '#888', fontFamily: 'IBM Plex Mono' }}>
                    Compte Propriétaire vérifié · Supabase Sync Connecté ✅
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn-logout-full"
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se Déconnecter de la Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="po-modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
