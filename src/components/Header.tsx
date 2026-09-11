import React from 'react';
import { Sofa, CheckCircle2, SlidersHorizontal, Layers, FileCheck } from 'lucide-react';

interface HeaderProps {
  currentStep: 1 | 2 | 3;
  onStepChange?: (step: 1 | 2 | 3) => void;
  selectedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onStepChange, selectedCount }) => {
  const steps = [
    { num: 1 as const, label: '조건 입력', icon: SlidersHorizontal, desc: '스타일·브랜드·가격대' },
    { num: 2 as const, label: '제품 선택', icon: Layers, desc: `${selectedCount > 0 ? `${selectedCount}개 선택됨` : '추천 가구 선택'}` },
    { num: 3 as const, label: '배치 및 가격 확인', icon: FileCheck, desc: '공간 연출 & 견적 합계' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Sofa className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">가구 제안 앱</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                  Proposal Suite
                </span>
              </div>
              <p className="text-xs text-slate-500">스타일 · 브랜드 · 예산 맞춤 가구 제안 & 공간 배치 견적</p>
            </div>
          </div>

          {/* Stepper Steps */}
          <nav aria-label="진행 단계" className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              const isAccessible = isPast || (step.num === 2 && currentStep >= 1) || (step.num === 3 && selectedCount > 0);

              return (
                <div key={step.num} className="flex items-center">
                  <button
                    type="button"
                    disabled={!isAccessible}
                    onClick={() => onStepChange && onStepChange(step.num)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : isPast
                        ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                        : 'text-slate-400 cursor-not-allowed opacity-75'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-xs sm:text-sm">{step.label}</span>
                    </div>
                  </button>

                  {idx < steps.length - 1 && (
                    <div className="w-4 sm:w-8 h-px bg-slate-200 mx-1 sm:mx-2 shrink-0" />
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
