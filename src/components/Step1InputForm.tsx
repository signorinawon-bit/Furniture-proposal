import React from 'react';
import { StyleType, BrandType, PriceRangeType } from '../types';
import { STYLES, BRANDS, PRICE_RANGES } from '../data/furnitureData';
import { Sparkles, Check, ChevronRight } from 'lucide-react';

interface Step1InputFormProps {
  selectedStyle: StyleType;
  selectedBrand: BrandType;
  selectedPriceRange: PriceRangeType;
  onStyleChange: (style: StyleType) => void;
  onBrandChange: (brand: BrandType) => void;
  onPriceRangeChange: (priceRange: PriceRangeType) => void;
  onSubmit: () => void;
}

export const Step1InputForm: React.FC<Step1InputFormProps> = ({
  selectedStyle,
  selectedBrand,
  selectedPriceRange,
  onStyleChange,
  onBrandChange,
  onPriceRangeChange,
  onSubmit,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Intro Heading */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-3">
          1단계 · 조건 입력
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          어떤 공간을 제안하시겠어요?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          스타일 · 브랜드 · 가격대 3가지 조건만 선택하시면, 최적의 가구 조합과 공간 배치 제안서를 구성해 드립니다.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        {/* 입력 1: 스타일 선택 */}
        <section aria-labelledby="style-section-title">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 id="style-section-title" className="text-base sm:text-lg font-bold text-slate-900">
                  스타일 선택
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">고객이 선호하는 인테리어 무드를 선택하세요.</p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              필수 선택
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {STYLES.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onStyleChange(style.id)}
                  className={`group relative text-left rounded-xl p-3.5 border transition-all duration-150 flex flex-col justify-between overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-900'
                  }`}
                >
                  {/* Visual Style Thumbnail */}
                  <div className="relative w-full h-28 rounded-lg overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={style.roomBgUrl}
                      alt={style.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-black/50 text-white backdrop-blur-xs">
                      {style.tag}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div>
                    <div className="flex items-baseline justify-between gap-1">
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {style.title}
                      </span>
                      <span className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {style.subtitle}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {style.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 입력 2: 브랜드 선택 */}
        <section aria-labelledby="brand-section-title" className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 id="brand-section-title" className="text-base sm:text-lg font-bold text-slate-900">
                  브랜드 선택
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">선호하는 브랜드 또는 전체 추천을 선택하세요.</p>
            </div>
            <span className="text-xs text-slate-500">
              현재: <strong className="text-slate-900 font-semibold">{BRANDS.find(b => b.id === selectedBrand)?.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {BRANDS.map((brand) => {
              const isSelected = selectedBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => onBrandChange(brand.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] uppercase font-semibold tracking-wider ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                        {brand.origin}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    <div className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {brand.name}
                    </div>
                  </div>
                  <p className={`text-[11px] mt-2 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {brand.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 입력 3: 가격대 선택 */}
        <section aria-labelledby="price-section-title" className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 id="price-section-title" className="text-base sm:text-lg font-bold text-slate-900">
                  가격대 선택
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">고객의 예산 플랜에 맞춘 가격 범위를 지정하세요.</p>
            </div>
            <span className="text-xs text-slate-500">
              선택: <strong className="text-slate-900 font-semibold">{PRICE_RANGES.find(p => p.id === selectedPriceRange)?.rangeText}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {PRICE_RANGES.map((priceOption) => {
              const isSelected = selectedPriceRange === priceOption.id;
              return (
                <button
                  key={priceOption.id}
                  type="button"
                  onClick={() => onPriceRangeChange(priceOption.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-slate-900'}`}>
                        {priceOption.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                      {priceOption.rangeText}
                    </div>
                  </div>
                  <p className={`text-[11px] mt-2 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {priceOption.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 1개 메인 버튼: 제품 추천받기 */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            선택된 조건: <span className="font-semibold text-slate-900">{STYLES.find(s => s.id === selectedStyle)?.title}</span> ·{' '}
            <span className="font-semibold text-slate-900">{BRANDS.find(b => b.id === selectedBrand)?.name}</span> ·{' '}
            <span className="font-semibold text-slate-900">{PRICE_RANGES.find(p => p.id === selectedPriceRange)?.label}</span>
          </div>

          <button
            id="btn-recommend-furniture"
            type="button"
            onClick={onSubmit}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>제품 추천받기</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
