'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from '../../src/hooks/useProducts';
import { useCODOrders } from '../../src/hooks/useCODOrders';
import { generateLandingConfig } from '../../src/utils/landingTemplates';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { LandingHeader } from '../../src/components/landing/LandingHeader';
import { LandingPagePreview } from '../../src/components/landing/LandingPagePreview';
import { ShareLinkModal } from '../../src/components/landing/modals/ShareLinkModal';
import { CODStatus } from '../../src/types/codLogistics';

export default function LandingPageBuilder() {
  const { products } = useProducts();
  const { addOrder } = useCODOrders();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'full'>('mobile');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Active product
  const activeProduct = useMemo(() => {
    if (selectedProductId) {
      const found = products.find((p) => p.id === selectedProductId);
      if (found) return found;
    }
    return products[0] || null;
  }, [products, selectedProductId]);

  // Landing config
  const config = useMemo(() => {
    return generateLandingConfig(activeProduct);
  }, [activeProduct]);

  const handleOrderSuccess = (orderData: {
    customerName: string;
    customerPhone: string;
    customerCity: string;
    customerAddress: string;
    quantity: number;
    totalPriceFCFA: number;
    productName: string;
    productId?: string;
  }) => {
    // Automatically register order into COD Logistics!
    addOrder({
      productId: orderData.productId,
      productName: orderData.productName,
      quantity: orderData.quantity,
      totalPriceFCFA: orderData.totalPriceFCFA,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerCity: orderData.customerCity,
      customerAddress: orderData.customerAddress,
      deliveryFeeFCFA: 1500,
      status: 'to_confirm' as CODStatus,
      notes: 'Commande passée depuis la Landing Page Web',
    });
  };

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

      <div style={{ marginTop: '16px' }}>
        <LandingHeader
          products={products}
          selectedProductId={activeProduct?.id || ''}
          onSelectProduct={setSelectedProductId}
          previewMode={previewMode}
          onTogglePreviewMode={setPreviewMode}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        {/* Preview Container */}
        <div className={`landing-preview-wrapper ${previewMode === 'mobile' ? 'mobile-frame' : ''}`}>
          <LandingPagePreview
            config={config}
            onOrderSuccess={handleOrderSuccess}
          />
        </div>
      </div>

      <ShareLinkModal
        product={activeProduct}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
