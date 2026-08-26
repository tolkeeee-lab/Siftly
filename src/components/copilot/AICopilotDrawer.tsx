'use client';

import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, Lightbulb, MessageSquare, Zap, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { formatFCFA } from '../../utils/formatters';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AICopilotDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { products } = useProducts();
  const [inputQuery, setInputQuery] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `👋 Bonjour ! Je suis votre **Copilote IA E-Commerce**. Je peux auditer vos produits Siftly, générer des messages de relance WhatsApp pour vos clients, ou vous aider à optimiser vos marges et votre logistique COD en Afrique de l'Ouest. Que souhaitez-vous faire ?`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const activeProduct = products[0] || null;

  const handleAuditCurrentProduct = () => {
    if (!activeProduct) return;
    const name = activeProduct.produit || 'ce produit';
    const price = Number(activeProduct.vente) || 15000;
    const weight = activeProduct.poids || 0.3;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: `🔎 Audite le produit « ${name} »`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    let aiResponseText = `📊 **AUDIT STRATÉGIQUE IA : ${name.toUpperCase()}**\n\n`;
    aiResponseText += `1. **Pricing & Marge :** Votre prix de vente est de **${formatFCFA(price)}**. Avec un poids de **${weight} kg**, ce produit est léger et idéal pour le fret maritime ou aérien express.\n`;
    aiResponseText += `2. **Angle d'Attaque Recommandé :** Mettez l'accent sur *l'effet soulagement immédiat* dès les 3 premières secondes de vos vidéos TikTok.\n`;
    aiResponseText += `3. **Recommandation COD :** Pour maximiser le taux de livraison à Cotonou/Abidjan, proposez un pack duo à **${formatFCFA(Math.round(price * 1.8))}** pour augmenter votre panier moyen !`;

    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const handleRelanceScripts = () => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: `💬 Donne-moi 2 scripts WhatsApp de relance pour les clients qui hésitent`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    let aiResponseText = `💬 **2 SCRIPTS WHATSAPP DE RELANCE HAUTE CONVERSION :**\n\n`;
    aiResponseText += `**Script 1 (Client absent / reporté) :**\n`;
    aiResponseText += `« Bonjour cher client, notre livreur est actuellement dans votre secteur à [Quartier]. Pour vous éviter de rater votre colis, seriez-vous disponible dans les 30 prochaines minutes ou préférez-vous qu'il passe à votre bureau ? »\n\n`;
    aiResponseText += `**Script 2 (Client hésitant sur le prix) :**\n`;
    aiResponseText += `« Bonjour ! Exceptionnellement pour aujourd'hui, si vous confirmez votre commande avant 16h, nous vous offrons les frais de livraison + une garantie échange 7 jours gratuite. Validez par OUI pour réserver votre colis ! »`;

    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    let reply = `💡 **Conseil Copilote :** Pour optimiser votre stratégie sur ce point, concentrez-vous sur un test publicitaire rapide (30 000 FCFA sur 3 jours). Surveillez un CPA inférieur à 4 000 FCFA et sécurisez vos livraisons avec des appels systématiques avant le départ des livreurs.`;

    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'ai',
      text: reply,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          type="button"
          className="copilot-floating-btn"
          onClick={() => setIsOpen(true)}
          title="Ouvrir le Copilote IA E-Commerce"
        >
          <Bot className="w-5 h-5 text-gold-deep" />
          <span className="copilot-btn-label">Copilote IA</span>
          <span className="copilot-pulse-dot" />
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="copilot-drawer open">
          <div className="copilot-header">
            <div className="copilot-title-wrap">
              <Bot className="w-5 h-5 text-gold-deep" />
              <div>
                <h3 className="copilot-title">Copilote IA E-Commerce</h3>
                <span className="copilot-status">● En ligne & Connecté à vos données</span>
              </div>
            </div>
            <button type="button" className="rowdel" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="copilot-quick-prompts">
            <button type="button" className="quick-prompt-btn" onClick={handleAuditCurrentProduct}>
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Auditer le produit #1</span>
            </button>
            <button type="button" className="quick-prompt-btn" onClick={handleRelanceScripts}>
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>Scripts Relance Client</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="copilot-messages-feed">
            {messages.map((m) => (
              <div key={m.id} className={`copilot-msg-bubble ${m.sender}`}>
                <div className="msg-text" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                <span className="msg-time">{m.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="copilot-input-form">
            <input
              type="text"
              className="copilot-input"
              placeholder="Posez une question sur vos produits ou vos ventes..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
            <button type="submit" className="btn-send-copilot">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
