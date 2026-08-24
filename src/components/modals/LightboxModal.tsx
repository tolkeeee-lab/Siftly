import React from 'react';

interface LightboxModalProps {
  imageSrc: string | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ imageSrc, onClose }) => {
  if (!imageSrc) return null;

  return (
    <div className="lightbox open" onClick={onClose}>
      <img src={imageSrc} alt="Zoom produit" onClick={(e) => e.stopPropagation()} />
    </div>
  );
};
