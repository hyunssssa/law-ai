import React, { useState } from 'react';
import { SAMPLE_CORRECTION_ORDER } from '../data/sampleData';
import { CorrectionAnalysis } from '../types';
import { 
  Scale, 
  Sparkles, 
  FileCheck2, 
  Copy, 
  Check, 
  AlertTriangle, 
  Loader2, 
  BookOpen, 
  FileSignature 
} from 'lucide-react';

export const CorrectionOrderHelper: React.FC = () => {
  const [correctionText, setCorrectionText] = useState(SAMPLE_CORRECTION_ORDER);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CorrectionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const handleAnalyze = async () => {
    if (!correctionText.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correctionText }),
      });

      if (!res.ok) {
        throw new Error('보정권고 분석 처리에 실패했습니다.');
      }

      const data: CorrectionAnalysis = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDraft = () => {
    if (!analysis?.draftResponse) return;
    navigator.clipboard.writeText(analysis.draftResponse);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>보정권고(보정명령) AI 전담 해결사</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-600 font-medium">서울회생법원 실무준칙 연계</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            법원 보정권고문 AI 분석 및 답변서 자동 작성
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            법원 회생위원으로부터 송달받은 보정권고문을 붙여넣으면 소명 전략과 법원 제출용 보정서 초안을 완성합니다.
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !correctionText.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI 분석 및 보정서 작성 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Gemini AI 보정권고 분석 실행</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>법원 보정권고문 입력</span>
              </h3>
              <button
                onClick={() => setCorrectionText(SAMPLE_CORRECTION_ORDER)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                예시 다시 불러오기
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              전자소송 또는 우편으로 수령한 보정권고/보정명령서의 텍스트를 그대로 붙여넣으세요.
            </p>

            <textarea
              rows={14}
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder="법원 보정권고문 내용을 입력하세요..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>권장: 대출금 사용처 및 코인/가족이체 소명 명령</span>
              <span>글자수: {correctionText.length}자</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>보정기한 준수 안내</span>
            </h4>
            <p className="leading-relaxed text-slate-700">
              보정권고는 통상 <strong>송달일로부터 14일 이내</strong>에 제출해야 합니다. 기한 내 미제출 시 기각 사유가 될 수 있으므로, AI 초안을 검토하신 후 신속히 담당 변호사 또는 법원에 제출하시기 바랍니다.
            </p>
          </div>
        </div>

        {/* Right Column: AI Analysis Output */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-800">
                회생법원 실무준칙과 판례를 대조하여 보정 답변서를 생성하고 있습니다...
              </p>
              <p className="text-xs text-slate-400">
                대출금 사용처 대조표 및 가상자산 손실금 청산가치 제외 법리 검토 중
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !analysis && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">보정권고 AI 분석 준비 완료</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                좌측의 보정권고문을 확인하신 후 상단의 <strong>[Gemini AI 보정권고 분석 실행]</strong> 버튼을 누르시면, 회생위원을 설득할 수 있는 법률 서면과 필수 서류 목록이 생성됩니다.
              </p>
            </div>
          )}

          {!isLoading && analysis && (
            <div className="space-y-4">
              
              {/* Box 1: Court Demands Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>1. 법원 회생위원 핵심 요구사항 요약</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed">
                  {analysis.courtDemandSummary}
                </div>
              </div>

              {/* Box 2: Required Documents */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>2. 법원 제출 필수 증빙 서류 체크리스트</span>
                </h4>
                <ul className="space-y-1.5">
                  {analysis.requiredDocuments?.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-800 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                      <FileCheck2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-medium">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Box 3: Response Strategy */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>3. 회생위원 설득을 위한 법리적 대응 전략</span>
                </h4>
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/60 rounded-lg text-xs text-emerald-950 leading-relaxed">
                  {analysis.responseStrategy}
                </div>
              </div>

              {/* Box 4: Formal Legal Response Draft */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4 text-blue-600" />
                    <span>4. 법원 제출용 보정서 본문 소명 초안</span>
                  </h4>
                  <button
                    onClick={handleCopyDraft}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? '복사 완료' : '초안 복사'}</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {analysis.draftResponse}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
