'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../../src/hooks/useProducts';
import { calculateComparedMetrics, analyzeComparison } from '../../src/utils/compareCalculations';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { CompareHeader } from '../../src/components/compare/CompareHeader';
import { CompareProductPicker } from '../../src/components/compare/CompareProductPicker';
import { CompareWinnerCard } from '../../src/components/compare/CompareWinnerCard';
import { CompareTable } from '../../src/components/compare/CompareTable';

export default function ComparePage() {
  const { products } = useProducts();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Default to first 3 products once products are loaded
  useEffect(() => {
    if (products.length > 0 && selectedProductIds.length === 0) {
      setSelectedProductIds(products.slice(0, 3).map((p) => p.id));
    }
  }, [products, selectedProductIds.length]);

  // Selected product items
  const comparedProducts = useMemo(() => {
    return selectedProductIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is typeof products[0] => !!p);
  }, [products, selectedProductIds]);

  // Compared metrics and winner analysis
  const metrics = useMemo(() => {
    return calculateComparedMetrics(comparedProducts);
  }, [comparedProducts]);

  const analysis = useMemo(() => {
    return analyzeComparison(metrics);
  }, [metrics]);

  const handleResetToTop3 = () => {
    if (products.length > 0) {
      setSelectedProductIds(products.slice(0, 3).map((p) => p.id));
    }
  };

  const handleAddSlot = () => {
    if (selectedProductIds.length < 4) {
      const nextProduct = products.find((p) => !selectedProductIds.includes(p.id)) || products[0];
      if (nextProduct) {
        setSelectedProductIds([...selectedProductIds, nextProduct.id]);
      }
    }
  };

  const handleRemoveSlot = (index: number) => {
    if (selectedProductIds.length > 2) {
      setSelectedProductIds(selectedProductIds.filter((_, i) => i !== index));
    }
  };

  const handleChangeProduct = (index: number, newId: string) => {
    const updated = [...selectedProductIds];
    updated[index] = newId;
    setSelectedProductIds(updated);
  };

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

      <div style={{ marginTop: '16px' }}>
        <CompareHeader
          comparedCount={comparedProducts.length}
          onResetToTop3={handleResetToTop3}
        />

        {/* Winner Banner */}
        <CompareWinnerCard analysis={analysis} />

        {/* Slot Selectors */}
        <CompareProductPicker
          products={products}
          selectedProductIds={selectedProductIds}
          onAddSlot={handleAddSlot}
          onRemoveSlot={handleRemoveSlot}
          onChangeProduct={handleChangeProduct}
        />

        {/* Matrix Table */}
        <CompareTable metrics={metrics} />
      </div>
    </div>
  );
}
