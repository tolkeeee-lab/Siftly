import { CODOrder } from '../types/codLogistics';
import { formatFCFA } from './formatters';

export function generateCustomerConfirmationMessage(order: CODOrder): string {
  let msg = `Bonjour *${order.customerName}*,\n\n`;
  msg += `Nous avons bien reçu votre commande pour :\n`;
  msg += `📦 *Article :* ${order.productName} (Quantité : ${order.quantity})\n`;
  msg += `💵 *Montant total à payer :* *${formatFCFA(order.totalPriceFCFA)}*\n`;
  msg += `📍 *Adresse de livraison :* ${order.customerCity}, ${order.customerAddress}\n\n`;
  msg += `Notre livreur passera vous livrer très prochainement. Le paiement se fera en espèces ou Mobile Money directement à la réception du colis.\n\n`;
  msg += `Merci de nous confirmer par un simple *« OUI »* si vous êtes disponible pour réceptionner votre colis. Belle journée à vous !`;
  return msg;
}

export function generateLivreurDispatchMessage(order: CODOrder): string {
  let msg = `🛵 *NOUVELLE COURSE À LIVRER : ${order.orderNumber}*\n`;
  msg += `----------------------------------------\n`;
  msg += `👤 *Client :* ${order.customerName}\n`;
  msg += `📞 *Téléphone :* ${order.customerPhone}\n`;
  msg += `📍 *Ville / Quartier :* ${order.customerCity}\n`;
  msg += `🏠 *Adresse exacte :* ${order.customerAddress}\n\n`;
  msg += `📦 *Article :* ${order.productName} (x${order.quantity})\n`;
  msg += `💰 *MONTANT À ENCAISSER :* *${formatFCFA(order.totalPriceFCFA)}*\n`;
  if (order.notes) {
    msg += `📝 *Note client :* ${order.notes}\n`;
  }
  msg += `----------------------------------------\n`;
  msg += `Merci de faire signer le client et de confirmer dès que c'est livré !`;
  return msg;
}
