'use client';

import React from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../types/product';
import { getCategoryIcon } from '../../utils/marketIntelligence';

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts?: Record<string, number>;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  const totalAll = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="category-filter-bar">
      <div className="category-filter-label">
        <Tag className="w-3.5 h-3.5 text-gold-deep" />
        <span>Catégories :</span>
      </div>

      <div className="category-pills-scroll">
        <button
          type="button"
          className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <span>🌐 Toutes les Niches</span>
          {totalAll > 0 && <span className="cat-count-badge">{totalAll}</span>}
        </button>

        {PRODUCT_CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0;
          const isSelected = selectedCategory === cat;
          const icon = getCategoryIcon(cat);

          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat)}
            >
              <span>{icon} {cat}</span>
              {count > 0 && <span className="cat-count-badge">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
