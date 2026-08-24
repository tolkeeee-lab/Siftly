export interface StorageUsageInfo {
  usedBytes: number;
  quotaBytes: number;
  percent: number;
  isNearFull: boolean;
}

export function checkLocalStorageUsage(key = 'eaa-produits-benin'): StorageUsageInfo {
  if (typeof window === 'undefined') {
    return { usedBytes: 0, quotaBytes: 5 * 1024 * 1024, percent: 0, isNearFull: false };
  }

  let totalChars = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) {
        const val = localStorage.getItem(k) || '';
        totalChars += k.length + val.length;
      }
    }
  } catch (e) {
    console.warn('Could not inspect localStorage size', e);
  }

  // 1 char ~ 2 bytes in UTF-16
  const usedBytes = totalChars * 2;
  const quotaBytes = 5 * 1024 * 1024; // Standard 5MB limit
  const percent = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));

  return {
    usedBytes,
    quotaBytes,
    percent,
    isNearFull: percent >= 75,
  };
}
