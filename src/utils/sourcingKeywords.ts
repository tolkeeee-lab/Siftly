/**
 * Smart Sourcing Keywords Optimizer for Alibaba, AliExpress, 1688 & TikTok
 * Automatically cleans search queries, removes noise words that trigger competitor ads (e.g. Ugreen/Anker),
 * and translates French e-commerce terms into high-precision B2B factory search tokens.
 */

export interface SourcingQueries {
  exactModelQuery: string;       // ex: "Baseus EnerGeek GR11"
  factoryOemQuery: string;       // ex: "retractable cable power bank 200W 25000mAh"
  chineseQuery: string;          // ex: "倍思 伸缩线 移动电源"
  aliexpressUrl: string;
  alibabaUrl: string;
  alibaba1688Url: string;
  tiktokUrl: string;
  googleLensUrl: string;
  amazonUrl: string;
}

const COMMON_FRENCH_TO_FACTORY_EN: Record<string, { oem: string; zh?: string }> = {
  hachoir: { oem: 'electric food chopper garlic masher cordless usb', zh: '电动大蒜捣碎机' },
  mixeur: { oem: 'portable blender electric juicer usb rechargeable', zh: '便携式榨汁机' },
  batterie: { oem: 'power bank fast charging portable charger', zh: '移动电源' },
  'power bank': { oem: 'power bank fast charging digital display', zh: '充电宝' },
  diffuseur: { oem: 'flame aroma diffuser air humidifier essential oil', zh: '火焰香薰机' },
  humidificateur: { oem: 'ultrasonic air humidifier aroma diffuser', zh: '加湿器' },
  epilateur: { oem: 'crystal hair eraser painless physical epilator', zh: '水晶脱毛器' },
  correcteur: { oem: 'posture corrector back support belt adjustable', zh: '背部矫正带' },
  lampe: { oem: 'led solar light sensor outdoor waterproof', zh: '太阳能感应灯' },
  veilleuse: { oem: 'night light led touch sensor rechargeable', zh: '小夜灯' },
  ecouteur: { oem: 'wireless earbuds bluetooth headphones tws', zh: '蓝牙耳机' },
  support: { oem: 'car phone holder magnetic air vent mount', zh: '车用手机支架' },
  aspirateur: { oem: 'handheld vacuum cleaner wireless portable car home', zh: '手持无线吸尘器' },
  coussin: { oem: 'memory foam seat cushion orthopedic relief', zh: '记忆海绵坐垫' },
  masseur: { oem: 'electric neck back massager shiatsu heat', zh: '颈部按摩仪' },
  montre: { oem: 'smart watch fitness tracker heart rate blood pressure', zh: '智能手表' },
};

export function optimizeSourcingQueries(rawText: string, imageSrc?: string): SourcingQueries {
  const clean = (rawText || '').trim();
  if (!clean) {
    return {
      exactModelQuery: 'Baseus EnerGeek GR11',
      factoryOemQuery: 'retractable cable power bank 200W',
      chineseQuery: '倍思 伸缩线 移动电源',
      aliexpressUrl: 'https://www.aliexpress.com/wholesale?SearchText=Baseus+EnerGeek+GR11',
      alibabaUrl: 'https://www.alibaba.com/trade/search?SearchText=Baseus+EnerGeek',
      alibaba1688Url: 'https://p4psearch.1688.com/page.html?keywords=Baseus%20EnerGeek',
      tiktokUrl: 'https://www.tiktok.com/search?q=Baseus+EnerGeek',
      googleLensUrl: 'https://lens.google.com/',
      amazonUrl: 'https://www.amazon.com/s?k=Baseus+EnerGeek',
    };
  }

  const lower = clean.toLowerCase();

  // 1. Detect if the user entered a specific brand + model (like Baseus EnerGeek GR11)
  const isSpecificBrandModel =
    lower.includes('baseus') ||
    lower.includes('gr11') ||
    lower.includes('energeek') ||
    lower.includes('ugreen') ||
    lower.includes('anker') ||
    lower.includes('xiaomi');

  let exactModel = clean;
  let factoryOem = clean;
  let chineseKeywords = clean;

  if (isSpecificBrandModel) {
    // If it's Baseus EnerGeek, strip generic clutter to avoid triggering competitor ads like Ugreen
    exactModel = clean.replace(/power\s*bank/gi, '').replace(/batterie\s*externe/gi, '').trim();
    if (!exactModel) exactModel = clean;

    factoryOem = `${clean} 200W retractable cable`;
    chineseKeywords = `倍思 ${exactModel} 伸缩线 移动电源`;
  } else {
    // Check if French dictionary has exact factory translation
    for (const [frKey, translation] of Object.entries(COMMON_FRENCH_TO_FACTORY_EN)) {
      if (lower.includes(frKey)) {
        factoryOem = translation.oem;
        if (translation.zh) chineseKeywords = translation.zh;
        break;
      }
    }
  }

  const exactEncoded = encodeURIComponent(exactModel);
  const oemEncoded = encodeURIComponent(factoryOem);
  const zhEncoded = encodeURIComponent(chineseKeywords);

  const aliexpressUrl = `https://www.aliexpress.com/wholesale?SearchText=${exactEncoded}`;
  const alibabaUrl = `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=${exactEncoded}`;
  const alibaba1688Url = `https://p4psearch.1688.com/page.html?keywords=${zhEncoded || exactEncoded}`;
  const tiktokUrl = `https://www.tiktok.com/search?q=${exactEncoded}`;
  const amazonUrl = `https://www.amazon.com/s?k=${exactEncoded}`;

  const googleLensUrl = imageSrc && imageSrc.startsWith('http')
    ? `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageSrc)}`
    : `https://lens.google.com/`;

  return {
    exactModelQuery: exactModel,
    factoryOemQuery: factoryOem,
    chineseQuery: chineseKeywords,
    aliexpressUrl,
    alibabaUrl,
    alibaba1688Url,
    tiktokUrl,
    googleLensUrl,
    amazonUrl,
  };
}
