'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from './hooks/useProducts';
import { useProductRanking } from './hooks/useProductRanking';
import { calculateAppStats } from './utils/calculations';
import { Masthead } from './components/header/Masthead';
import { Toolbar } from './components/header/Toolbar';
import { StatStrip } from './components/stats/StatStrip';
import { RankPanel } from './components/ranking/RankPanel';
import { ProductTable } from './components/table/ProductTable';
import { HelpNotes } from './components/common/HelpNotes';
import { LightboxModal } from './components/modals/LightboxModal';
import { PasteModal } from './components/modals/PasteModal';

export function App() {
  const {
    products,
    updateProduct,
    addProduct,
    addMultipleProducts,
    deleteProduct,
    replaceAllProducts,
    showAutoSaveToast,
  } = useProducts();

  const {
    isOpen: isRankOpen,
    togglePanel: toggleRankPanel,
    selectedCriteria,
    toggleCriterion,
    applyPreset,
    applyRanking,
    resetRanking,
    displayProducts,
  } = useProductRanking(products);

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const stats = useMemo(() => calculateAppStats(products), [products]);

  return (
    <div className="sheet">
      <Masthead />

      <Toolbar
        products={products}
        onLoadProducts={replaceAllProducts}
        onImportTextRows={addMultipleProducts}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        showAutoSaveToast={showAutoSaveToast}
      />

      <StatStrip stats={stats} />

      <RankPanel
        isOpen={isRankOpen}
        onToggleOpen={toggleRankPanel}
        selectedCriteria={selectedCriteria}
        onToggleCriterion={toggleCriterion}
        onApplyPreset={applyPreset}
        onApplyRanking={applyRanking}
        onResetRanking={resetRanking}
      />

      <ProductTable
        products={displayProducts}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onAddProduct={() => addProduct()}
        onOpenLightbox={(src) => setLightboxSrc(src)}
      />

      <HelpNotes />

      <LightboxModal imageSrc={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImportRows={addMultipleProducts}
      />
    </div>
  );
}

export default App;
