'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from '../../src/hooks/useProducts';
import { generateProductVideoScripts, generateMarketingAngles } from '../../src/utils/scriptTemplates';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { AdsHeader } from '../../src/components/ads/AdsHeader';
import { VideoScriptCard } from '../../src/components/ads/VideoScriptCard';
import { MediaBuyingCalculator } from '../../src/components/ads/MediaBuyingCalculator';
import { MarketingAnglesGrid } from '../../src/components/ads/MarketingAnglesGrid';
import { ExportBriefModal } from '../../src/components/ads/modals/ExportBriefModal';

export default function AdsStudioPage() {
  const { products } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isExportBriefOpen, setIsExportBriefOpen] = useState(false);

  // Active product
  const activeProduct = useMemo(() => {
    if (selectedProductId) {
      const found = products.find((p) => p.id === selectedProductId);
      if (found) return found;
    }
    return products[0] || null;
  }, [products, selectedProductId]);

  // Generated scripts and angles
  const scripts = useMemo(() => generateProductVideoScripts(activeProduct), [activeProduct]);
  const angles = useMemo(() => generateMarketingAngles(activeProduct), [activeProduct]);

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

      <div style={{ marginTop: '16px' }}>
        <AdsHeader
          products={products}
          selectedProductId={activeProduct?.id || ''}
          onSelectProduct={setSelectedProductId}
          onOpenExportBrief={() => setIsExportBriefOpen(true)}
        />

        {/* Media Buying Target CPA & ROAS Calculator */}
        <MediaBuyingCalculator product={activeProduct} />

        {/* 4 Marketing Angles */}
        <MarketingAnglesGrid angles={angles} />

        {/* 3 Video Scripts */}
        <div className="scripts-section-header" style={{ marginBottom: '14px' }}>
          <h3 style={{ fontFamily: 'Georgia', fontSize: '20px', color: 'var(--panel)', margin: 0 }}>
            🎬 3 Scripts Vidéos Viraux pour TikTok & Reels Ads
          </h3>
          <span style={{ fontSize: '12px', color: 'rgba(247, 242, 228, 0.7)', fontFamily: 'IBM Plex Mono' }}>
            Scripts complets avec découpage chronologique des scènes et instructions de tournage
          </span>
        </div>

        <div className="scripts-list-wrap">
          {scripts.map((script) => (
            <VideoScriptCard key={script.id} script={script} />
          ))}
        </div>
      </div>

      <ExportBriefModal
        product={activeProduct}
        scripts={scripts}
        angles={angles}
        isOpen={isExportBriefOpen}
        onClose={() => setIsExportBriefOpen(false)}
      />
    </div>
  );
}
