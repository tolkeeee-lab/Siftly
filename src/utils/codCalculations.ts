import { CODOrder, CODStatus, CODSummaryStats } from '../types/codLogistics';

export function getCODStatusMeta(status: CODStatus): { label: string; bg: string; color: string; icon: string } {
  switch (status) {
    case 'to_confirm':
      return { label: 'À Confirmer', bg: '#FFF8E0', color: '#7A6220', icon: '📞' };
    case 'ready_to_ship':
      return { label: 'Prêt à Expédier', bg: '#E3EDF6', color: '#1B4F72', icon: '📦' };
    case 'out_for_delivery':
      return { label: 'En Livraison', bg: '#E8DAEF', color: '#5B2C6F', icon: '🛵' };
    case 'delivered':
      return { label: 'Livré & Encaissé', bg: '#D4EFDF', color: '#196F3D', icon: '💵' };
    case 'postponed':
      return { label: 'Reporté', bg: '#FCF3CF', color: '#9A7D0A', icon: '🔄' };
    case 'cancelled':
      return { label: 'Annulé / Refusé', bg: '#FADBD8', color: '#922B21', icon: '❌' };
    default:
      return { label: 'Inconnu', bg: '#EAEDED', color: '#2C3E50', icon: '⏳' };
  }
}

export function calculateCODSummaryStats(orders: CODOrder[]): CODSummaryStats {
  let deliveredCount = 0;
  let outForDeliveryCount = 0;
  let toConfirmCount = 0;
  let cancelledCount = 0;
  let totalGrossCashFCFA = 0;
  let totalDeliveryFeesFCFA = 0;

  orders.forEach((o) => {
    if (o.status === 'delivered') {
      deliveredCount++;
      totalGrossCashFCFA += o.totalPriceFCFA || 0;
      totalDeliveryFeesFCFA += o.deliveryFeeFCFA || 0;
    } else if (o.status === 'out_for_delivery') {
      outForDeliveryCount++;
    } else if (o.status === 'to_confirm') {
      toConfirmCount++;
    } else if (o.status === 'cancelled') {
      cancelledCount++;
    }
  });

  // Taux de livraison réel = Livrés / (Livrés + Annulés)
  const completedCount = deliveredCount + cancelledCount;
  const deliveryRatePct = completedCount > 0 ? Math.round((deliveredCount / completedCount) * 1000) / 10 : 100;

  const totalNetCashFCFA = totalGrossCashFCFA - totalDeliveryFeesFCFA;

  return {
    totalOrders: orders.length,
    deliveredCount,
    outForDeliveryCount,
    toConfirmCount,
    cancelledCount,
    deliveryRatePct,
    totalGrossCashFCFA,
    totalDeliveryFeesFCFA,
    totalNetCashFCFA,
  };
}

export function calculateLivreurSettlement(orders: CODOrder[], livreurId: string) {
  const livreurOrders = orders.filter((o) => o.livreurId === livreurId);
  const delivered = livreurOrders.filter((o) => o.status === 'delivered');
  const outForDelivery = livreurOrders.filter((o) => o.status === 'out_for_delivery');
  const cancelled = livreurOrders.filter((o) => o.status === 'cancelled');

  const totalGrossCashToCollect = delivered.reduce((sum, o) => sum + (o.totalPriceFCFA || 0), 0);
  const totalFeesDueToLivreur = delivered.reduce((sum, o) => sum + (o.deliveryFeeFCFA || 0), 0);
  const netCashToReceive = totalGrossCashToCollect - totalFeesDueToLivreur;

  return {
    totalAssigned: livreurOrders.length,
    deliveredCount: delivered.length,
    outForDeliveryCount: outForDelivery.length,
    cancelledCount: cancelled.length,
    totalGrossCashToCollect,
    totalFeesDueToLivreur,
    netCashToReceive,
  };
}
