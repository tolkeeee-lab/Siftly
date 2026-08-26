import { PurchaseOrder, POSummaryStats, POStatus } from '../types/purchaseOrder';

export function calculatePOMerchandiseTotalOriginal(po: PurchaseOrder): number {
  if (po.variants && po.variants.length > 0) {
    return po.variants.reduce((acc, v) => acc + (v.quantity * v.unitPrice), 0);
  }
  return (po.quantity || 0) * (po.unitPriceOriginal || 0);
}

export function calculatePOMerchandiseTotalFCFA(po: PurchaseOrder): number {
  const totalOrig = calculatePOMerchandiseTotalOriginal(po);
  if (po.currency === 'FCFA') return totalOrig;
  return Math.round(totalOrig * (po.exchangeRateToFCFA || 1));
}

export function calculatePOFreightTotalFCFA(po: PurchaseOrder): number {
  const weight = po.estimatedWeightKg || 0;
  const rate = po.freightRatePerKgFCFA || (po.freightMode === 'avion' ? 9000 : 3500);
  return Math.round(weight * rate);
}

export function calculatePOLandedCostTotalFCFA(po: PurchaseOrder): number {
  const merchandise = calculatePOMerchandiseTotalFCFA(po);
  const freight = calculatePOFreightTotalFCFA(po);
  return merchandise + freight;
}

export function calculatePOLandedCostPerUnitFCFA(po: PurchaseOrder): number {
  const totalUnits = po.quantity || (po.variants?.reduce((a, b) => a + b.quantity, 0) || 1);
  if (totalUnits <= 0) return 0;
  return Math.round(calculatePOLandedCostTotalFCFA(po) / totalUnits);
}

export function getPOStatusMeta(status: POStatus): { label: string; bg: string; color: string; icon: string } {
  switch (status) {
    case 'negotiating':
      return { label: 'En négociation', bg: '#FFF8E0', color: '#7A6220', icon: '📝' };
    case 'paid':
      return { label: 'Payé au fournisseur', bg: '#DCF0DA', color: '#2D6B2A', icon: '💳' };
    case 'warehouse_china':
      return { label: 'Entrepôt Chine', bg: '#E3EDF6', color: '#1B4F72', icon: '🏢' };
    case 'in_transit':
      return { label: 'En transit (Mer / Vol)', bg: '#E8DAEF', color: '#5B2C6F', icon: '🚢' };
    case 'customs_cleared':
      return { label: 'Arrivé & Dédouané', bg: '#D4EFDF', color: '#196F3D', icon: '🛃' };
    case 'stocked':
      return { label: 'En stock magasin', bg: '#B8E6B5', color: '#1A5218', icon: '📦' };
    default:
      return { label: 'Inconnu', bg: '#EAEDED', color: '#2C3E50', icon: '⏳' };
  }
}

export function calculatePOSummaryStats(orders: PurchaseOrder[]): POSummaryStats {
  let totalUnits = 0;
  let totalMerchandiseFCFA = 0;
  let totalFreightFCFA = 0;
  let inTransitCount = 0;
  let negotiatingCount = 0;

  orders.forEach((po) => {
    totalUnits += po.quantity || (po.variants?.reduce((a, b) => a + b.quantity, 0) || 0);
    totalMerchandiseFCFA += calculatePOMerchandiseTotalFCFA(po);
    totalFreightFCFA += calculatePOFreightTotalFCFA(po);
    if (po.status === 'in_transit') inTransitCount++;
    if (po.status === 'negotiating') negotiatingCount++;
  });

  return {
    totalOrders: orders.length,
    totalUnits,
    totalMerchandiseFCFA,
    totalFreightFCFA,
    inTransitCount,
    negotiatingCount,
  };
}
