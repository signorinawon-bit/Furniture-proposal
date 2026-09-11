import { useState, useMemo } from 'react';
import { StyleType, BrandType, PriceRangeType, FurnitureItem } from './types';
import { FURNITURE_DATABASE, PRICE_RANGES } from './data/furnitureData';
import { Header } from './components/Header';
import { Step1InputForm } from './components/Step1InputForm';
import { Step2ProductSelection } from './components/Step2ProductSelection';
import { Step3ProposalResult } from './components/Step3ProposalResult';

export default function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [style, setStyle] = useState<StyleType>('modern');
  const [brand, setBrand] = useState<BrandType>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeType>('all');

  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // Filter available products based on the 3 inputs
  const availableProducts = useMemo(() => {
    const rangeConfig = PRICE_RANGES.find((p) => p.id === priceRange);
    const minP = rangeConfig?.minPrice ?? 0;
    const maxP = rangeConfig?.maxPrice ?? Infinity;

    // Filter strictly
    let matches = FURNITURE_DATABASE.filter((item) => {
      const matchStyle = item.style === style;
      const matchBrand = brand === 'all' || item.brand.toLowerCase() === brand.toLowerCase();
      const matchPrice = item.price >= minP && item.price <= maxP;
      return matchStyle && matchBrand && matchPrice;
    });

    // If strict filter yielded 0 items, relax brand or price to ensure professional UX
    if (matches.length === 0) {
      matches = FURNITURE_DATABASE.filter((item) => item.style === style);
    }

    return matches;
  }, [style, brand, priceRange]);

  // Handle Step 1: "제품 추천받기" button
  const handleRecommendProducts = () => {
    // Pick the recommended set from the matching products (e.g. up to 4-5 items across categories)
    const newSelected = new Set<string>();
    const newQuantities: Record<string, number> = {};

    // Select one product per category if possible
    const seenCategories = new Set<string>();
    availableProducts.forEach((item) => {
      if (!seenCategories.has(item.category)) {
        seenCategories.add(item.category);
        newSelected.add(item.id);
        newQuantities[item.id] = 1;
      }
    });

    // If fewer than 3 were selected, add from the available pool
    if (newSelected.size < 3) {
      availableProducts.slice(0, 4).forEach((item) => {
        newSelected.add(item.id);
        if (!newQuantities[item.id]) {
          newQuantities[item.id] = 1;
        }
      });
    }

    setSelectedItemIds(newSelected);
    setItemQuantities(newQuantities);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle item selection
  const handleToggleItem = (id: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (!itemQuantities[id]) {
          setItemQuantities((q) => ({ ...q, [id]: 1 }));
        }
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(availableProducts.map((p) => p.id));
    setSelectedItemIds(allIds);
    const newQty = { ...itemQuantities };
    availableProducts.forEach((p) => {
      if (!newQty[p.id]) newQty[p.id] = 1;
    });
    setItemQuantities(newQty);
  };

  const handleDeselectAll = () => {
    setSelectedItemIds(new Set());
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItemQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleResetConditions = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter items that are currently selected
  const selectedItems: FurnitureItem[] = useMemo(() => {
    return FURNITURE_DATABASE.filter((item) => selectedItemIds.has(item.id));
  }, [selectedItemIds]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Header with Navigation Stepper */}
      <Header
        currentStep={currentStep}
        onStepChange={(s) => {
          if (s === 1) setCurrentStep(1);
          if (s === 2 && currentStep >= 1) setCurrentStep(2);
          if (s === 3 && selectedItemIds.size > 0) setCurrentStep(3);
        }}
        selectedCount={selectedItemIds.size}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {currentStep === 1 && (
          <Step1InputForm
            selectedStyle={style}
            selectedBrand={brand}
            selectedPriceRange={priceRange}
            onStyleChange={setStyle}
            onBrandChange={setBrand}
            onPriceRangeChange={setPriceRange}
            onSubmit={handleRecommendProducts}
          />
        )}

        {currentStep === 2 && (
          <Step2ProductSelection
            filter={{ style, brand, priceRange }}
            availableProducts={availableProducts}
            selectedItemIds={selectedItemIds}
            onToggleItem={handleToggleItem}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBackToInput={() => {
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onProceedToResult={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3ProposalResult
            filter={{ style, brand, priceRange }}
            selectedItems={selectedItems}
            itemQuantities={itemQuantities}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onBackToSelection={() => {
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetConditions={handleResetConditions}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 가구 제안 솔루션 · 가구 제안 업무 지원 시스템</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>스타일·브랜드·가격대 3단 필터</span>
            <span>·</span>
            <span>공간 배치 연동</span>
            <span>·</span>
            <span>실시간 견적 합계</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
