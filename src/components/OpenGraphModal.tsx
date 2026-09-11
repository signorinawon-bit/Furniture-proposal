import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Smartphone,
  Globe,
  Sparkles,
  Code2,
  RefreshCw,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface OpenGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenGraphModal: React.FC<OpenGraphModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'kakao' | 'social' | 'twitter' | 'code'>('kakao');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedFreshUrl, setCopiedFreshUrl] = useState(false);

  if (!isOpen) return null;

  // Use the canonical production shared URL or current origin
  const defaultOrigin = 'https://ais-pre-wdcb2wnzxywn4i2plynduo-454676454695.asia-northeast1.run.app';
  const currentUrl = typeof window !== 'undefined' && !window.location.origin.includes('localhost')
    ? window.location.origin
    : defaultOrigin;
    
  const ogImageUrl = `${currentUrl}/og-image.jpg`;
  const siteTitle = '가구 제안 앱 - 맞춤 가구 및 공간 인테리어 견적';
  const siteDesc = '스타일·브랜드·예산 맞춤 가구 추천과 공간 연출 배치 및 상세 견적서';

  // Fresh URL with timestamp parameter to bypass KakaoTalk's aggressive caching
  const freshShareUrl = `${currentUrl}?k=${Date.now().toString().slice(-6)}`;

  const metaTagsCode = `<!-- Open Graph / KakaoTalk / Facebook / Slack -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="가구 제안 앱" />
<meta property="og:title" content="${siteTitle}" />
<meta property="og:description" content="${siteDesc}" />
<meta property="og:url" content="${currentUrl}" />
<meta property="og:image" content="${currentUrl}/og-image.jpg" />
<meta property="og:image:secure_url" content="${currentUrl}/og-image.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1376" />
<meta property="og:image:height" content="768" />
<meta property="og:image:alt" content="가구 제안 앱 공간 맞춤 가구 큐레이션 및 인테리어 제안서" />
<meta property="og:locale" content="ko_KR" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${siteTitle}" />
<meta name="twitter:description" content="${siteDesc}" />
<meta name="twitter:image" content="${currentUrl}/og-image.jpg" />`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(metaTagsCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  };

  const handleCopyFreshUrl = () => {
    navigator.clipboard.writeText(freshShareUrl).then(() => {
      setCopiedFreshUrl(true);
      setTimeout(() => setCopiedFreshUrl(false), 2500);
    });
  };

  const handleDownloadOgImage = () => {
    const a = document.createElement('a');
    a.href = '/og-image.jpg';
    a.download = 'og-image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">카카오톡 & 배포용 오픈 그래프(OG) 설정</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold">
                  카카오톡 공식 규격 적용
                </span>
              </div>
              <p className="text-xs text-slate-300">카카오톡 채팅방에 링크 전송 시 큰 썸네일 그림이 함께 나타납니다.</p>
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-100/80 border-b border-slate-200 text-xs font-semibold shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('kakao')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'kakao'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>카카오톡 미리보기</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>페이스북 / 슬랙 리치 카드</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('twitter')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'twitter'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>X (Twitter) Large 카드</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ml-auto ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>적용된 메타태그</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-7 flex-1 overflow-y-auto bg-slate-50 space-y-5">
          {/* 1. KakaoTalk Mock Preview */}
          {activeTab === 'kakao' && (
            <div className="space-y-4">
              {/* Important KakaoTalk Tips Notification */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>카카오톡 그림 노출 핵심 요건 완료</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  1. <strong>절대 HTTPS 경로</strong>: 카카오톡 스크랩 엔진은 상대경로(/og-image.jpg)를 지원하지 않으므로 <code className="bg-amber-100/70 px-1 rounded font-mono font-semibold">https://.../og-image.jpg</code> 절대경로로 완전 적용되었습니다.
                </p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  2. <strong>카카오톡 캐시 주의</strong>: 이미 카카오톡에 한 번 보낸 주소는 이전 결과(그림 없음)가 캐시되어 있을 수 있습니다. 아래 <strong>[캐시 우회 링크 복사]</strong>를 눌러 바로 카카오톡에 전송해 보세요!
                </p>
              </div>

              {/* Chat bubble simulation */}
              <div className="bg-[#B2C7D9] p-4 sm:p-6 rounded-2xl shadow-inner max-w-lg mx-auto">
                <div className="max-w-[320px] ml-auto">
                  {/* Chat balloon */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-black/5 transition-transform hover:scale-[1.01]">
                    {/* OG Image */}
                    <div className="relative aspect-[1.79/1] overflow-hidden bg-slate-200">
                      <img
                        src="/og-image.jpg"
                        alt="가구 제안 앱 오픈그래프"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* OG Text Content */}
                    <div className="p-3.5">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                        {siteTitle}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {siteDesc}
                      </p>
                      <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{currentUrl.replace(/^https?:\/\//, '')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-600 mt-1 pr-1 font-medium">오후 2:30</div>
                </div>
              </div>

              {/* Kakao-specific Action Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>카카오톡 즉시 테스트 (캐시 없는 신규 링크)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    카카오톡이 새 이미지를 바로 긁어오도록 타임스탬프 파라미터가 포함된 주소입니다.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyFreshUrl}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    {copiedFreshUrl ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFreshUrl ? '카카오 테스트 링크 복사됨!' : '캐시 우회 링크 복사'}</span>
                  </button>

                  <a
                    href={`https://developers.kakao.com/tool/clear/og?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="카카오 공식 개발자 OG 캐시 초기화 도구"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>카카오 OG 캐시 삭제 도구</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 2. Facebook / Slack Preview */}
          {activeTab === 'social' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
                  페이스북, 링크드인, 슬랙 웹훅 링크 카드
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-[1.79/1] w-full overflow-hidden bg-slate-100">
                  <img
                    src="/og-image.jpg"
                    alt="가구 제안 앱 오픈그래프"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                    {currentUrl.replace(/^https?:\/\//, '')}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base mt-0.5">{siteTitle}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{siteDesc}</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Twitter Card Preview */}
          {activeTab === 'twitter' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
                  X (Twitter) Large Image Summary Card
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
                <div className="aspect-[1.79/1] w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src="/og-image.jpg"
                    alt="가구 제안 앱 오픈그래프"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[10px] rounded font-medium">
                    {currentUrl.replace(/^https?:\/\//, '')}
                  </div>
                </div>
                <div className="p-3.5">
                  <h4 className="font-bold text-slate-900 text-sm">{siteTitle}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{siteDesc}</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. Code / Meta tags */}
          {activeTab === 'code' && (
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  HTML &lt;head&gt; 메타태그 (index.html에 실제 반영 완료)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? '복사됨!' : '코드 복사'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                {metaTagsCode}
              </pre>
            </div>
          )}

          {/* Asset Info Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/og-image.jpg"
                alt="OG Thumbnail"
                className="w-16 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">배포 에셋: public/og-image.jpg</div>
                <div className="text-[11px] text-slate-500">
                  해상도 1376 × 768 (16:9 와이드) · 절대 경로 HTTPS 연결 완료
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadOgImage}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>이미지 다운로드</span>
              </button>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? '복사 완료' : '기본 URL 복사'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>카카오톡 전송 시 위 시뮬레이션 카드와 동일하게 고해상도 가구 이미지가 함께 전송됩니다.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

