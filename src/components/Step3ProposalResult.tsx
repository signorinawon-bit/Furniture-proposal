import React, { useState } from 'react';
import { FurnitureItem, ProposalFilter } from '../types';
import { formatPriceNumber } from '../utils/format';
import { STYLES, BRANDS } from '../data/furnitureData';
import { ProposalPrintModal } from './ProposalPrintModal';
import {
  Printer,
  Copy,
  Check,
  ChevronLeft,
  Eye,
  LayoutGrid,
  Compass,
  Plus,
  Minus,
  Trash2,
  Share2,
  Calendar,
  Building,
  DollarSign,
  Info,
} from 'lucide-react';

interface Step3ProposalResultProps {
  filter: ProposalFilter;
  selectedItems: FurnitureItem[];
  itemQuantities: Record<string, number>;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onBackToSelection: () => void;
  onResetConditions: () => void;
}

type ViewMode = 'staged_room' | 'layout_plan' | 'moodboard';

export const Step3ProposalResult: React.FC<Step3ProposalResultProps> = ({
  filter,
  selectedItems,
  itemQuantities,
  onUpdateQuantity,
  onRemoveItem,
  onBackToSelection,
  onResetConditions,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>('staged_room');
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const styleInfo = STYLES.find((s) => s.id === filter.style) || STYLES[0];
  const brandInfo = BRANDS.find((b) => b.id === filter.brand) || BRANDS[0];

  // Calculate totals
  const totalQuantity = selectedItems.reduce((acc, item) => acc + (itemQuantities[item.id] || 1), 0);
  const subtotalAmount = selectedItems.reduce(
    (acc, item) => acc + item.price * (itemQuantities[item.id] || 1),
    0
  );
  const vatAmount = Math.round(subtotalAmount * 0.1);
  const totalAmount = subtotalAmount; // All-inclusive display

  // Copy proposal text to clipboard
  const handleCopyProposal = () => {
    const today = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let text = `[가구 인테리어 제안서]\n`;
    text += `작성일자: ${today}\n`;
    text += `공간 스타일: ${styleInfo.title} (${styleInfo.subtitle})\n`;
    text += `추천 브랜드: ${brandInfo.name}\n\n`;
    text += `--- [제안 가구 목록 및 개별 가격] ---\n`;

    selectedItems.forEach((item, index) => {
      const qty = itemQuantities[item.id] || 1;
      text += `${index + 1}. [${item.brand}] ${item.name}\n`;
      text += `   - 수량: ${qty}개\n`;
      text += `   - 개별 단가: ${formatPriceNumber(item.price)}\n`;
      text += `   - 소계: ${formatPriceNumber(item.price * qty)}\n`;
      text += `   - 규격: ${item.dimensions}\n\n`;
    });

    text += `------------------------------------\n`;
    text += `총 제안 품목 수량: ${totalQuantity}개\n`;
    text += `가구 제안 총액: ${formatPriceNumber(totalAmount)} (VAT 포함)\n`;
    text += `------------------------------------\n`;

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  const handlePrint = () => {
    // Open dedicated high-fidelity print modal that bypasses iframe sandbox restrictions
    setIsPrintModalOpen(true);
  };

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Print-only Proposal Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900">가구 제안서 및 공간 견적서</h1>
            <p className="text-sm text-slate-600 mt-1">
              스타일: {styleInfo.title} | 브랜드: {brandInfo.name}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>제안일자: {todayStr}</div>
            <div>제안 솔루션: 가구 제안 앱</div>
          </div>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToSelection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>가구 추가 / 변경</span>
          </button>
          <button
            type="button"
            onClick={onResetConditions}
            className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
          >
            처음부터 다시 입력
          </button>
        </div>

        {/* Client Proposal Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyProposal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">견적서 복사완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>제안 견적 복사</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>제안서 출력 / PDF 저장</span>
          </button>
        </div>
      </div>

      {/* Proposal Summary Badge */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                제안 공간 무드
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {todayStr} 제안서
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {styleInfo.title} 스타일 맞춤 공간 제안
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {styleInfo.description} 선택하신 {selectedItems.length}종의 가구를 조화롭게 매칭한 공간 배치 및 가격 총액 견적입니다.
            </p>
          </div>

          {/* Key Outcome Highlights */}
          <div className="flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 shrink-0">
            <div>
              <span className="text-[11px] text-slate-300 block">선택 가구 수</span>
              <span className="text-lg sm:text-xl font-bold text-white">{totalQuantity}개 품목</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="text-[11px] text-amber-300 block font-medium">가구 가격 총액</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                {formatPriceNumber(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Core Outcome: 배치 모습 + 각각의 가격 + 합계 금액 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (lg: 7 cols): 선택 가구 배치 이미지 & 룸 연출 뷰 */}
        <section aria-labelledby="room-placement-title" className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* View Mode Switcher Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 id="room-placement-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>선택 가구 공간 배치도</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    실시간 매핑
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  공간 위의 핀 마커에 마우스를 올리거나 클릭하면 해당 가구 정보를 확인할 수 있습니다.
                </p>
              </div>

              {/* View mode toggle pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveViewMode('staged_room')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeViewMode === 'staged_room'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>공간 연출 씬</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('layout_plan')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeViewMode === 'layout_plan'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>공간 배치도</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('moodboard')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeViewMode === 'moodboard'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>무드보드</span>
                </button>
              </div>
            </div>

            {/* View Mode 1: Staged Room Scene */}
            {activeViewMode === 'staged_room' && (
              <div className="relative aspect-16/10 sm:aspect-16/9 bg-slate-950 overflow-hidden select-none">
                {/* High Resolution Room Background matching style */}
                <img
                  src={styleInfo.roomBgUrl}
                  alt={`${styleInfo.title} 룸 인테리어 배치 공간`}
                  className="w-full h-full object-cover brightness-95 contrast-105"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                {/* Room Info Watermark */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-white text-[11px] font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{styleInfo.title} 거실 공간 연출</span>
                </div>

                {/* Interactive Placement Pins for each selected furniture item */}
                {selectedItems.map((item, index) => {
                  const isHovered = activeHoverId === item.id;
                  const pos = item.roomPlacement;

                  return (
                    <div
                      key={item.id}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-200"
                      onMouseEnter={() => setActiveHoverId(item.id)}
                      onMouseLeave={() => setActiveHoverId(null)}
                    >
                      {/* Pulse Ring */}
                      <span className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping" />

                      {/* Pin Button */}
                      <button
                        type="button"
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg transition-transform ${
                          isHovered
                            ? 'bg-amber-400 text-slate-950 scale-125 ring-4 ring-white'
                            : 'bg-slate-900/90 text-amber-400 ring-2 ring-amber-400/80'
                        }`}
                      >
                        {index + 1}
                      </button>

                      {/* Pin Hover/Selected Card Badge */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2.5 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-xl border border-slate-700/80 transition-all pointer-events-none ${
                          isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                      >
                        <div className="flex gap-2 items-center">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] text-amber-300 font-semibold uppercase block truncate">
                              {item.brand}
                            </span>
                            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                            <div className="text-xs font-extrabold text-amber-400 mt-0.5">
                              {formatPriceNumber(item.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* View Mode 2: Layout Plan (2.5D Architectural zoning) */}
            {activeViewMode === 'layout_plan' && (
              <div className="p-6 bg-slate-50 relative min-h-[380px] flex flex-col justify-between">
                <div className="text-xs text-slate-500 flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">공간 평면 구획 및 가구 동선 플랜</span>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    전용 34평형 거실 기준
                  </span>
                </div>

                {/* Architectural Grid Floor */}
                <div className="relative my-4 aspect-16/9 bg-white rounded-xl border border-slate-200 shadow-inner p-6 overflow-hidden">
                  {/* Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, #64748b 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* Window & Balcony indicators */}
                  <div className="absolute top-0 inset-x-8 h-2 bg-sky-200 rounded-b-md text-[9px] text-center text-sky-800 font-bold">
                    메인 창호 및 자연 채광면
                  </div>
                  <div className="absolute bottom-0 left-8 w-24 h-2 bg-slate-300 rounded-t-md text-[9px] text-center text-slate-600 font-bold">
                    현관 복도 진입로
                  </div>

                  {/* Positioned Item Blocks */}
                  {selectedItems.map((item, idx) => {
                    const pos = item.roomPlacement;
                    const isHovered = activeHoverId === item.id;
                    return (
                      <div
                        key={item.id}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        onMouseEnter={() => setActiveHoverId(item.id)}
                        onMouseLeave={() => setActiveHoverId(null)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 max-w-[200px] ${
                          isHovered
                            ? 'bg-slate-900 text-white border-amber-400 shadow-lg scale-105 z-20 ring-2 ring-amber-400'
                            : 'bg-white text-slate-900 border-slate-300 shadow-xs hover:border-slate-400'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isHovered ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold truncate">{item.name}</p>
                          <p
                            className={`text-[10px] ${
                              isHovered ? 'text-amber-300' : 'text-slate-500'
                            }`}
                          >
                            {formatPriceNumber(item.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>* 가구 간 최소 이동 동선 800mm 확보 설계</span>
                  <span>단위: mm</span>
                </div>
              </div>
            )}

            {/* View Mode 3: Moodboard Grid */}
            {activeViewMode === 'moodboard' && (
              <div className="p-5 bg-slate-100">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Style Anchor Card */}
                  <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-900 text-white p-3 flex flex-col justify-end">
                    <img
                      src={styleInfo.roomBgUrl}
                      alt={styleInfo.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="relative z-10">
                      <span className="text-[10px] font-semibold text-amber-300 uppercase block">Concept</span>
                      <h4 className="text-sm font-bold">{styleInfo.title}</h4>
                      <p className="text-[10px] text-slate-300 mt-0.5">{styleInfo.description}</p>
                    </div>
                  </div>

                  {/* Selected Furniture Cutouts */}
                  {selectedItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs flex flex-col justify-between"
                    >
                      <div className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden mb-2">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{item.brand}</span>
                        <h5 className="text-[11px] font-bold text-slate-900 truncate">{item.name}</h5>
                        <p className="text-xs font-extrabold text-slate-900 mt-1">
                          {formatPriceNumber(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Placement Legend */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600 mr-2">배치 가구 핀:</span>
                {selectedItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActiveHoverId(item.id)}
                    onMouseLeave={() => setActiveHoverId(null)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      activeHoverId === item.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[120px]">{item.name}</span>
                    <span className="text-slate-400 text-[11px] font-semibold">
                      {formatPriceNumber(item.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column (lg: 5 cols): 선택 제품 목록 + 개별 가격 + 합계 금액 */}
        <section aria-labelledby="proposal-detail-title" className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 id="proposal-detail-title" className="text-base font-bold text-slate-900">
                  선택 제품 목록 및 개별 가격
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  총 {selectedItems.length}종 · {totalQuantity}개 품목
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                실시간 견적 연동
              </span>
            </div>

            {/* Individual Furniture List (개별 가구 + 가격) */}
            <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
              {selectedItems.map((item, idx) => {
                const qty = itemQuantities[item.id] || 1;
                const isHovered = activeHoverId === item.id;
                const lineTotal = item.price * qty;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveHoverId(item.id)}
                    onMouseLeave={() => setActiveHoverId(null)}
                    className={`p-4 transition-colors ${
                      isHovered ? 'bg-amber-50/50' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex gap-3.5">
                      {/* Product Thumbnail */}
                      <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-slate-900/85 text-white text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                      </div>

                      {/* Information */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              {item.brand}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              aria-label={`${item.name} 삭제`}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer print:hidden"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.dimensions}
                          </p>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                          {/* Quantity control */}
                          <div className="flex items-center gap-1.5 print:hidden">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              disabled={qty <= 1}
                              aria-label="수량 감소"
                              className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-900 w-5 text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              aria-label="수량 증가"
                              className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Print only quantity */}
                          <div className="hidden print:block text-xs font-semibold text-slate-700">
                            수량: {qty}개
                          </div>

                          {/* Individual Price (개별 가격) */}
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-900">
                              {formatPriceNumber(lineTotal)}
                            </div>
                            {qty > 1 && (
                              <div className="text-[10px] text-slate-400">
                                개당 {formatPriceNumber(item.price)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Box: Total Amount (가구 가격 합계) */}
            <div className="p-5 bg-slate-900 text-white space-y-3">
              <div className="flex justify-between text-xs text-slate-300">
                <span>총 선택 가구 수량</span>
                <span>{totalQuantity}개</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>제품 공급가액 (소계)</span>
                <span>{formatPriceNumber(Math.round(subtotalAmount / 1.1))}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>부가가치세 (10% 포함)</span>
                <span>{formatPriceNumber(subtotalAmount - Math.round(subtotalAmount / 1.1))}</span>
              </div>

              <div className="pt-3 border-t border-slate-700/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-medium text-amber-300 block">최종 제안 총액</span>
                  <span className="text-[10px] text-slate-400">배송 및 기본 조립 포함</span>
                </div>
                <div className="text-2xl font-black text-amber-400 tracking-tight">
                  {formatPriceNumber(totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Guarantee Note */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-xs text-slate-600 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">제안 안내 사항</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                본 제안서는 고객 사전 상담용 가구 구성안으로, 현장 실측 및 재고 상황에 따라 규격과 출고 일정이 변동될 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Professional Proposal Print / PDF Modal */}
      <ProposalPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        filter={filter}
        selectedItems={selectedItems}
        itemQuantities={itemQuantities}
      />
    </div>
  );
};
