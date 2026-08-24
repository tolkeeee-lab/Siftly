'use client';

import React from 'react';
import { AlertTriangle, HardDrive } from 'lucide-react';
import { StorageUsageInfo } from '../../utils/storageCheck';

interface StorageBannerProps {
  storageInfo: StorageUsageInfo;
}

export const StorageBanner: React.FC<StorageBannerProps> = ({ storageInfo }) => {
  if (!storageInfo.isNearFull) return null;

  return (
    <div
      style={{
        background: 'rgba(166, 67, 31, 0.25)',
        border: '1px solid #A6431F',
        borderRadius: '6px',
        padding: '12px 16px',
        marginBottom: '20px',
        color: '#F7F2E4',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '13px',
      }}
    >
      <AlertTriangle style={{ color: '#A6431F', flexShrink: 0 }} className="w-5 h-5" />
      <div>
        <strong>Attention : Espace de stockage navigateur presque plein ({storageInfo.percent}% utilisé).</strong>
        <br />
        <span style={{ fontSize: '12px', opacity: 0.85 }}>
          La compression automatique des images réduit la consommation. Pensez à télécharger une sauvegarde (.json) pour sécuriser vos fiches.
        </span>
      </div>
    </div>
  );
};
