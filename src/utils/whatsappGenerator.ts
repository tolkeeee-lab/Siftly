import { PurchaseOrder } from '../types/purchaseOrder';
import { calculatePOMerchandiseTotalOriginal, calculatePOMerchandiseTotalFCFA } from './poCalculations';
import { formatFCFA } from './formatters';

export function generateSupplierWhatsAppMessage(po: PurchaseOrder, lang: 'fr' | 'en' = 'en'): string {
  const totalOrig = calculatePOMerchandiseTotalOriginal(po);
  const totalFCFA = calculatePOMerchandiseTotalFCFA(po);
  const currencySymbol = po.currency === 'RMB' ? '¥' : po.currency === 'USD' ? '$' : 'FCFA';

  if (lang === 'en') {
    let msg = `*PURCHASE ORDER: ${po.orderNumber}*\n`;
    msg += `----------------------------------------\n`;
    msg += `Hello, I would like to place an order for the following items:\n\n`;
    msg += `📦 *Product:* ${po.productName}\n`;
    if (po.variants && po.variants.length > 0) {
      msg += `📋 *Breakdown:*\n`;
      po.variants.forEach((v) => {
        msg += `  • ${v.name}: ${v.quantity} pcs @ ${currencySymbol}${v.unitPrice}\n`;
      });
    }
    msg += `🔢 *Total Quantity:* ${po.quantity} pcs\n`;
    msg += `💰 *Unit Price:* ${currencySymbol}${po.unitPriceOriginal}\n`;
    msg += `💵 *Total Amount:* ${currencySymbol}${totalOrig.toLocaleString()} (~${formatFCFA(totalFCFA)})\n\n`;
    msg += `🏢 *SHIPPING / FORWARDER INSTRUCTIONS:*\n`;
    msg += `• *Forwarder:* ${po.forwarderName || 'Please send to my agent'}\n`;
    if (po.shippingMark) {
      msg += `• *Shipping Mark (VERY IMPORTANT):* [ ${po.shippingMark} ]\n`;
    }
    if (po.forwarderWarehouse) {
      msg += `• *Warehouse Address:* ${po.forwarderWarehouse}\n`;
    }
    msg += `\nPlease confirm availability, packaging dimensions (CBM/Weight) and payment details. Thank you!`;
    return msg;
  }

  let msg = `*BON DE COMMANDE : ${po.orderNumber}*\n`;
  msg += `----------------------------------------\n`;
  msg += `Bonjour, voici notre commande officielle :\n\n`;
  msg += `📦 *Produit :* ${po.productName}\n`;
  if (po.variants && po.variants.length > 0) {
    msg += `📋 *Détail des Variantes :*\n`;
    po.variants.forEach((v) => {
      msg += `  • ${v.name} : ${v.quantity} pcs @ ${currencySymbol}${v.unitPrice}\n`;
    });
  }
  msg += `🔢 *Quantité totale :* ${po.quantity} pcs\n`;
  msg += `💰 *Prix unitaire :* ${currencySymbol}${po.unitPriceOriginal}\n`;
  msg += `💵 *Total marchandise :* ${currencySymbol}${totalOrig.toLocaleString()} (~${formatFCFA(totalFCFA)})\n\n`;
  msg += `🏢 *INSTRUCTIONS DE LIVRAISON (TRANSITAIRE) :*\n`;
  msg += `• *Transitaire :* ${po.forwarderName || 'Adresse transitaire'}\n`;
  if (po.shippingMark) {
    msg += `• *Marquage des cartons (Shipping Mark) :* [ ${po.shippingMark} ]\n`;
  }
  if (po.forwarderWarehouse) {
    msg += `• *Adresse entrepôt Chine :* ${po.forwarderWarehouse}\n`;
  }
  msg += `\nMerci de confirmer la disponibilité et vos coordonnées de paiement.`;
  return msg;
}
