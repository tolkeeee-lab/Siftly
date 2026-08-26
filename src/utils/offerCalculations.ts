import { ProductData } from '../types/product';
import { OfferStructure, OfferTier } from '../types/offerTypes';

export function calculateOfferStructures(
  product: ProductData,
  testBudgetFCFA: number = 30000,
  initialStock: number = 20,
  estimatedCPAFCFA: number = 2500
): OfferStructure[] {
  const p1Price = product.vente || 15000;
  const p1Cost = product.sourcing || 2500;
  const deliveryFee = product.livraison || 1500;

  // 1. VOLUME PACK (Duo -20%, Trio -30%)
  const p2Price = Math.round((p1Price * 2 * 0.8) / 100) * 100;
  const p3Price = Math.round((p1Price * 3 * 0.7) / 100) * 100;
  const volumeTiers: OfferTier[] = [
    { title: '1 Pièce Standard', quantity: 1, salePriceFCFA: p1Price, originalPriceFCFA: p1Price, discountPercent: 0 },
    { title: 'Pack Duo (Recommandé)', quantity: 2, salePriceFCFA: p2Price, originalPriceFCFA: p1Price * 2, discountPercent: 20, badge: '🔥 Plus Populaire', isFeatured: true },
    { title: 'Pack Famille Trio', quantity: 3, salePriceFCFA: p3Price, originalPriceFCFA: p1Price * 3, discountPercent: 30, badge: '💰 Max Économie' },
  ];
  // Weighting: 35% buy 1, 50% buy 2, 15% buy 3
  const volumeAOV = Math.round(p1Price * 0.35 + p2Price * 0.5 + p3Price * 0.15);
  const volumeCOGS = Math.round(p1Cost * (1 * 0.35 + 2 * 0.5 + 3 * 0.15));

  // 2. BUNDLE CROSS-SELL (Produit + Accessoire / Recharge)
  const accessoryCost = Math.round(p1Cost * 0.4);
  const bundleTiers: OfferTier[] = [
    { title: 'Produit Seul', quantity: 1, salePriceFCFA: p1Price, originalPriceFCFA: p1Price, discountPercent: 0 },
    { title: 'Kit Complet + Accessoire Offert', quantity: 1, salePriceFCFA: Math.round((p1Price * 1.35) / 100) * 100, originalPriceFCFA: p1Price + 8000, discountPercent: 25, badge: '⭐ Meilleur Rapport Q/P', isFeatured: true },
  ];
  const bundleAOV = Math.round(p1Price * 0.3 + (p1Price * 1.35) * 0.7);
  const bundleCOGS = Math.round(p1Cost + accessoryCost * 0.7);

  // 3. BOGO (Achetez 2 = 1 OFFERT)
  const bogoPrice = Math.round((p1Price * 2 * 0.95) / 100) * 100;
  const bogoTiers: OfferTier[] = [
    { title: '1 Pièce Découverte', quantity: 1, salePriceFCFA: p1Price, originalPriceFCFA: p1Price, discountPercent: 0 },
    { title: 'Offre 2 Achetés = 1 OFFERT (3 Pcs)', quantity: 3, salePriceFCFA: bogoPrice, originalPriceFCFA: p1Price * 3, discountPercent: 35, badge: '⚡ Flash Promo TikTok', isFeatured: true },
  ];
  const bogoAOV = Math.round(p1Price * 0.25 + bogoPrice * 0.75);
  const bogoCOGS = Math.round(p1Cost * 1 * 0.25 + p1Cost * 3 * 0.75);

  // 4. VIP GUARANTEE (Produit + Sérénité 30j + Priorité)
  const vipPrice = p1Price + 4000;
  const vipTiers: OfferTier[] = [
    { title: 'Formule Standard', quantity: 1, salePriceFCFA: p1Price, originalPriceFCFA: p1Price, discountPercent: 0 },
    { title: 'Pack Sérénité VIP (Garantie 30j & Échange)', quantity: 1, salePriceFCFA: vipPrice, originalPriceFCFA: p1Price + 6000, discountPercent: 20, badge: '🛡️ 100% Sérénité', isFeatured: true },
  ];
  const vipAOV = Math.round(p1Price * 0.4 + vipPrice * 0.6);
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
      title: '🎁 Bundle 2-en-1 (Avec Accessoire)',
      badge: '💎 Valeur Perçue Maximale',
      description: 'Associe le produit star à un accessoire ou une recharge utile pour doubler la valeur perçue.',
      strategicAdvantage: 'Écrase la concurrence des marchands qui vendent le produit tout nu.',
      tiers: bundleTiers,
      aov: bundleAOV,
      cogs: bundleCOGS,
      ease: 70,
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

  // Compute Financial Simulations for all 4 structures
  return rawOffers.map((raw) => {
    const netMarginPerOrder = raw.aov - raw.cogs - deliveryFee;
    const maxAllowableCAC = Math.max(0, netMarginPerOrder);
    
    // Test projections with micro budget
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
