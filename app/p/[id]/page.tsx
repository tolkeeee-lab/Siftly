'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useProducts } from '../../../src/hooks/useProducts';
import { useCODOrders } from '../../../src/hooks/useCODOrders';
import { useLandingPageConfigs } from '../../../src/hooks/useLandingPageConfigs';
import { LandingPagePreview } from '../../../src/components/landing/LandingPagePreview';
import { CODStatus } from '../../../src/types/codLogistics';

export default function PublicProductLandingPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { products } = useProducts();
  const { addOrder } = useCODOrders();
  const { getConfigForProduct } = useLandingPageConfigs();

  const product = useMemo(() => {
    return products.find((p) => p.id === productId) || products[0] || null;
  }, [products, productId]);

  const config = useMemo(() => {
    return getConfigForProduct(product);
  }, [product, getConfigForProduct]);

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
      notes: 'Commande directe passée en ligne sur la Page Publique',
    });
  };

  return (
    <LandingPagePreview
      config={config}
      onOrderSuccess={handleOrderSuccess}
    />
  );
}
