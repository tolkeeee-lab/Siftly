'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from './hooks/useProducts';
import { useProductRanking } from './hooks/useProductRanking';
import { useTableFeatures } from './hooks/useTableFeatures';
import { calculateAppStats } from './utils/calculations';
import { ProductData } from './types/product';
import { Masthead } from './components/header/Masthead';
import { Toolbar } from './components/header/Toolbar';
import { StatStrip } from './components/stats/StatStrip';
import { RankPanel } from './components/ranking/RankPanel';
import { TableControlsBar } from './components/table/TableControlsBar';
import { ProductTable } from './components/table/ProductTable';
import { ProductCardGrid } from './components/cards/ProductCardGrid';
import { StorageBanner } from './components/common/StorageBanner';
import { LightboxModal } from './components/modals/LightboxModal';
import { PasteModal } from './components/modals/PasteModal';
import { BreakEvenModal } from './components/modals/BreakEvenModal';
import { CurrencyConverterModal } from './components/modals/CurrencyConverterModal';
import { ProductOnePagerModal } from './components/modals/ProductOnePagerModal';

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
    loadFromSupabase,
  } = useProducts();

  const {
    isOpen: isRankOpen,
    togglePanel: toggleRankPanel,
    selectedCriteria,
    toggleCriterion,
    applyPreset,
    applyRanking,
    resetRanking,
    isRankingActive,
    displayProducts,
  } = useProductRanking(products);

  const {
    activeFilter,
    setActiveFilter,
    sortConfig,
    toggleSort,
    presetView,
    applyPresetView,
    visibleGroups,
    toggleGroup,
    filterCounts,
    processedProducts,
  } = useTableFeatures(displayProducts);

  const [layoutMode, setLayoutMode] = useState<'table' | 'grid'>('table');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [breakEvenProduct, setBreakEvenProduct] = useState<ProductData | null>(null);
  const [onePagerData, setOnePagerData] = useState<{ product: ProductData; rankIndex: number } | null>(null);
  const [currencyModalProductId, setCurrencyModalProductId] = useState<string | null>(null);
  const [isGlobalCurrencyModalOpen, setIsGlobalCurrencyModalOpen] = useState(false);

  const stats = useMemo(() => calculateAppStats(products), [products]);

  const handleApplyCurrencyToProduct = (fcfaAmount: number) => {
    if (currencyModalProductId) {
      updateProduct(currencyModalProductId, 'sourcing', fcfaAmount);
      setCurrencyModalProductId(null);
    }
  };

  return (
    <div className="sheet">
      <Masthead />

      <StorageBanner storageInfo={storageInfo} />

      <Toolbar
        products={processedProducts}
        onLoadProducts={replaceAllProducts}
        onImportTextRows={addMultipleProducts}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onOpenCurrencyModal={() => setIsGlobalCurrencyModalOpen(true)}
        onRefreshSupabase={loadFromSupabase}
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

      <TableControlsBar
        layoutMode={layoutMode}
        onSelectLayoutMode={setLayoutMode}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        filterCounts={filterCounts}
        presetView={presetView}
        onSelectPresetView={applyPresetView}
        visibleGroups={visibleGroups}
        onToggleGroup={toggleGroup}
      />

      {layoutMode === 'table' ? (
        <ProductTable
          products={processedProducts}
          isRankingActive={isRankingActive}
          visibleGroups={visibleGroups}
          sortConfig={sortConfig}
          onToggleSort={toggleSort}
          onUpdateProduct={updateProduct}
          onOpenBreakEven={(p) => setBreakEvenProduct(p)}
          onOpenOnePager={(p, rankIndex) => setOnePagerData({ product: p, rankIndex })}
          onOpenCurrencyConverter={(id) => setCurrencyModalProductId(id)}
          onDuplicateProduct={duplicateProduct}
          onDeleteProduct={deleteProduct}
          onAddProduct={() => addProduct()}
          onOpenLightbox={(src) => setLightboxSrc(src)}
        />
      ) : (
        <ProductCardGrid
          products={processedProducts}
          isRankingActive={isRankingActive}
          onUpdateProduct={updateProduct}
          onOpenBreakEven={(p) => setBreakEvenProduct(p)}
          onOpenOnePager={(p, rankIndex) => setOnePagerData({ product: p, rankIndex })}
          onOpenCurrencyConverter={(id) => setCurrencyModalProductId(id)}
          onDuplicateProduct={duplicateProduct}
          onDeleteProduct={deleteProduct}
          onAddProduct={() => addProduct()}
          onOpenLightbox={(src) => setLightboxSrc(src)}
        />
      )}

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

      <ProductOnePagerModal
        product={onePagerData?.product || null}
        rankIndex={onePagerData?.rankIndex || 0}
        isOpen={!!onePagerData}
        onClose={() => setOnePagerData(null)}
      />

      {/* Row-level sourcing currency converter */}
      <CurrencyConverterModal
        isOpen={!!currencyModalProductId}
        onClose={() => setCurrencyModalProductId(null)}
        onApplyConvertedPrice={handleApplyCurrencyToProduct}
      />

      {/* Global currency converter */}
      <CurrencyConverterModal
        isOpen={isGlobalCurrencyModalOpen}
        onClose={() => setIsGlobalCurrencyModalOpen(false)}
      />
    </div>
  );
}

export default App;
