'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ShopProfile {
  ownerName: string;
  shopName: string;
  phone: string;
  country: string;
  currency: string;
}

const SHOP_PROFILE_STORAGE_KEY = 'siftly_shop_profile_v1';

const DEFAULT_SHOP_PROFILE: ShopProfile = {
  ownerName: 'Propriétaire (Fondateur)',
  shopName: 'Ma Boutique E-Commerce',
  phone: '+229 00 00 00 00',
  country: 'Bénin / Côte d\'Ivoire / Sénégal',
  currency: 'FCFA',
};

import { useAuth } from './useAuth';

export function useShopProfile() {
  const [profile, setProfile] = useState<ShopProfile>(DEFAULT_SHOP_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SHOP_PROFILE_STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load shop profile', e);
    }
    setIsLoaded(true);
  }, []);

  // Fetch shop name from cloud if user is logged in
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/workspace/shop-code?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.shopName && data.shopName !== 'Ma Boutique E-Commerce') {
            setProfile(prev => {
              if (prev.shopName !== data.shopName) {
                const updated = { ...prev, shopName: data.shopName };
                localStorage.setItem(SHOP_PROFILE_STORAGE_KEY, JSON.stringify(updated));
                return updated;
              }
              return prev;
            });
          }
        })
        .catch(err => console.warn('Cloud sync error for shop profile:', err));
    }
  }, [user?.id]);

  const updateProfile = useCallback((newProfile: Partial<ShopProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...newProfile };
      try {
        localStorage.setItem(SHOP_PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save shop profile', e);
      }
      return updated;
    });
  }, []);

  return {
    profile,
    updateProfile,
    isLoaded,
  };
}
