'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Truck,
  UserPlus,
  Trash2,
  Shield,
  LogOut,
  Check,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Loader2,
  Send,
  Store,
  Save,
  Building2,
  UserCheck,
} from 'lucide-react';
import { UserRole, ROLE_PERMISSIONS } from '../../types/teamRoles';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useCODOrders } from '../../hooks/useCODOrders';
import { useAuth } from '../../hooks/useAuth';
import { useShopProfile } from '../../hooks/useShopProfile';
import { formatFCFA } from '../../utils/formatters';

interface TeamSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'team' | 'riders'>('shop');
  const { profile, updateProfile } = useShopProfile();
  const { members, addMember, removeMember } = useTeamMembers();
  const { livreurs, saveLivreurs } = useCODOrders();
  const { user, signOut } = useAuth();

  // Shop Profile state
  const [editOwnerName, setEditOwnerName] = useState(profile.ownerName || '');
  const [editShopName, setEditShopName] = useState(profile.shopName || '');
  const [editPhone, setEditPhone] = useState(profile.phone || '');
  const [editCountry, setEditCountry] = useState(profile.country || 'Bénin / Côte d\'Ivoire / Sénégal');

  const [shopCode, setShopCode] = useState('SIFT-8820');
  const [pendingEmployees, setPendingEmployees] = useState<any[]>([]);

  useEffect(() => {
    setEditOwnerName(profile.ownerName || '');
    setEditShopName(profile.shopName || '');
    setEditPhone(profile.phone || '');
    setEditCountry(profile.country || 'Bénin / Côte d\'Ivoire / Sénégal');

    if (user?.id) {
      import('../../utils/shopCodeUtils').then(({ getOrCreateShopCode }) => {
        getOrCreateShopCode(user.id, profile.shopName).then((code) => {
          setShopCode(code);
          fetch(`/api/employee/list?ownerId=${user.id}&shopCode=${code}`)
            .then((res) => res.json())
            .then((data) => setPendingEmployees(data.pending || []))
            .catch(() => {});
        });
      });
    }
  }, [profile, user, isOpen]);

  // New member form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('assistant');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // New livreur form
  const [newLivreurName, setNewLivreurName] = useState('');
  const [newLivreurPhone, setNewLivreurPhone] = useState('');
  const [newLivreurZone, setNewLivreurZone] = useState('Cotonou & Calavi');
  const [newLivreurFee, setNewLivreurFee] = useState(1500);

  // Feedback toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  if (!isOpen) return null;

  const ownerDisplayName = profile.ownerName || user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Propriétaire (Fondateur)');
  const shopDisplayName = profile.shopName || 'Ma Boutique E-Commerce';
  const ownerEmail = user?.email || 'Non connecté (Session Locale)';

  const handleSaveShopProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ownerName: editOwnerName.trim() || 'Propriétaire (Fondateur)',
      shopName: editShopName.trim() || 'Ma Boutique E-Commerce',
      phone: editPhone.trim(),
      country: editCountry.trim(),
    });
    showToast(`🏪 Identité de la boutique "${editShopName.trim() || 'Ma Boutique'}" enregistrée avec succès !`);
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    const name = newMemberName.trim();
    const email = newMemberEmail.trim();
    const phone = newMemberPhone.trim() || '';
    const role = newMemberRole;

    setIsSendingEmail(true);

    addMember({
      name,
      email,
      phone,
      role,
    });

    try {
      await fetch('/api/invite-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });
    } catch {
      // Non-blocking
    } finally {
      setIsSendingEmail(false);
    }

    showToast(`🤝 Collaborateur "${name}" rattaché avec succès ! Dès qu'il se connecte avec "${email}", votre boutique s'ouvrira automatiquement pour lui.`);

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
    showToast(`🛵 Livreur "${newLivreurName.trim()}" ajouté ! Disponible immédiatement dans l'onglet Suivi COD.`);
    setNewLivreurName('');
    setNewLivreurPhone('');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-premium" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-modal-top">
          <div className="settings-title-group">
            <div className="settings-header-icon">
              <Store className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="settings-main-title">{shopDisplayName}</h2>
              <span className="settings-sub-title">Profil Propriétaire, Collaborateurs & Livreurs</span>
            </div>
          </div>
          <button type="button" className="btn-close-settings" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Notification Banner */}
        {toastMsg && (
          <div className="settings-toast-banner">
            <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Segmented Control Tabs */}
        <div className="settings-tabs-capsule">
          <button
            type="button"
            className={`tab-capsule-item ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Ma Boutique & Profil</span>
          </button>
          <button
            type="button"
            className={`tab-capsule-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Collaborateurs</span>
            <span className="tab-count-pill">{members.length + 1}</span>
          </button>
          <button
            type="button"
            className={`tab-capsule-item ${activeTab === 'riders' ? 'active' : ''}`}
            onClick={() => setActiveTab('riders')}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Livreurs & Hub</span>
            <span className="tab-count-pill">{livreurs.length}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="settings-modal-content">
          {/* TAB 1: SHOP & OWNER PROFILE */}
          {activeTab === 'shop' && (
            <div className="settings-section-pane">
              <div className="premium-account-hero">
                <div className="account-avatar-circle">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" />
                  ) : (
                    <span>👑</span>
                  )}
                </div>
                <div className="account-details-box">
                  <div className="account-status-badge">
                    <Check className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                    <span>{user ? 'COMPTE CONNECTÉ ACTIF' : 'SESSION LOCALE ACTIVE'}</span>
                  </div>
                  <h3 className="account-email-text">{ownerDisplayName} ({ownerEmail})</h3>
                  <p className="account-sub-text">
                    Boutique : <strong>{shopDisplayName}</strong> · Vos collaborateurs et vos clients verront ce nom.
                  </p>
                </div>
              </div>

              {/* Edit Shop & Profile Form */}
              <form onSubmit={handleSaveShopProfile} className="premium-form-card mt-3">
                <div className="form-card-title">
                  <Building2 className="w-4 h-4 text-gold-deep" />
                  <span>Personnaliser l'Identité de votre Boutique & Propriétaire</span>
                </div>

                <div className="premium-input-grid">
                  <div className="form-field">
                    <label>Nom de votre Boutique en Ligne / Marque *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: NovaShop Express, Fenou Store"
                      className="premium-input font-bold"
                      value={editShopName}
                      onChange={(e) => setEditShopName(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Votre Nom & Prénom (Fondateur) *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Boris FENOU"
                      className="premium-input"
                      value={editOwnerName}
                      onChange={(e) => setEditOwnerName(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Numéro WhatsApp Business</label>
                    <input
                      type="tel"
                      placeholder="+229 97 00 00 00"
                      className="premium-input"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Pays & Zone d'Opération</label>
                    <input
                      type="text"
                      placeholder="Bénin, Côte d'Ivoire, Sénégal"
                      className="premium-input"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit-premium-gold">
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Informations de ma Boutique</span>
                </button>
              </form>

              {user && (
                <div className="account-actions-box mt-3">
                  <button
                    type="button"
                    className="btn-logout-premium"
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Se Déconnecter de la Session ({user.email})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEAM MEMBERS */}
          {activeTab === 'team' && (
            <div className="tab-pane-content">
              {/* Shop Code Header Banner */}
              <div className="p-4 mb-6 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Code Boutique Officiel (À transmettre à vos employés)</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed m-0">
                    Vos employés s'inscrivent sur la page d'accueil avec ce code. Vous n'avez aucun email à taper : leur demande apparaît ci-dessous pour validation immédiate.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-950/80 border border-amber-500/40 px-4 py-2.5 rounded-xl shrink-0 shadow-inner">
                  <span className="font-mono font-black text-xl text-amber-300 tracking-widest">{shopCode}</span>
                  <button
                    type="button"
                    className="text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 border border-amber-500/30 px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5"
                    onClick={() => {
                      navigator.clipboard.writeText(shopCode);
                      showToast(`📋 Code Boutique "${shopCode}" copié !`);
                    }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Copier</span>
                  </button>
                </div>
              </div>

              {/* Pending Employee Requests (NO TYPING NEEDED!) */}
              {pendingEmployees.length > 0 ? (
                <div className="p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                      <UserCheck className="w-4 h-4 text-amber-600 animate-bounce" />
                      <span>📥 Demandes d'Employés en Attente ({pendingEmployees.length})</span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium">Sélectionnez le rôle et validez</span>
                  </div>

                  <div className="space-y-2">
                    {pendingEmployees.map((emp) => (
                      <div key={emp.id || emp.email} className="p-3.5 rounded-xl bg-white border border-amber-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center border border-amber-300">
                            {getInitials(emp.name || emp.email)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{emp.name || 'Employé'}</div>
                            <div className="text-xs text-amber-800 font-mono font-medium">{emp.email}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <select
                            className="premium-select text-xs py-1.5"
                            defaultValue={emp.role || 'assistant'}
                            id={`role-select-${emp.email}`}
                          >
                            <option value="assistant">🤝 Assistant (Accès 100% Total)</option>
                            <option value="media_buyer">🎬 Média Buyer (Ads & Pages Vente)</option>
                            <option value="logistics">🚚 Responsable Logistique (Suivi COD)</option>
                            <option value="inventory">📦 Magasinier (Stocks & Arrivages)</option>
                          </select>

                          <button
                            type="button"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shrink-0 flex items-center gap-1 shadow-sm"
                            onClick={async () => {
                              const sel = document.getElementById(`role-select-${emp.email}`) as HTMLSelectElement;
                              const roleVal = sel?.value || 'assistant';

                              const res = await fetch('/api/employee/approve', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: emp.email, role: roleVal, action: 'approve' }),
                              });
                              const data = await res.json();
                              if (data.success) {
                                showToast(data.message);
                                addMember({ name: emp.name || emp.email, email: emp.email, phone: '', role: roleVal as UserRole });
                                setPendingEmployees((prev) => prev.filter((p) => p.email !== emp.email));
                              }
                            }}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Autoriser</span>
                          </button>

                          <button
                            type="button"
                            className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-lg transition shrink-0"
                            onClick={async () => {
                              await fetch('/api/employee/approve', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: emp.email, action: 'reject' }),
                              });
                              showToast(`Demande refusée pour ${emp.email}`);
                              setPendingEmployees((prev) => prev.filter((p) => p.email !== emp.email));
                            }}
                          >
                            Refuser
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 mb-6 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Aucune demande d'employé en attente. Lorsqu'un employé entre votre Code Boutique, son adresse email apparaîtra ici automatiquement.</span>
                </div>
              )}

              {/* Active Team Directory */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">
                    Membres & Employés de la Boutique ({members.length + 1})
                  </h4>
                </div>

                <div className="space-y-2">
                  {/* Owner Row */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 text-white flex items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center shadow">
                        👑
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-white">{ownerDisplayName}</strong>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Propriétaire
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{ownerEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Collaborators List */}
                  {members.map((member) => {
                    const perm = ROLE_PERMISSIONS[member.role];
                    return (
                      <div key={member.id} className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between gap-3 shadow-sm hover:border-slate-300 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-sm font-bold text-slate-900">{member.name}</strong>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                member.role === 'assistant' ? 'bg-emerald-100 text-emerald-800' :
                                member.role === 'media_buyer' ? 'bg-purple-100 text-purple-800' :
                                member.role === 'logistics' ? 'bg-blue-100 text-blue-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {perm?.label || member.role}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">{member.email}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          onClick={() => {
                            if (confirm(`Retirer l'accès à ${member.name} ?`)) {
                              removeMember(member.id);
                              showToast(`Accès retiré pour ${member.name}`);
                            }
                          }}
                          title="Retirer cet employé"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVREURS */}
          {activeTab === 'riders' && (
            <div className="settings-section-pane">
              <div className="settings-guide-card">
                <Truck className="w-4 h-4 text-gold flex-shrink-0" />
                <p>
                  <strong>Où retrouver vos livreurs ?</strong> Dès qu'un livreur est enregistré ici, il apparaît <strong>instantanément dans le menu déroulant de chaque commande dans l'onglet 🚚 Suivi COD</strong> pour lui assigner des livraisons, calculer ses commissions et générer son bordereau de tournée WhatsApp en 1 clic !
                </p>
              </div>

              {/* Form Add Livreur */}
              <form onSubmit={handleAddLivreurSubmit} className="premium-form-card">
                <div className="form-card-title">
                  <Truck className="w-4 h-4 text-gold-deep" />
                  <span>Enregistrer un Nouveau Livreur de Confiance</span>
                </div>

                <div className="premium-input-grid">
                  <div className="form-field">
                    <label>Nom du Livreur / Agence *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Boris Express"
                      className="premium-input"
                      value={newLivreurName}
                      onChange={(e) => setNewLivreurName(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Numéro WhatsApp (Pour dispatch) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+229 97 00 00 00"
                      className="premium-input"
                      value={newLivreurPhone}
                      onChange={(e) => setNewLivreurPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Zone(s) Couverte(s)</label>
                    <input
                      type="text"
                      placeholder="Cotonou, Akpakpa, Calavi"
                      className="premium-input"
                      value={newLivreurZone}
                      onChange={(e) => setNewLivreurZone(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Commission par Course (FCFA)</label>
                    <input
                      type="number"
                      placeholder="1500"
                      className="premium-input font-bold"
                      value={newLivreurFee}
                      onChange={(e) => setNewLivreurFee(Number(e.target.value) || 1500)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit-premium-gold">
                  <Truck className="w-4 h-4" />
                  <span>Enregistrer Livreur</span>
                </button>
              </form>

              {/* Livreurs Directory */}
              <div className="members-directory">
                <h4 className="directory-heading">Livreurs Disponibles ({livreurs.length})</h4>
                <div className="members-stack">
                  {livreurs.map((r) => (
                    <div key={r.id} className="premium-member-row">
                      <div className="member-avatar-badge rider">
                        🛵
                      </div>

                      <div className="member-details-col">
                        <div className="member-name-row">
                          <strong className="member-fullname">{r.name}</strong>
                          <span className="premium-fee-tag">
                            {formatFCFA(r.deliveryFee)} / course
                          </span>
                        </div>
                        <div className="member-contact-row">
                          <span><Phone className="w-3 h-3 inline mr-1 text-emerald-600" />{r.phone}</span>
                          <span>·</span>
                          <span><MapPin className="w-3 h-3 inline mr-1 text-sky-600" />{r.zone}</span>
                        </div>
                      </div>

                      <div className="member-actions-group">
                        <button
                          type="button"
                          className="btn-trash-member"
                          title="Supprimer ce livreur"
                          onClick={() => {
                            saveLivreurs(livreurs.filter((l) => l.id !== r.id));
                            showToast(`Livreur "${r.name}" supprimé.`);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
