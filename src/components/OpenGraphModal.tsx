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
} from 'lucide-react';

interface OpenGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenGraphModal: React.FC<OpenGraphModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'kakao' | 'social' | 'twitter' | 'code'>('kakao');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
  const ogImageUrl = '/og-image.jpg';
  const siteTitle = '가구 제안 앱';
  const siteDesc = '스타일·브랜드·가격대를 바탕으로 가구를 추천받고 공간 배치와 개별 가격 및 합계를 확인하는 제안 앱';

  const metaTagsCode = `<!-- Open Graph / KakaoTalk / Facebook / Slack -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${siteTitle}" />
<meta property="og:title" content="${siteTitle}" />
<meta property="og:description" content="${siteDesc}" />
<meta property="og:image" content="${currentUrl}/og-image.jpg" />
<meta property="og:image:secure_url" content="${currentUrl}/og-image.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="675" />
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

  const handleDownloadOgImage = () => {
    const a = document.createElement('a');
    a.href = ogImageUrl;
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
                <h3 className="text-base font-bold text-white">배포용 오픈 그래프(Open Graph) 설정 완료</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  1200 × 675 규격
                </span>
              </div>
              <p className="text-xs text-slate-300">카카오톡, 페이스북, 슬랙, 트위터 배포 시 표시되는 링크 미리보기</p>
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
            <span>HTML 메타태그 복사</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-8 flex-1 overflow-y-auto bg-slate-50">
          {/* 1. KakaoTalk Mock Preview */}
          {activeTab === 'kakao' && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-4">
                <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
                  카카오톡 메시지 전송 시 링크 카드 미리보기
                </span>
              </div>

              {/* Chat bubble simulation */}
              <div className="bg-[#B2C7D9] p-4 sm:p-6 rounded-2xl shadow-inner">
                <div className="max-w-[320px] ml-auto">
                  {/* Chat balloon */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-black/5">
                    {/* OG Image */}
                    <div className="relative aspect-[1.91/1] overflow-hidden bg-slate-200">
                      <img
                        src={ogImageUrl}
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
                      <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span className="truncate">{currentUrl.replace(/^https?:\/\//, '')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-600 mt-1 pr-1">오후 2:30</div>
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
                <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-100">
                  <img
                    src={ogImageUrl}
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
                <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={ogImageUrl}
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
                  HTML &lt;head&gt; 적용 소스코드 (index.html에 자동 적용 완료)
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
          <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={ogImageUrl}
                alt="OG Thumbnail"
                className="w-16 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">배포 에셋: public/og-image.jpg</div>
                <div className="text-[11px] text-slate-500">
                  해상도 1200 × 675 (16:9) · 고화질 가구 큐레이션 쇼케이스 디자인
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
                <span>이미지 파일 다운로드</span>
              </button>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? '복사 완료' : '사이트 URL 복사'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>배포 후 카카오톡 공유, SNS 링크 전송 시 위와 같이 자동 썸네일 카드로 표시됩니다.</span>
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
