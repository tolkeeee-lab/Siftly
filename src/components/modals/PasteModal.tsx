import React, { useState, useEffect } from 'react';
import { ProductData } from '../../types/product';
import { parsePastedRows } from '../../utils/parsers';

interface PasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportRows: (rows: Partial<ProductData>[]) => void;
}

export const PasteModal: React.FC<PasteModalProps> = ({ isOpen, onClose, onImportRows }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) setText('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!text.trim()) {
      alert("Collez du texte avant d'importer.");
      return;
    }
    const rows = parsePastedRows(text);
    if (rows.length === 0) {
      alert(
        'Aucune fiche reconnue. Collez soit un JSON (tableau ou objet), soit un texte au format "Clé: valeur" — plusieurs fiches séparées par une ligne "---".'
      );
      return;
    }
    onImportRows(rows);
    onClose();
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box" onClick={(e) => e.stopPropagation()}>
        <h2>Coller une fiche produit</h2>
        <p>
          Collez soit un <strong>JSON</strong> (tableau ou objet), soit un texte au format{' '}
          <strong>« Clé: valeur »</strong> (ex : Produit: ..., Prix sourcing brut: 1800, Douleur: 5).
          Plusieurs fiches « Clé: valeur » peuvent être séparées par une ligne « --- ».
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`[{"produit":"Chasse-moustique à photocatalyseur","marche":"Chine","sourcing":1800,...}]\n\n— ou —\n\nProduit: Chasse-moustique à photocatalyseur\nMarché d'origine: Chine\nPrix sourcing brut: 1800\n...`}
        />
        <div className="paste-actions">
          <button type="button" className="paste-cancel" onClick={onClose}>
            Annuler
          </button>
          <button type="button" className="paste-confirm" onClick={handleConfirm}>
            Importer
          </button>
        </div>
      </div>
    </div>
  );
};
