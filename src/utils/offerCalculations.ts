import { ProductData } from '../types/product';
import { OfferStructure, OfferTier } from '../types/offerTypes';

export function calculateOfferStructures(
  product: ProductData,
  testBudgetFCFA: number = 30000,
  initialStock: number = 20,
  estimatedCPAFCFA: number = 2500,
  bundleProduct: ProductData | null = null,
  customTiersMap: Record<string, OfferTier[]> = {}
): OfferStructure[] {
  const p1Price = product.vente || 15000;
  const p1Cost = product.sourcing || 2500;
  const deliveryFee = product.livraison || 1500;

  // 1. VOLUME PACK (Duo -20%, Trio -30%)
  const p2Price = Math.round((p1Price * 2 * 0.8) / 100) * 100;
  const p3Price = Math.round((p1Price * 3 * 0.7) / 100) * 100;
  const defaultVolumeTiers: OfferTier[] = [
    { title: '1 Pièce Standard', quantity: 1, salePriceFCFA: p1Price, originalPriceFCFA: p1Price, discountPercent: 0 },
    { title: 'Pack Duo (Recommandé)', quantity: 2, salePriceFCFA: p2Price, originalPriceFCFA: p1Price * 2, discountPercent: 20, badge: '🔥 Plus Populaire', isFeatured: true },
    { title: 'Pack Famille Trio', quantity: 3, salePriceFCFA: p3Price, originalPriceFCFA: p1Price * 3, discountPercent: 30, badge: '💰 Max Économie' },
  ];
  const volumeTiers = customTiersMap['volume_pack'] || defaultVolumeTiers;
  const vTier1 = volumeTiers[0]?.salePriceFCFA || p1Price;
  const vTier2 = volumeTiers[1]?.salePriceFCFA || p2Price;
  const vTier3 = volumeTiers[2]?.salePriceFCFA || p3Price;
  const volumeAOV = Math.round(vTier1 * 0.35 + vTier2 * 0.5 + vTier3 * 0.15);
  const volumeCOGS = Math.round(p1Cost * (1 * 0.35 + 2 * 0.5 + 3 * 0.15));

  // 2. BUNDLE CROSS-SELL (Produit 1 + Produit 2 Choisi)
  const secondaryPrice = bundleProduct ? (bundleProduct.vente || 10000) : Math.round(p1Price * 0.6);
  const secondaryCost = bundleProduct ? (bundleProduct.sourcing || 2000) : Math.round(p1Cost * 0.4);
  const bundleCombinedOriginal = p1Price + secondaryPrice;
  const bundleCombinedSale = Math.round((bundleCombinedOriginal * 0.78) / 100) * 100; // ~22% bundle discount

  const defaultBundleTiers: OfferTier[] = [
    { title: `${product.produit || 'Produit Seul'} (1 Pc)`, quantity: 1, salePriceFCFA: p1Price, originalPriceFCFA: p1Price, discountPercent: 0 },
    { 
      title: bundleProduct 
        ? `Pack Duo Synergie : ${product.produit} + ${bundleProduct.produit}`
        : `Kit Complet + Accessoire Recharge Offert`,
      quantity: 2,
      salePriceFCFA: bundleCombinedSale,
      originalPriceFCFA: bundleCombinedOriginal,
      discountPercent: Math.round(((bundleCombinedOriginal - bundleCombinedSale) / bundleCombinedOriginal) * 100),
      badge: '⭐ Meilleur Rapport Q/P',
      isFeatured: true,
    },
  ];
  const bundleTiers = customTiersMap['bundle_cross_sell'] || defaultBundleTiers;
  const bTier1 = bundleTiers[0]?.salePriceFCFA || p1Price;
  const bTier2 = bundleTiers[1]?.salePriceFCFA || bundleCombinedSale;
  const bundleAOV = Math.round(bTier1 * 0.3 + bTier2 * 0.7);
  const bundleCOGS = Math.round(p1Cost * 0.3 + (p1Cost + secondaryCost) * 0.7);

  // 3. BOGO (Achetez 2 = 1 OFFERT)
  const bogoPrice = Math.round((p1Price * 2 * 0.95) / 100) * 100;
  const defaultBogoTiers: OfferTier[] = [
    { title: '1 Pièce Découverte', quantity: 1, salePriceFCFA: p1Price, originalPriceFCFA: p1Price, discountPercent: 0 },
    { title: 'Offre 2 Achetés = 1 OFFERT (3 Pcs)', quantity: 3, salePriceFCFA: bogoPrice, originalPriceFCFA: p1Price * 3, discountPercent: 35, badge: '⚡ Flash Promo TikTok', isFeatured: true },
  ];
  const bogoTiers = customTiersMap['bogo'] || defaultBogoTiers;
  const bgTier1 = bogoTiers[0]?.salePriceFCFA || p1Price;
  const bgTier2 = bogoTiers[1]?.salePriceFCFA || bogoPrice;
  const bogoAOV = Math.round(bgTier1 * 0.25 + bgTier2 * 0.75);
  const bogoCOGS = Math.round(p1Cost * 1 * 0.25 + p1Cost * 3 * 0.75);

  // 4. VIP GUARANTEE (Produit + Sérénité 30j + Priorité)
  const vipPrice = p1Price + 4000;
  const defaultVipTiers: OfferTier[] = [
    { title: 'Formule Standard', quantity: 1, salePriceFCFA: p1Price, originalPriceFCFA: p1Price, discountPercent: 0 },
    { title: 'Pack Sérénité VIP (Garantie 30j & Échange)', quantity: 1, salePriceFCFA: vipPrice, originalPriceFCFA: p1Price + 6000, discountPercent: 20, badge: '🛡️ 100% Sérénité', isFeatured: true },
  ];
  const vipTiers = customTiersMap['vip_guarantee'] || defaultVipTiers;
  const vpTier1 = vipTiers[0]?.salePriceFCFA || p1Price;
  const vpTier2 = vipTiers[1]?.salePriceFCFA || vipPrice;
  const vipAOV = Math.round(vpTier1 * 0.4 + vpTier2 * 0.6);
  const vipCOGS = p1Cost;

  const rawOffers = [
    {
      id: 'volume_pack',
      type: 'volume_pack' as const,
      title: '📦 Pack Volume (Duo / Trio Remisé)',
      badge: '🏆 Le Roi du Cashflow EAA',
      description: 'Encourage le client à prendre 2 ou 3 boîtes en lui offrant une réduction progressive.',
      strategicAdvantage: 'Augmente le panier moyen de +45% sans nécessiter d’accessoire externe.',
      tiers: volumeTiers,
      aov: volumeAOV,
      cogs: volumeCOGS,
      ease: 95,
    },
    {
      id: 'bundle_cross_sell',
      type: 'bundle_cross_sell' as const,
      title: bundleProduct ? `🎁 Bundle 2-en-1 (+ ${bundleProduct.produit})` : '🎁 Bundle 2-en-1 (Avec Produit Complémentaire)',
      badge: '💎 Valeur Perçue Maximale',
      description: bundleProduct 
        ? `Combine ${product.produit} avec ${bundleProduct.produit} pour un panier moyen record.`
        : 'Associe le produit star à un 2ème produit complémentaire choisi dans votre catalogue.',
      strategicAdvantage: 'Écrase la concurrence des marchands qui vendent le produit tout nu.',
      tiers: bundleTiers,
      aov: bundleAOV,
      cogs: bundleCOGS,
      ease: 75,
      bundleProductId: bundleProduct?.id,
      bundleProductName: bundleProduct?.produit,
      bundleProductCostFCFA: secondaryCost,
      bundleProductPriceFCFA: secondaryPrice,
    },
    {
      id: 'bogo',
      type: 'bogo' as const,
      title: '🔥 Achetez 2 = Le 3e OFFERT',
      badge: '⚡ Idéal TikTok Ads & Viral',
      description: 'L’offre virale par excellence pour capter l’attention en 3 secondes sur les réseaux.',
      strategicAdvantage: 'Liquidation de stock ultra rapide et conversion record sur mobile.',
      tiers: bogoTiers,
      aov: bogoAOV,
      cogs: bogoCOGS,
      ease: 90,
    },
    {
      id: 'vip_guarantee',
      type: 'vip_guarantee' as const,
      title: '💎 Pack VIP Sérénité',
      badge: '💰 Marge Pure sans Stock Extra',
      description: 'Ajoute une garantie échange à neuf 30 jours et une livraison express prioritaire.',
      strategicAdvantage: '0 franc de coût produit supplémentaire, 100% de marge nette additionnelle.',
      tiers: vipTiers,
      aov: vipAOV,
      cogs: vipCOGS,
      ease: 100,
    },
  ];

  return rawOffers.map((raw) => {
    const netMarginPerOrder = raw.aov - raw.cogs - deliveryFee;
    const maxAllowableCAC = Math.max(0, netMarginPerOrder);
    
    // Projections
    const estimatedOrders = Math.max(1, Math.floor(testBudgetFCFA / (estimatedCPAFCFA || 2500)));
    const totalRevenue = estimatedOrders * raw.aov;
    const totalCosts = (raw.cogs + deliveryFee) * estimatedOrders + testBudgetFCFA;
    const totalNetProfit = totalRevenue - totalCosts;
    const roasTarget = Number((raw.aov / (estimatedCPAFCFA || 2500)).toFixed(2));
    
    const profitScore = Math.min(100, Math.max(20, Math.round((netMarginPerOrder / raw.aov) * 140)));
    const overallRankScore = Math.round(profitScore * 0.6 + raw.ease * 0.4);

    return {
      id: raw.id,
      type: raw.type,
      title: raw.title,
      badge: raw.badge,
      description: raw.description,
      strategicAdvantage: raw.strategicAdvantage,
      tiers: raw.tiers,
      bundleProductId: raw.bundleProductId,
      bundleProductName: raw.bundleProductName,
      bundleProductCostFCFA: raw.bundleProductCostFCFA,
      bundleProductPriceFCFA: raw.bundleProductPriceFCFA,
      averageOrderValueFCFA: raw.aov,
      cogsPerOrderFCFA: raw.cogs,
      deliveryFeeFCFA: deliveryFee,
      netMarginPerOrderFCFA: netMarginPerOrder,
      maxAllowableCACFCFA: maxAllowableCAC,
      totalOrdersFromBudget: estimatedOrders,
      totalRevenueFCFA: totalRevenue,
      totalNetProfitFCFA: totalNetProfit,
      roasTarget: roasTarget,
      easeScore: raw.ease,
      profitScore: profitScore,
      overallRankScore: overallRankScore,
      isRecommendedWinner: false,
    };
  }).sort((a, b) => b.overallRankScore - a.overallRankScore).map((item, idx) => ({
    ...item,
    isRecommendedWinner: idx === 0,
  }));
}
