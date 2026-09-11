import React, { useState } from 'react';
import { FurnitureItem, FurnitureCategory, ProposalFilter } from '../types';
import { formatPriceNumber } from '../utils/format';
import { STYLES, BRANDS, PRICE_RANGES } from '../data/furnitureData';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  CheckSquare,
  Square,
  Sparkles,
  Info,
} from 'lucide-react';

interface Step2ProductSelectionProps {
  filter: ProposalFilter;
  availableProducts: FurnitureItem[];
  selectedItemIds: Set<string>;
  onToggleItem: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBackToInput: () => void;
  onProceedToResult: () => void;
}

const CATEGORIES: { id: FurnitureCategory; label: string }[] = [
  { id: 'all', label: '전체 카테고리' },
  { id: 'sofa', label: '소파/라운지' },
  { id: 'table', label: '테이블/데스크' },
  { id: 'chair', label: '체어/스툴' },
  { id: 'lighting', label: '조명/스탠드' },
  { id: 'storage', label: '수납/선반장' },
];

export const Step2ProductSelection: React.FC<Step2ProductSelectionProps> = ({
  filter,
  availableProducts,
  selectedItemIds,
  onToggleItem,
  onSelectAll,
  onDeselectAll,
  onBackToInput,
  onProceedToResult,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory>('all');

  // Filter products by category
  const filteredProducts = availableProducts.filter((product) => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  // Calculate selected total
  const selectedItems = availableProducts.filter((p) => selectedItemIds.has(p.id));
  const selectedTotalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const styleInfo = STYLES.find((s) => s.id === filter.style);
  const brandInfo = BRANDS.find((b) => b.id === filter.brand);
  const priceRangeInfo = PRICE_RANGES.find((p) => p.id === filter.priceRange);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-32">
      {/* Top Banner: Current Selected Conditions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            추천 조건
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white flex items-center gap-1">
            스타일: {styleInfo?.title}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            브랜드: {brandInfo?.name}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            예산: {priceRangeInfo?.label} ({priceRangeInfo?.rangeText})
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToInput}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer self-start md:self-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>조건 변경하기</span>
        </button>
      </div>

      {/* Screen Title & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>추천 가구 선택</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
              총 {availableProducts.length}개 가구
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            공간 제안서에 포함할 가구를 선택하세요. 선택된 가구는 실제 공간 배치도와 견적서에 자동 반영됩니다.
          </p>
        </div>

        {/* Quick Selection Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>전체 선택</span>
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 text-slate-400" />
            <span>선택 해제</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-700 font-semibold">해당 카테고리에 맞는 제품이 없습니다.</p>
          <p className="text-xs text-slate-500 mt-1">상단의 다른 카테고리를 선택하거나 전체를 확인해보세요.</p>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="mt-4 px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg cursor-pointer"
          >
            전체 카테고리 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const isSelected = selectedItemIds.has(product.id);
            return (
              <div
                key={product.id}
                onClick={() => onToggleItem(product.id)}
                className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900/15 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Product Image & Select Badge */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Brand Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs">
                        {product.brand}
                      </span>
                    </div>

                    {/* Selection Checkbox / Indicator */}
                    <button
                      type="button"
                      aria-label={isSelected ? '선택 취소' : '제품 선택'}
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-amber-400 shadow-sm'
                          : 'bg-white/90 text-slate-400 border border-slate-200 hover:bg-white'
                      }`}
                    >
                      <Check className={`w-4 h-4 ${isSelected ? 'stroke-[3]' : 'opacity-40'}`} />
                    </button>

                    {/* Color chip */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
                        {product.color}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      {product.category === 'sofa'
                        ? '소파/라운지'
                        : product.category === 'table'
                        ? '테이블/데스크'
                        : product.category === 'chair'
                        ? '체어'
                        : product.category === 'lighting'
                        ? '조명'
                        : '수납'}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-0.5">
                      <div className="truncate">
                        <span className="text-slate-400">규격: </span>
                        {product.dimensions}
                      </div>
                      <div className="truncate">
                        <span className="text-slate-400">소재: </span>
                        {product.material}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="p-4 pt-0 mt-auto">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">제안 단가</span>
                      <span className="text-base font-extrabold text-slate-900 tracking-tight">
                        {formatPriceNumber(product.price)}
                      </span>
                    </div>

                    <div
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '선택됨 ✓' : '담기 +'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Sticky Proposal Action Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-20 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={onBackToInput}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>조건 재설정</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="text-xs text-slate-500">
                선택된 가구: <strong className="text-slate-900 font-bold">{selectedItemIds.size}개</strong>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">
                예상 합계: <span className="text-emerald-700">{formatPriceNumber(selectedTotalAmount)}</span>
              </div>
            </div>
          </div>

          <button
            id="btn-confirm-selection"
            type="button"
            disabled={selectedItemIds.size === 0}
            onClick={onProceedToResult}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              selectedItemIds.size > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer active:scale-[0.99]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>배치 및 가격 확인하기 ({selectedItemIds.size}개)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
