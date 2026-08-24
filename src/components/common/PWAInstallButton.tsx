'use client';

import React from 'react';
import { Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  if (isInstalled) {
    return (
      <div
        className="tbtn load"
        style={{
          borderColor: 'var(--sage)',
          color: 'var(--sage)',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        <Check className="w-3.5 h-3.5" />
        <span>App Installée</span>
      </div>
    );
  }

  if (!isInstallable) return null;

  return (
    <button
      type="button"
      className="tbtn save"
      onClick={promptInstall}
      style={{
        background: 'var(--gold)',
        color: '#ffffff',
        borderColor: 'var(--gold-deep)',
        fontWeight: 600,
      }}
      title="Installer l'application Siftly sur votre écran d'accueil"
    >
      <Smartphone className="w-3.5 h-3.5" />
      <span>Installer l'App</span>
    </button>
  );
};
