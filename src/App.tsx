'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from './hooks/useProducts';
import { useProductRanking } from './hooks/useProductRanking';
import { calculateAppStats } from './utils/calculations';
import { ProductData } from './types/product';
import { Masthead } from './components/header/Masthead';
import { Toolbar } from './components/header/Toolbar';
import { StatStrip } from './components/stats/StatStrip';
import { RankPanel } from './components/ranking/RankPanel';
import { ProductTable } from './components/table/ProductTable';
import { StorageBanner } from './components/common/StorageBanner';
import { LightboxModal } from './components/modals/LightboxModal';
import { PasteModal } from './components/modals/PasteModal';
import { BreakEvenModal } from './components/modals/BreakEvenModal';

export function App() {
  const {
    products,
    updateProduct,
    addProduct,
    duplicateProduct,
    addMultipleProducts,
    deleteProduct,
    replaceAllProducts,
    showAutoSaveToast,
    storageInfo,
    isSyncing,
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
  const [breakEvenProduct, setBreakEvenProduct] = useState<ProductData | null>(null);

  const stats = useMemo(() => calculateAppStats(products), [products]);

  return (
    <div className="sheet">
      <Masthead />

      <StorageBanner storageInfo={storageInfo} />

      <Toolbar
        products={products}
        onLoadProducts={replaceAllProducts}
        onImportTextRows={addMultipleProducts}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        showAutoSaveToast={showAutoSaveToast}
        isSyncing={isSyncing}
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
        onOpenBreakEven={(p) => setBreakEvenProduct(p)}
        onDuplicateProduct={duplicateProduct}
        onDeleteProduct={deleteProduct}
        onAddProduct={() => addProduct()}
        onOpenLightbox={(src) => setLightboxSrc(src)}
      />

      <LightboxModal imageSrc={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImportRows={addMultipleProducts}
      />

      <BreakEvenModal
        product={breakEvenProduct}
        isOpen={!!breakEvenProduct}
        onClose={() => setBreakEvenProduct(null)}
      />
    </div>
  );
}

export default App;
