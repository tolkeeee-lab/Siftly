'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../src/hooks/useProducts';
import { useLandingPageConfigs } from '../../src/hooks/useLandingPageConfigs';
import { calculateOfferStructures } from '../../src/utils/offerCalculations';
import { OfferStructure, OfferTier } from '../../src/types/offerTypes';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { OffersHeader } from '../../src/components/offers/OffersHeader';
import { OfferStructureCards } from '../../src/components/offers/OfferStructureCards';
import { OfferSimulatorBreakdown } from '../../src/components/offers/OfferSimulatorBreakdown';
import { ApplyOfferModal } from '../../src/components/offers/modals/ApplyOfferModal';
import { EditOfferModal } from '../../src/components/offers/modals/EditOfferModal';

export default function OffersPage() {
  const router = useRouter();
  const { products } = useProducts();
  const { getConfigForProduct, updateConfig, isLoaded } = useLandingPageConfigs();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedBundleProductId, setSelectedBundleProductId] = useState<string>('');
  const [testBudgetFCFA, setTestBudgetFCFA] = useState<number>(30000);
  const [estimatedCPAFCFA, setEstimatedCPAFCFA] = useState<number>(2500);
  const [initialStock, setInitialStock] = useState<number>(20);

  // Custom tiers edited by user for this product
  const [customTiersMap, setCustomTiersMap] = useState<Record<string, OfferTier[]>>({});

  // Modals
  const [modalOffer, setModalOffer] = useState<OfferStructure | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingOffer, setEditingOffer] = useState<OfferStructure | null>(null);

  // Select active product
  const activeProduct = useMemo(() => {
    if (!products.length) return null;
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Select bundle secondary product
  const bundleProduct = useMemo(() => {
    if (!products.length || !selectedBundleProductId) return null;
    return products.find((p) => p.id === selectedBundleProductId) || null;
  }, [products, selectedBundleProductId]);

  // Compute 4 offer structures
  const offers = useMemo(() => {
    if (!activeProduct) return [];
    return calculateOfferStructures(
      activeProduct,
      testBudgetFCFA,
      initialStock,
      estimatedCPAFCFA,
      bundleProduct,
      customTiersMap
    );
  }, [activeProduct, testBudgetFCFA, initialStock, estimatedCPAFCFA, bundleProduct, customTiersMap]);

  const handleOpenApplyModal = (offer: OfferStructure) => {
    setModalOffer(offer);
    setIsApplyModalOpen(true);
  };

  const handleOpenEditModal = (offer: OfferStructure) => {
    setEditingOffer(offer);
    setIsEditModalOpen(true);
  };

  const handleSaveCustomTiers = (offerId: string, tiers: OfferTier[]) => {
    setCustomTiersMap((prev) => ({
      ...prev,
      [offerId]: tiers,
    }));
  };

  const handleConfirmApply = () => {
    if (!activeProduct || !modalOffer) return;

    const currentConfig = getConfigForProduct(activeProduct);
    const updatedOffers = modalOffer.tiers.map((tier, idx) => ({
      id: `offer-${idx + 1}`,
      name: tier.title,
      quantity: tier.quantity,
      priceFCFA: tier.salePriceFCFA,
      originalPriceFCFA: tier.originalPriceFCFA,
      badge: tier.badge,
      isRecommended: tier.isFeatured || false,
    }));

    updateConfig(activeProduct.id, {
      ...currentConfig,
      offers: updatedOffers,
    });

    setIsApplyModalOpen(false);
    router.push(`/landing?product=${activeProduct.id}`);
  };

  const handleGoToAds = (offer: OfferStructure) => {
    if (!activeProduct) return;
    router.push(`/ads?product=${activeProduct.id}&offer=${offer.id}`);
  };

  if (!isLoaded || !activeProduct) {
    return (
      <div className="sheet">
        <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'IBM Plex Mono' }}>
          ⏳ Chargement du Laboratoire d'Offres...
        </div>
      </div>
    );
  }

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />
      <div className="offers-page-layout">
        {/* Header & Controls */}
        <OffersHeader
          products={products}
          selectedProduct={activeProduct}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCustomTiersMap({}); // reset custom edits when switching product
          }}
          testBudgetFCFA={testBudgetFCFA}
          onChangeTestBudget={setTestBudgetFCFA}
          estimatedCPAFCFA={estimatedCPAFCFA}
          onChangeCPA={setEstimatedCPAFCFA}
          initialStock={initialStock}
          onChangeStock={setInitialStock}
        />

        {/* 4 Offer Structures Cards */}
        <OfferStructureCards
          offers={offers}
          onApplyOffer={handleOpenApplyModal}
          onGoToAds={handleGoToAds}
          onEditOffer={handleOpenEditModal}
        />

        {/* Financial Breakdown Table */}
        <OfferSimulatorBreakdown
          offers={offers}
          testBudgetFCFA={testBudgetFCFA}
        />

        {/* Edit Offer Modal */}
        <EditOfferModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          offer={editingOffer}
          products={products.filter((p) => p.id !== activeProduct.id)}
          selectedBundleProductId={selectedBundleProductId}
          onSelectBundleProduct={setSelectedBundleProductId}
          onSaveCustomTiers={handleSaveCustomTiers}
        />

        {/* Apply Offer Modal */}
        <ApplyOfferModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          offer={modalOffer}
          product={activeProduct}
          onConfirmApply={handleConfirmApply}
        />
      </div>
    </div>
  );
}
