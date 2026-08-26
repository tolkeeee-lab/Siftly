'use client';

import React, { useState } from 'react';
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
  Send,
  Loader2,
} from 'lucide-react';
import { UserRole, ROLE_PERMISSIONS } from '../../types/teamRoles';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useCODOrders } from '../../hooks/useCODOrders';
import { useAuth } from '../../hooks/useAuth';
import { getSupabaseClient } from '../../lib/supabaseClient';
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

  // Feedback toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sendingEmailTarget, setSendingEmailTarget] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const sendDirectEmailInvite = async (name: string, email: string, role: string) => {
    setSendingEmailTarget(email);
    try {
      const res = await fetch('/api/invite-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success) {
            showToast(`✉️ ${data.message || `Email d'invitation officiel envoyé à ${email} !`}`);
            return;
          }
        }
      }

      // Client-side Supabase magic link fallback if server route is unavailable
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
            data: { name, role },
          },
        });
        if (!error) {
          showToast(`✉️ Email d'invitation avec lien de connexion envoyé à ${email} !`);
          return;
        }
      }

      showToast(`🎉 Collaborateur "${name}" enregistré avec succès dans l'équipe !`);
    } catch (err: any) {
      showToast(`🎉 Collaborateur "${name}" enregistré avec succès !`);
    } finally {
      setSendingEmailTarget(null);
    }
  };

  if (!isOpen) return null;

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    const name = newMemberName.trim();
    const email = newMemberEmail.trim();
    const phone = newMemberPhone.trim() || '+229 00 00 00 00';
    const role = newMemberRole;

    addMember({
      name,
      email,
      phone,
      role,
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');

    // Trigger automated Supabase email send in background
    await sendDirectEmailInvite(name, email, role);
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
              <Users className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="settings-main-title">Paramètres & Gestion d'Équipe</h2>
              <span className="settings-sub-title">Contrôlez les accès de vos collaborateurs et de vos livreurs</span>
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
            className={`tab-capsule-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Collaborateurs</span>
            <span className="tab-count-pill">{members.length}</span>
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
          <button
            type="button"
            className={`tab-capsule-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Mon Compte</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="settings-modal-content">
          {/* TAB 1: TEAM MEMBERS */}
          {activeTab === 'team' && (
            <div className="settings-section-pane">
              <div className="settings-guide-card">
                <Shield className="w-4 h-4 text-gold flex-shrink-0" />
                <p>
                  <strong>Gestion d'Équipe :</strong> Vos collaborateurs enregistrés apparaissent dans votre annuaire d'équipe ci-dessous. Attribuez-leur des rôles ciblés (Média Buyer, Magasinier, Logistique, Assistant) pour déléguer sereinement votre activité.
                </p>
              </div>

              {/* Form Add */}
              <form onSubmit={handleAddMemberSubmit} className="premium-form-card">
                <div className="form-card-title">
                  <UserPlus className="w-4 h-4 text-gold-deep" />
                  <span>Inviter un Nouveau Collaborateur ou Assistant</span>
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
                    <label>Numéro WhatsApp</label>
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
                  disabled={!!sendingEmailTarget}
                  className="btn-submit-premium-gold"
                >
                  {sendingEmailTarget ? (
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
                <h4 className="directory-heading">Membres Actifs ({members.length})</h4>
                <div className="members-stack">
                  {members.map((member) => {
                    const perm = ROLE_PERMISSIONS[member.role];
                    const isOwner = member.role === 'admin';
                    const cleanPhone = (member.phone || '').replace(/[^0-9]/g, '');
                    const inviteMsg = `Bonjour ${member.name},\n\nVous avez été invité(e) sur notre espace de travail Siftly en tant que *${perm?.label || member.role}*.\n\n🔗 Accédez à l'application : https://siftly-iota.vercel.app\n📧 Connectez-vous avec votre email : ${member.email}\n\nBienvenue dans l'équipe !`;
                    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(inviteMsg)}` : null;
                    const mailSubject = encodeURIComponent(`Invitation à rejoindre l'équipe Siftly (${perm?.label || member.role})`);
                    const mailBody = encodeURIComponent(
                      `Bonjour ${member.name},\n\nVous avez été invité(e) à rejoindre notre espace de travail sur Siftly en tant que ${perm?.label || member.role}.\n\n🔗 Accédez à l'application ici : https://siftly-iota.vercel.app\n📧 Connectez-vous simplement avec votre adresse email : ${member.email}\n\nBienvenue dans l'équipe !`
                    );
                    const mailtoLink = `mailto:${member.email}?subject=${mailSubject}&body=${mailBody}`;

                    return (
                      <div key={member.id} className="premium-member-row">
                        <div className="member-avatar-badge">
                          {isOwner ? '👑' : getInitials(member.name)}
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
                            <span>·</span>
                            <span><Phone className="w-3 h-3 inline mr-1" />{member.phone}</span>
                          </div>
                        </div>

                        <div className="member-actions-group">
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
                            className="btn-action-copy-invite"
                            title="Copier le message d'invitation avec le lien d'accès"
                            onClick={() => {
                              navigator.clipboard.writeText(inviteMsg);
                              showToast(`📋 Message d'accès copié pour ${member.name} !`);
                            }}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {!isOwner && (
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
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Connection Instructions */}
              <div className="member-login-how-to">
                <div className="how-to-header">
                  <KeyRound className="w-4 h-4 text-gold-deep" />
                  <span className="how-to-title">🔑 Comment votre collaborateur se connecte-t-il ? (3 étapes simples)</span>
                </div>
                <div className="how-to-steps-grid">
                  <div className="how-to-step-card">
                    <span className="step-num">1</span>
                    <p className="step-txt">
                      <strong>Transmettez-lui l'accès</strong> en cliquant sur le bouton vert <em>« Inviter WhatsApp »</em> ou en lui envoyant le lien <code>https://siftly-iota.vercel.app</code>.
                    </p>
                  </div>
                  <div className="how-to-step-card">
                    <span className="step-num">2</span>
                    <p className="step-txt">
                      <strong>Il ouvre l'application</strong> sur son téléphone ou son ordinateur et clique sur le bouton <em>« Connexion »</em>.
                    </p>
                  </div>
                  <div className="how-to-step-card">
                    <span className="step-num">3</span>
                    <p className="step-txt">
                      <strong>Il s'authentifie</strong> avec son adresse email enregistrée. Le système le reconnaît automatiquement et lui ouvre l'espace de travail !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVREURS */}
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
                            href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${r.name}, voici votre contact pour les courses du jour sur Siftly.`)}`}
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

          {/* TAB 3: ACCOUNT */}
          {activeTab === 'account' && (
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
                    <span>SESSION PROPRIÉTAIRE ACTIVE</span>
                  </div>
                  <h3 className="account-email-text">{user?.email || 'admin@siftly.app'}</h3>
                  <p className="account-sub-text">
                    Connecté via Supabase Auth & Google Cloud · Base de données synchronisée en temps réel
                  </p>
                </div>
              </div>

              <div className="account-action-footer">
                <button
                  type="button"
                  className="btn-danger-logout"
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

        {/* Footer */}
        <div className="settings-modal-bottom">
          <button type="button" className="btn-close-modal-footer" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
