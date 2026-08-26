'use client';

import { useState, useEffect, useCallback } from 'react';
import { LandingPageConfig } from '../types/landingTypes';
import { ProductData } from '../types/product';
import { generateLandingConfig } from '../utils/landingTemplates';

const LANDING_CONFIGS_KEY = 'siftly_landing_configs_v1';

export function useLandingPageConfigs() {
  const [configsMap, setConfigsMap] = useState<Record<string, LandingPageConfig>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANDING_CONFIGS_KEY);
      if (saved) {
        setConfigsMap(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load landing configs', e);
    }
    setIsLoaded(true);
  }, []);

  const saveConfigs = useCallback((newMap: Record<string, LandingPageConfig>) => {
    setConfigsMap(newMap);
    try {
      localStorage.setItem(LANDING_CONFIGS_KEY, JSON.stringify(newMap));
    } catch (e) {
      console.warn('Could not save landing configs', e);
    }
  }, []);

  const getConfigForProduct = useCallback((product: ProductData | null): LandingPageConfig => {
    if (!product) return generateLandingConfig(null);
    if (configsMap[product.id]) {
      return configsMap[product.id];
    }
    return generateLandingConfig(product);
  }, [configsMap]);

  const updateConfig = useCallback((productId: string, updatedConfig: LandingPageConfig) => {
    const newMap = {
      ...configsMap,
      [productId]: updatedConfig,
    };
    saveConfigs(newMap);
  }, [configsMap, saveConfigs]);

  const resetConfig = useCallback((product: ProductData) => {
    const defaultConfig = generateLandingConfig(product);
    updateConfig(product.id, defaultConfig);
  }, [updateConfig]);

  return {
    configsMap,
    isLoaded,
    getConfigForProduct,
    updateConfig,
    resetConfig,
  };
}
