'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from './hooks/useProducts';
import { useProductRanking } from './hooks/useProductRanking';
import { useTableFeatures } from './hooks/useTableFeatures';
import { calculateAppStats } from './utils/calculations';
import { ProductData, MarketAnalysisData } from './types/product';
import { Masthead } from './components/header/Masthead';
import { NavigationTabs } from './components/navigation/NavigationTabs';
import { Toolbar } from './components/header/Toolbar';
import { CategoryFilterBar } from './components/toolbar/CategoryFilterBar';
import { StatStrip } from './components/stats/StatStrip';
import { RankPanel } from './components/ranking/RankPanel';
import { ProductTable } from './components/table/ProductTable';
import { ProductCardGrid } from './components/cards/ProductCardGrid';
import { LightboxModal } from './components/modals/LightboxModal';
import { PasteModal } from './components/modals/PasteModal';
import { BreakEvenModal } from './components/modals/BreakEvenModal';
import { CurrencyConverterModal } from './components/modals/CurrencyConverterModal';
import { ProductOnePagerModal } from './components/modals/ProductOnePagerModal';
import { MarketAnalysisModal } from './components/modals/MarketAnalysisModal';

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

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [marketAnalysisProduct, setMarketAnalysisProduct] = useState<ProductData | null>(null);

  const [layoutMode, setLayoutMode] = useState<'table' | 'grid'>('table');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [breakEvenProduct, setBreakEvenProduct] = useState<ProductData | null>(null);
  const [onePagerData, setOnePagerData] = useState<{ product: ProductData; rankIndex: number } | null>(null);
  const [currencyModalProductId, setCurrencyModalProductId] = useState<string | null>(null);
  const [isGlobalCurrencyModalOpen, setIsGlobalCurrencyModalOpen] = useState(false);

  const stats = useMemo(() => calculateAppStats(products), [products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || 'Maison & Confort';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return processedProducts;
    return processedProducts.filter((p) => (p.category || 'Maison & Confort') === selectedCategory);
  }, [processedProducts, selectedCategory]);

  const handleApplyCurrencyToProduct = (fcfaAmount: number) => {
    if (currencyModalProductId) {
      updateProduct(currencyModalProductId, 'sourcing', fcfaAmount);
      setCurrencyModalProductId(null);
    }
  };

  const handleSaveMarketAnalysis = (productId: string, data: MarketAnalysisData) => {
    updateProduct(productId, 'marketAnalysis' as any, data);
  };

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

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

      {/* Category & Niche Selector */}
      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
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
          products={filteredProducts}
          isRankingActive={isRankingActive}
          visibleGroups={visibleGroups}
          sortConfig={sortConfig}
          onToggleSort={toggleSort}
          onUpdateProduct={updateProduct}
          onOpenBreakEven={(p) => setBreakEvenProduct(p)}
          onOpenOnePager={(p, rankIndex) => setOnePagerData({ product: p, rankIndex })}
          onOpenMarketAnalysis={(p) => setMarketAnalysisProduct(p)}
          onOpenCurrencyConverter={(id) => setCurrencyModalProductId(id)}
          onDuplicateProduct={duplicateProduct}
          onDeleteProduct={deleteProduct}
          onAddProduct={() => addProduct()}
          onOpenLightbox={(src) => setLightboxSrc(src)}
        />
      ) : (
        <ProductCardGrid
          products={filteredProducts}
          isRankingActive={isRankingActive}
          onUpdateProduct={updateProduct}
          onOpenBreakEven={(p) => setBreakEvenProduct(p)}
          onOpenOnePager={(p, rankIndex) => setOnePagerData({ product: p, rankIndex })}
          onOpenMarketAnalysis={(p) => setMarketAnalysisProduct(p)}
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

      {/* Cutting-Edge Market Analysis Modal */}
      <MarketAnalysisModal
        product={marketAnalysisProduct}
        isOpen={!!marketAnalysisProduct}
        onClose={() => setMarketAnalysisProduct(null)}
        onSaveAnalysis={handleSaveMarketAnalysis}
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
