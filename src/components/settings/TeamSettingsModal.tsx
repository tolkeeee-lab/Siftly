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
  DollarSign,
  Sparkles,
  UserCheck,
  MessageCircle,
  Copy,
  ExternalLink,
  KeyRound,
  Link,
  CheckCircle2,
  Loader2,
  Send,
  Store,
  Save,
  Building2,
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

  useEffect(() => {
    setEditOwnerName(profile.ownerName || '');
    setEditShopName(profile.shopName || '');
    setEditPhone(profile.phone || '');
    setEditCountry(profile.country || 'Bénin / Côte d\'Ivoire / Sénégal');
  }, [profile]);

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

  // Feedback toast & Last Created Member Link Modal
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [lastCreatedInvite, setLastCreatedInvite] = useState<{
    name: string;
    role: string;
    link: string;
    phone: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4500);
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
    showToast(`🏪 Identité de la boutique "${editShopName.trim() || 'Ma Boutique'}" mise à jour avec succès !`);
  };

  const generateInviteLink = (name: string, role: string, email: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://siftly-iota.vercel.app';
    return `${origin}/?join=team&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`;
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const name = newMemberName.trim();
    const email = newMemberEmail.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@siftly.app`;
    const phone = newMemberPhone.trim() || '';
    const role = newMemberRole;

    setIsSendingEmail(true);

    addMember({
      name,
      email,
      phone,
      role,
    });

    const magicLink = generateInviteLink(name, role, email);
    setLastCreatedInvite({
      name,
      role: ROLE_PERMISSIONS[role]?.label || role,
      link: magicLink,
      phone,
    });

    try {
      const res = await fetch('/api/invite-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✉️ ${data.message || `Email d'invitation officiel envoyé à ${email} !`}`);
      } else {
        showToast(`⚠️ ${data.message || "Erreur lors de l'envoi de l'invitation"}`);
      }
    } catch (err: any) {
      showToast(`🎉 Collaborateur "${name}" ajouté ! Lien d'accès généré.`);
    } finally {
      setIsSendingEmail(false);
    }

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
                    Boutique : <strong>{shopDisplayName}</strong> · Vos collaborateurs et vos bons de commande afficheront ce nom.
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
            <div className="settings-section-pane">
              <div className="settings-guide-card">
                <Shield className="w-4 h-4 text-gold flex-shrink-0" />
                <p>
                  <strong>Gestion d'Équipe :</strong> Ajoutez vos collaborateurs pour leur donner accès à <strong>{shopDisplayName}</strong> par email officiel Supabase ou via leur lien direct !
                </p>
              </div>

              {/* Just Created Member Success Card with Direct Link */}
              {lastCreatedInvite && (
                <div className="last-created-invite-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <strong className="text-sm text-ink font-bold">
                        Lien d'accès généré pour : {lastCreatedInvite.name} ({lastCreatedInvite.role})
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-ink-soft hover:text-ink"
                      onClick={() => setLastCreatedInvite(null)}
                    >
                      Fermer ✕
                    </button>
                  </div>
                  <p className="text-xs text-ink-muted my-1">
                    L'email d'invitation a été envoyé. Vous pouvez aussi lui transmettre ce lien direct WhatsApp / SMS :
                  </p>
                  <div className="invite-link-row">
                    <input
                      type="text"
                      readOnly
                      value={lastCreatedInvite.link}
                      className="invite-link-input"
                    />
                    <button
                      type="button"
                      className="btn-copy-magic-link"
                      onClick={() => {
                        navigator.clipboard.writeText(lastCreatedInvite.link);
                        showToast(`📋 Lien d'accès copié pour ${lastCreatedInvite.name} !`);
                      }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le Lien</span>
                    </button>
                    {lastCreatedInvite.phone && (
                      <a
                        href={`https://wa.me/${lastCreatedInvite.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${lastCreatedInvite.name},\n\nVoici votre lien d'accès direct à l'espace de travail ${shopDisplayName} (${lastCreatedInvite.role}) :\n👉 ${lastCreatedInvite.link}\n\nCliquez dessus pour commencer à travailler !`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-action-invite-wa"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Envoyer WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Form Add */}
              <form onSubmit={handleAddMemberSubmit} className="premium-form-card">
                <div className="form-card-title">
                  <UserPlus className="w-4 h-4 text-gold-deep" />
                  <span>Ajouter un Nouveau Collaborateur ou Assistant</span>
                </div>

                <div className="premium-input-grid">
                  <div className="form-field">
                    <label>Nom & Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Marc KOFFI"
                      className="premium-input"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Email Collaborateur *</label>
                    <input
                      type="email"
                      required
                      placeholder="marc@entreprise.com"
                      className="premium-input"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Numéro WhatsApp (Pour dispatch)</label>
                    <input
                      type="tel"
                      placeholder="+229 97 00 00 00"
                      className="premium-input"
                      value={newMemberPhone}
                      onChange={(e) => setNewMemberPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Rôle & Niveau d'Accès *</label>
                    <select
                      className="premium-select"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                    >
                      <option value="assistant">🤝 Assistant (Accès 100% Total)</option>
                      <option value="media_buyer">🎬 Média Buyer (Ads & Pages Vente)</option>
                      <option value="logistics">🚚 Responsable Logistique (Suivi COD)</option>
                      <option value="inventory">📦 Magasinier (Stocks & Arrivages)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="btn-submit-premium-gold"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi de l'invitation par email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enregistrer & Envoyer l'Invitation par Email</span>
                    </>
                  )}
                </button>
              </form>

              {/* Members List */}
              <div className="members-directory">
                <h4 className="directory-heading">Membres Actifs ({members.length + 1})</h4>
                <div className="members-stack">
                  {/* Real Dynamic Owner Row */}
                  <div className="premium-member-row owner-pinned">
                    <div className="member-avatar-badge">
                      👑
                    </div>

                    <div className="member-details-col">
                      <div className="member-name-row">
                        <strong className="member-fullname">{ownerDisplayName}</strong>
                        <span className="premium-role-tag admin">
                          👑 Propriétaire ({shopDisplayName})
                        </span>
                      </div>
                      <div className="member-contact-row">
                        <span><Mail className="w-3 h-3 inline mr-1" />{ownerEmail}</span>
                        {profile.phone && (
                          <>
                            <span>·</span>
                            <span><Phone className="w-3 h-3 inline mr-1" />{profile.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real Collaborators */}
                  {members.map((member) => {
                    const perm = ROLE_PERMISSIONS[member.role];
                    const cleanPhone = (member.phone || '').replace(/[^0-9]/g, '');
                    const magicLink = generateInviteLink(member.name, member.role, member.email);
                    const inviteMsg = `Bonjour ${member.name},\n\nVoici votre lien d'accès direct à notre boutique ${shopDisplayName} (${perm?.label || member.role}) :\n👉 ${magicLink}\n\nCliquez sur ce lien pour vous connecter immédiatement !`;
                    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(inviteMsg)}` : null;

                    return (
                      <div key={member.id} className="premium-member-row">
                        <div className="member-avatar-badge">
                          {getInitials(member.name)}
                        </div>

                        <div className="member-details-col">
                          <div className="member-name-row">
                            <strong className="member-fullname">{member.name}</strong>
                            <span className={`premium-role-tag ${member.role}`}>
                              {perm?.label || member.role}
                            </span>
                          </div>
                          <div className="member-contact-row">
                            <span><Mail className="w-3 h-3 inline mr-1" />{member.email}</span>
                            {member.phone && (
                              <>
                                <span>·</span>
                                <span><Phone className="w-3 h-3 inline mr-1" />{member.phone}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="member-actions-group">
                          <button
                            type="button"
                            className="btn-action-copy-magic"
                            title="Copier le lien d'accès magique"
                            onClick={() => {
                              navigator.clipboard.writeText(magicLink);
                              showToast(`📋 Lien d'accès magique copié pour ${member.name} !`);
                            }}
                          >
                            <Link className="w-3.5 h-3.5" />
                            <span>Copier Lien</span>
                          </button>

                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-action-invite-wa"
                              title="Envoyer l'accès et les instructions sur WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <button
                            type="button"
                            className="btn-trash-member"
                            title="Retirer ce membre"
                            onClick={() => {
                              removeMember(member.id);
                              showToast(`Membre "${member.name}" retiré de l'équipe.`);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                        {r.phone && (
                          <a
                            href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${r.name}, voici votre contact pour les courses du jour sur ${shopDisplayName}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-action-invite-wa"
                            title="Contacter le livreur sur WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}

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
