import React, { useRef, useState } from 'react';
import { FurnitureItem, ProposalFilter } from '../types';
import { formatPriceNumber } from '../utils/format';
import { STYLES, BRANDS } from '../data/furnitureData';
import {
  Printer,
  Download,
  X,
  Check,
  ExternalLink,
  Building2,
  Calendar,
  User,
  Info,
} from 'lucide-react';

interface ProposalPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: ProposalFilter;
  selectedItems: FurnitureItem[];
  itemQuantities: Record<string, number>;
}

export const ProposalPrintModal: React.FC<ProposalPrintModalProps> = ({
  isOpen,
  onClose,
  filter,
  selectedItems,
  itemQuantities,
}) => {
  const [clientName, setClientName] = useState('소중한 고객님');
  const [proposerName, setProposerName] = useState('가구 제안 디자인팀');
  const [proposalNotes, setProposalNotes] = useState(
    '본 제안서는 고객 맞춤형 공간 인테리어 구성안으로, 제안일로부터 14일간 유효합니다.'
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [printFeedback, setPrintFeedback] = useState<string | null>(null);

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const styleInfo = STYLES.find((s) => s.id === filter.style) || STYLES[0];
  const brandInfo = BRANDS.find((b) => b.id === filter.brand) || BRANDS[0];

  const totalQuantity = selectedItems.reduce((acc, item) => acc + (itemQuantities[item.id] || 1), 0);
  const subtotalAmount = selectedItems.reduce(
    (acc, item) => acc + item.price * (itemQuantities[item.id] || 1),
    0
  );
  const supplyPrice = Math.round(subtotalAmount / 1.1);
  const vatAmount = subtotalAmount - supplyPrice;
  const totalAmount = subtotalAmount;

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate self-contained standalone HTML for offline/new tab printing
  const generateProposalHtml = () => {
    const rowsHtml = selectedItems
      .map((item, idx) => {
        const qty = itemQuantities[item.id] || 1;
        const lineTotal = item.price * qty;
        return `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 8px; text-align: center; color: #64748b; font-size: 12px;">${idx + 1}</td>
            <td style="padding: 10px 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${item.imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />
                <div>
                  <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">[${item.brand}]</span>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${item.name}</div>
                  <div style="font-size: 11px; color: #64748b;">${item.dimensions} · ${item.color}</div>
                </div>
              </div>
            </td>
            <td style="padding: 10px 8px; text-align: right; font-size: 13px; font-weight: 600; color: #334155;">${formatPriceNumber(item.price)}</td>
            <td style="padding: 10px 8px; text-align: center; font-size: 13px; font-weight: 700; color: #0f172a;">${qty}</td>
            <td style="padding: 10px 8px; text-align: right; font-size: 13px; font-weight: 700; color: #0f172a;">${formatPriceNumber(lineTotal)}</td>
          </tr>
        `;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>가구 제안서 및 견적서 - ${clientName}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .title { font-size: 24px; font-weight: 800; margin: 0; color: #0f172a; }
    .subtitle { font-size: 13px; color: #475569; margin-top: 4px; }
    .meta-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .room-preview {
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }
    .room-preview img {
      width: 100%;
      max-height: 240px;
      object-fit: cover;
      display: block;
    }
    .room-caption {
      padding: 8px 12px;
      background: #0f172a;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 12px;
      font-weight: 700;
      padding: 10px 8px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
    }
    .total-card {
      background: #0f172a;
      color: #ffffff;
      padding: 16px 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .notes {
      font-size: 12px;
      color: #64748b;
      border-top: 1px dashed #cbd5e1;
      padding-top: 12px;
    }
    .print-actions {
      margin-bottom: 20px;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      gap: 10px;
    }
    @media print {
      .print-actions { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button onclick="window.print()" style="padding: 8px 16px; background: #0f172a; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
      🖨️ 인쇄 / PDF로 저장하기
    </button>
    <button onclick="window.close()" style="padding: 8px 16px; background: #e2e8f0; color: #334155; border: none; border-radius: 6px; cursor: pointer;">
      닫기
    </button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">가구 제안서 및 공간 견적서</h1>
      <div class="subtitle">공간 무드: ${styleInfo.title} (${styleInfo.subtitle})</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748b;">
      <div><strong>제안일자:</strong> ${todayStr}</div>
      <div><strong>문서번호:</strong> PROP-${Date.now().toString().slice(-6)}</div>
    </div>
  </div>

  <div class="meta-box">
    <div>
      <div><strong>수신 (고객명):</strong> ${clientName}</div>
      <div style="margin-top: 4px;"><strong>추천 스타일:</strong> ${styleInfo.title}</div>
      <div style="margin-top: 4px;"><strong>주요 브랜드:</strong> ${brandInfo.name}</div>
    </div>
    <div>
      <div><strong>제안자 (담당부서):</strong> ${proposerName}</div>
      <div style="margin-top: 4px;"><strong>제안 품목 수량:</strong> 총 ${selectedItems.length}종 (${totalQuantity}개)</div>
      <div style="margin-top: 4px;"><strong>배송 및 조립:</strong> 기본 포함</div>
    </div>
  </div>

  <div class="room-preview">
    <img src="${styleInfo.roomBgUrl}" alt="${styleInfo.title} 룸 연출" />
    <div class="room-caption">
      <span>${styleInfo.title} 맞춤 가구 공간 배치 콘셉트</span>
      <span>${selectedItems.map((_, i) => `[가구 ${i + 1}]`).join(' ')}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px;">No</th>
        <th>제안 가구 정보</th>
        <th style="width: 120px; text-align: right;">개별 단가</th>
        <th style="width: 60px; text-align: center;">수량</th>
        <th style="width: 130px; text-align: right;">합계 금액</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="total-card">
    <div>
      <div style="font-size: 12px; color: #94a3b8;">공급가액: ${formatPriceNumber(supplyPrice)} | 부가세(10%): ${formatPriceNumber(vatAmount)}</div>
      <div style="font-size: 14px; font-weight: 700; color: #f8fafc; margin-top: 2px;">최종 제안 총액 (VAT 포함)</div>
    </div>
    <div style="font-size: 24px; font-weight: 800; color: #fbbf24;">
      ${formatPriceNumber(totalAmount)}
    </div>
  </div>

  <div class="notes">
    <strong>안내사항:</strong> ${proposalNotes}
  </div>

  <script>
    // Automatically open print dialog if opened in new window
    window.onload = function() {
      setTimeout(function() {
        try { window.print(); } catch(e) {}
      }, 500);
    };
  </script>
</body>
</html>`;
  };

  // Robust Direct Print using a hidden iframe to bypass parent window/sandboxing limitations
  const handleDirectPrint = () => {
    setPrintFeedback(null);
    try {
      // 1. Create a temporary hidden iframe
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);

      const htmlContent = generateProposalHtml();
      const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;

      if (frameDoc && printFrame.contentWindow) {
        frameDoc.open();
        frameDoc.write(htmlContent);
        frameDoc.close();

        setTimeout(() => {
          try {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
            setPrintFeedback('인쇄 창이 호출되었습니다.');
          } catch (err) {
            console.warn('Iframe print error, falling back to window.print():', err);
            window.print();
          } finally {
            setTimeout(() => {
              if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
              }
            }, 5000);
          }
        }, 500);
      } else {
        window.print();
      }
    } catch (e) {
      console.warn('Direct print attempt fallback:', e);
      window.print();
    }
  };

  // Open in New Window/Tab
  const handleOpenInNewTab = () => {
    try {
      const htmlContent = generateProposalHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const newWin = window.open(blobUrl, '_blank');
      if (!newWin) {
        // Pop-up blocked, fallback to download
        handleDownloadHtml();
      }
    } catch (e) {
      console.error(e);
      handleDownloadHtml();
    }
  };

  // Download Standalone Proposal Document (.html) which user can open anywhere and Print/Save as PDF
  const handleDownloadHtml = () => {
    setIsDownloading(true);
    try {
      const htmlContent = generateProposalHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `가구제안서_${clientName.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setPrintFeedback('제안서 파일이 다운로드되었습니다. 더블클릭하여 바로 인쇄/PDF 저장 가능합니다.');
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">가구 제안서 출력 및 PDF 저장</h3>
              <p className="text-xs text-slate-300">고객 제출용 정식 제안서 서식 미리보기 & 인쇄</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Input Fields Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> 수신 고객명
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="예: 김민우 고객님"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" /> 제안자 / 소속
              </label>
              <input
                type="text"
                value={proposerName}
                onChange={(e) => setProposerName(e.target.value)}
                placeholder="예: 리빙컨설팅 1팀"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* 3 Print/Export Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Primary Direct Print */}
              <button
                type="button"
                onClick={handleDirectPrint}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>지금 바로 인쇄하기</span>
              </button>

              {/* Open in New Tab for Browser Native Print */}
              <button
                type="button"
                onClick={handleOpenInNewTab}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>새 창에서 인쇄 / PDF</span>
              </button>

              {/* Download standalone HTML/Report */}
              <button
                type="button"
                onClick={handleDownloadHtml}
                disabled={isDownloading}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>제안서 파일(.html) 다운로드</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5"
            >
              닫기
            </button>
          </div>

          {/* Feedback notice if triggered */}
          {printFeedback && (
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{printFeedback}</span>
            </div>
          )}
        </div>

        {/* Scrollable A4 Proposal Document Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/60">
          <div
            ref={printAreaRef}
            className="bg-white max-w-[760px] mx-auto rounded-xl shadow-md p-6 sm:p-10 border border-slate-300 text-slate-900"
          >
            {/* Proposal Document Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-6">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                  Interior Proposal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  가구 제안서 및 공간 견적서
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  공간 스타일: {styleInfo.title} ({styleInfo.subtitle})
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <div>
                  <strong className="text-slate-700">제안일자:</strong> {todayStr}
                </div>
                <div>
                  <strong className="text-slate-700">문서번호:</strong> PROP-2026
                </div>
              </div>
            </div>

            {/* Recipient & Proposer Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-xs">
              <div className="space-y-1">
                <div>
                  <span className="text-slate-500">수신 고객명: </span>
                  <strong className="text-slate-900 font-bold">{clientName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">추천 인테리어 무드: </span>
                  <span className="text-slate-800 font-semibold">{styleInfo.title}</span>
                </div>
                <div>
                  <span className="text-slate-500">선택 브랜드 컬렉션: </span>
                  <span className="text-slate-800 font-semibold">{brandInfo.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div>
                  <span className="text-slate-500">제안 담당부서: </span>
                  <strong className="text-slate-900 font-bold">{proposerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">제안 품목 수량: </span>
                  <span className="text-slate-800 font-semibold">총 {selectedItems.length}종 ({totalQuantity}개)</span>
                </div>
                <div>
                  <span className="text-slate-500">배송 및 기본 조립: </span>
                  <span className="text-emerald-700 font-bold">기본 포함 (무상)</span>
                </div>
              </div>
            </div>

            {/* Room Placement Preview Image */}
            <div className="rounded-xl overflow-hidden border border-slate-200 mb-6 bg-slate-950 relative">
              <img
                src={styleInfo.roomBgUrl}
                alt={`${styleInfo.title} 공간 연출`}
                className="w-full max-h-[220px] object-cover"
              />
              <div className="p-2.5 bg-slate-900 text-white text-xs flex justify-between items-center">
                <span className="font-bold">{styleInfo.title} 실제 공간 배치 연출안</span>
                <span className="text-amber-300 font-medium text-[11px]">
                  {selectedItems.length}개 가구 조화 매칭
                </span>
              </div>
            </div>

            {/* Detailed Furniture Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 text-center w-10">No</th>
                    <th className="py-2.5 px-3">가구명 / 규격 / 소재</th>
                    <th className="py-2.5 px-3 text-right">개별 단가</th>
                    <th className="py-2.5 px-3 text-center w-14">수량</th>
                    <th className="py-2.5 px-3 text-right">합계 금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedItems.map((item, idx) => {
                    const qty = itemQuantities[item.id] || 1;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-9 h-9 rounded-md object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                                {item.brand}
                              </span>
                              <div className="font-bold text-slate-900">{item.name}</div>
                              <div className="text-[10px] text-slate-500">
                                {item.dimensions} · {item.color}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-600">
                          {formatPriceNumber(item.price)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {qty}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {formatPriceNumber(item.price * qty)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Summary Box */}
            <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="space-y-0.5">
                <div className="text-[11px] text-slate-400">
                  공급가액: {formatPriceNumber(supplyPrice)} / 부가가치세(10%): {formatPriceNumber(vatAmount)}
                </div>
                <div className="text-xs font-bold text-slate-200">
                  가구 제안 총액 견적 (배송 및 기본 조립 포함)
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                {formatPriceNumber(totalAmount)}
              </div>
            </div>

            {/* Footer Notes */}
            <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-200 space-y-1">
              <div>
                <strong className="text-slate-700">제안 유의사항:</strong> {proposalNotes}
              </div>
              <div>본 문서는 가구 제안 솔루션 시스템에 의해 공인 출력된 정식 제안서입니다.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
